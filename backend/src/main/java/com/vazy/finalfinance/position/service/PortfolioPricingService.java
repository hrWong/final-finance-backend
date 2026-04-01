package com.vazy.finalfinance.position.service;

import com.vazy.finalfinance.asset.entity.Asset;
import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.market.service.MarketDataService;
import com.vazy.finalfinance.position.entity.PortfolioPosition;
import com.vazy.finalfinance.position.mapper.PortfolioPositionMapper;
import com.vazy.finalfinance.transaction.service.PositionRebuildService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortfolioPricingService {

    private static final long DEFAULT_PORTFOLIO_ID = 1L;
    private static final ZoneId DEFAULT_MARKET_ZONE = ZoneId.of("America/New_York");

    private final PortfolioPositionMapper positionMapper;
    private final AssetMapper assetMapper;
    private final MarketDataService marketDataService;
    private final PositionRebuildService positionRebuildService;

    public record PriceSnapshot(BigDecimal lastPrice, BigDecimal previousClose) {
    }

    /**
     * 定时刷新作品集内所有资产的定价快照
     * 此任务现在会同时获取实时价和昨收价
     */
    @Scheduled(cron = "${portfolio.pricing.refresh-cron:0 15 8 * * MON-FRI}", zone = "${portfolio.pricing.time-zone:America/New_York}")
    public void refreshCurrentPortfolioPrices() {
        refreshPortfolioPrices(DEFAULT_PORTFOLIO_ID);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void refreshCurrentPortfolioPricesOnStartup() {
        log.info("Refreshing pricing snapshot on application startup");
        refreshCurrentPortfolioPrices();
    }

    public void refreshPortfolioPrices(Long portfolioId) {
        List<PortfolioPosition> positions = positionMapper.findAllByPortfolio(portfolioId);
        if (positions == null || positions.isEmpty()) {
            return;
        }

        Map<Long, Asset> assetsById = positions.stream()
                .map(PortfolioPosition::getAssetId)
                .filter(Objects::nonNull)
                .distinct()
                .map(assetMapper::findById)
                .filter(Objects::nonNull)
                .filter(asset -> asset.getSymbol() != null)
                .filter(asset -> "STOCK".equalsIgnoreCase(asset.getAssetType()))
                .collect(Collectors.toMap(Asset::getId, Function.identity(), (left, right) -> left));

        if (assetsById.isEmpty()) {
            return;
        }

        Map<String, PriceSnapshot> snapshots = resolvePricingSnapshots(
                assetsById.values().stream().map(Asset::getSymbol).toList()
        );

        if (snapshots.isEmpty()) {
            return;
        }

        boolean updated = false;
        for (PortfolioPosition position : positions) {
            Asset asset = assetsById.get(position.getAssetId());
            if (asset == null) {
                continue;
            }
            PriceSnapshot snapshot = snapshots.get(asset.getSymbol());
            if (applyPrices(position, asset, snapshot)) {
                updated = true;
            }
        }

        if (updated) {
            positionRebuildService.rebuildPortfolioSummary(portfolioId);
        }
    }

    public void refreshCurrentAssetPrice(Long assetId) {
        refreshAssetPrice(DEFAULT_PORTFOLIO_ID, assetId);
        positionRebuildService.rebuildPortfolioSummary(DEFAULT_PORTFOLIO_ID);
    }

    public boolean refreshAssetPrice(Long portfolioId, Long assetId) {
        if (assetId == null) {
            return false;
        }

        PortfolioPosition position = positionMapper.findByPortfolioAndAsset(portfolioId, assetId);
        if (position == null || position.getQuantity() == null || position.getQuantity().compareTo(BigDecimal.ZERO) <= 0) {
            return false;
        }

        Asset asset = assetMapper.findById(assetId);
        if (asset == null || asset.getSymbol() == null) {
            return false;
        }
        if (!"STOCK".equalsIgnoreCase(asset.getAssetType())) {
            return false;
        }

        PriceSnapshot snapshot = resolvePricingSnapshots(List.of(asset.getSymbol()))
                .get(asset.getSymbol());
        if (snapshot == null) {
            return false;
        }

        return applyPrices(position, asset, snapshot);
    }

    /**
     * 将获取到的价格快照应用到持仓实体上并重新计算市值与盈亏
     * 关键修改：盈亏计算现在一律基于实时价格 lastPrice
     */
    private boolean applyPrices(PortfolioPosition position, Asset asset, PriceSnapshot snapshot) {
        if (position == null || asset == null || snapshot == null || snapshot.lastPrice() == null) {
            return false;
        }

        BigDecimal lastPrice = snapshot.lastPrice();
        BigDecimal previousClose = snapshot.previousClose();

        // 核心：基于实时价格计算市值
        BigDecimal marketValue = position.getQuantity()
                .multiply(lastPrice)
                .setScale(2, RoundingMode.HALF_UP);
        
        BigDecimal costBasis = position.getCostBasis() != null ? position.getCostBasis() : BigDecimal.ZERO;
        BigDecimal unrealizedPnl = marketValue.subtract(costBasis);
        BigDecimal unrealizedPnlPct = costBasis.compareTo(BigDecimal.ZERO) != 0
                ? unrealizedPnl.divide(costBasis, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        position.setLastPrice(lastPrice);                // 存储实时价
        position.setPreviousClose(previousClose);        // 存储昨日收盘价（供详情页展示）
        position.setMarketValue(marketValue);
        position.setUnrealizedPnl(unrealizedPnl);
        position.setUnrealizedPnlPct(unrealizedPnlPct);
        position.setPriceAsOf(LocalDateTime.now(DEFAULT_MARKET_ZONE));
        
        positionMapper.update(position);

        log.info("Refreshed pricing for assetId={}, symbol={}, last={}, prevClose={}, pnl={}",
                asset.getId(), asset.getSymbol(), lastPrice, previousClose, unrealizedPnl);
        return true;
    }

    private Map<String, PriceSnapshot> resolvePricingSnapshots(List<String> symbols) {
        if (symbols == null || symbols.isEmpty()) {
            return Map.of();
        }

        return marketDataService.fetchBatchSnapshots(symbols);
    }

    @Deprecated
    public void refreshPortfolioPreviousClosePrices(Long id) {}
    @Deprecated
    public void refreshCurrentAssetPreviousClose(Long id) {}
}
