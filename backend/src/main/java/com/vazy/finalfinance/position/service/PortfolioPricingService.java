package com.vazy.finalfinance.position.service;

import com.vazy.finalfinance.asset.entity.Asset;
import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.market.dto.MarketHistoryPoint;
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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
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
    private static final LocalTime DEFAULT_MARKET_CLOSE_TIME = LocalTime.of(16, 0);

    private final PortfolioPositionMapper positionMapper;
    private final AssetMapper assetMapper;
    private final MarketDataService marketDataService;
    private final PositionRebuildService positionRebuildService;

    @Scheduled(cron = "${portfolio.pricing.refresh-cron:0 15 8 * * MON-FRI}", zone = "${portfolio.pricing.time-zone:America/New_York}")
    public void refreshCurrentPortfolioPreviousClosePrices() {
        refreshPortfolioPreviousClosePrices(DEFAULT_PORTFOLIO_ID);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void refreshCurrentPortfolioPreviousClosePricesOnStartup() {
        log.info("Refreshing previous-close pricing snapshot on application startup");
        refreshCurrentPortfolioPreviousClosePrices();
    }

    public void refreshPortfolioPreviousClosePrices(Long portfolioId) {
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

        Map<String, BigDecimal> previousCloses = resolvePricingSnapshot(
                assetsById.values().stream().map(Asset::getSymbol).toList()
        );
        if (previousCloses.isEmpty()) {
            return;
        }

        boolean updated = false;
        for (PortfolioPosition position : positions) {
            Asset asset = assetsById.get(position.getAssetId());
            if (asset == null) {
                continue;
            }
            BigDecimal previousClose = previousCloses.get(asset.getSymbol());
            if (applyPreviousClose(position, asset, previousClose)) {
                updated = true;
            }
        }

        if (updated) {
            positionRebuildService.rebuildPortfolioSummary(portfolioId);
        }
    }

    public void refreshCurrentAssetPreviousClose(Long assetId) {
        refreshAssetPreviousClose(DEFAULT_PORTFOLIO_ID, assetId);
        positionRebuildService.rebuildPortfolioSummary(DEFAULT_PORTFOLIO_ID);
    }

    public boolean refreshAssetPreviousClose(Long portfolioId, Long assetId) {
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

        BigDecimal previousClose = resolvePricingSnapshot(List.of(asset.getSymbol()))
                .get(asset.getSymbol());
        if (previousClose == null) {
            return false;
        }

        return applyPreviousClose(position, asset, previousClose);
    }

    private boolean applyPreviousClose(PortfolioPosition position, Asset asset, BigDecimal previousClose) {
        if (position == null || asset == null || previousClose == null) {
            return false;
        }

        BigDecimal marketValue = position.getQuantity()
                .multiply(previousClose)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal costBasis = position.getCostBasis() != null ? position.getCostBasis() : BigDecimal.ZERO;
        BigDecimal unrealizedPnl = marketValue.subtract(costBasis);
        BigDecimal unrealizedPnlPct = costBasis.compareTo(BigDecimal.ZERO) != 0
                ? unrealizedPnl.divide(costBasis, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        position.setLastPrice(previousClose);
        position.setMarketValue(marketValue);
        position.setUnrealizedPnl(unrealizedPnl);
        position.setUnrealizedPnlPct(unrealizedPnlPct);
        position.setPriceAsOf(resolvePreviousCloseAsOf());
        positionMapper.update(position);

        log.info("Refreshed previous close for assetId={}, symbol={}, close={}, asOf={}",
                asset.getId(), asset.getSymbol(), previousClose, position.getPriceAsOf());
        return true;
    }

    private Map<String, BigDecimal> resolvePricingSnapshot(List<String> symbols) {
        if (shouldUseLatestClosedHistory()) {
            return symbols.stream()
                    .distinct()
                    .map(this::resolveLatestClosedHistoryPrice)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toMap(
                            SymbolClose::symbol,
                            SymbolClose::close,
                            (left, right) -> left,
                            java.util.LinkedHashMap::new
                    ));
        }
        return marketDataService.getPreviousCloses(symbols);
    }

    private boolean shouldUseLatestClosedHistory() {
        LocalDate marketDate = LocalDate.now(DEFAULT_MARKET_ZONE);
        DayOfWeek marketDay = marketDate.getDayOfWeek();
        if (marketDay == DayOfWeek.SATURDAY || marketDay == DayOfWeek.SUNDAY) {
            return true;
        }
        LocalTime marketTime = java.time.LocalTime.now(DEFAULT_MARKET_ZONE);
        return !marketTime.isBefore(DEFAULT_MARKET_CLOSE_TIME);
    }

    private SymbolClose resolveLatestClosedHistoryPrice(String symbol) {
        try {
            List<MarketHistoryPoint> history = marketDataService.getHistory(symbol, "1m", "1d");
            if (history == null || history.isEmpty()) {
                return null;
            }
            MarketHistoryPoint latestPoint = history.get(history.size() - 1);
            if (latestPoint == null || latestPoint.close() == null) {
                return null;
            }
            return new SymbolClose(symbol, latestPoint.close());
        } catch (RuntimeException exception) {
            log.warn("Failed to resolve latest closed history price for symbol={}", symbol, exception);
            return null;
        }
    }

    private LocalDate resolvePreviousCloseDate() {
        LocalDate referenceDate = LocalDate.now(DEFAULT_MARKET_ZONE).minusDays(1);
        while (referenceDate.getDayOfWeek() == DayOfWeek.SATURDAY
                || referenceDate.getDayOfWeek() == DayOfWeek.SUNDAY) {
            referenceDate = referenceDate.minusDays(1);
        }
        return referenceDate;
    }

    private java.time.LocalDateTime resolvePreviousCloseAsOf() {
        return resolvePreviousCloseDate().atTime(DEFAULT_MARKET_CLOSE_TIME);
    }

    private record SymbolClose(String symbol, BigDecimal close) {
    }
}
