package com.vazy.finalfinance.dashboard.service;

import com.vazy.finalfinance.asset.entity.Asset;
import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.dashboard.vo.AllocationItemResponse;
import com.vazy.finalfinance.dashboard.vo.DashboardSummaryResponse;
import com.vazy.finalfinance.portfolio.entity.Portfolio;
import com.vazy.finalfinance.portfolio.mapper.PortfolioMapper;
import com.vazy.finalfinance.position.entity.PortfolioPosition;
import com.vazy.finalfinance.position.mapper.PortfolioPositionMapper;
import com.vazy.finalfinance.position.vo.PositionResponse;
import com.vazy.finalfinance.wallet.entity.WalletAccount;
import com.vazy.finalfinance.wallet.mapper.WalletMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final long DEFAULT_PORTFOLIO_ID = 1L;

    private final PortfolioPositionMapper positionMapper;
    private final PortfolioMapper portfolioMapper;
    private final AssetMapper assetMapper;
    private final WalletMapper walletMapper;

    public DashboardSummaryResponse getSummary() {
        WalletAccount account = walletMapper.getWalletByUserId("default_user");
        BigDecimal cash = account != null ? account.getBalance() : BigDecimal.ZERO;

        Portfolio portfolio = portfolioMapper.findDefaultPortfolio();
        String baseCurrency = portfolio != null ? portfolio.getBaseCurrency() : "USD";

        List<PortfolioPosition> positions = positionMapper.findAllByPortfolio(DEFAULT_PORTFOLIO_ID);
        if (positions == null || positions.isEmpty()) {
            return new DashboardSummaryResponse(
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    cash, baseCurrency
            );
        }

        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal investedAmount = BigDecimal.ZERO;
        BigDecimal totalPnl = BigDecimal.ZERO;

        for (PortfolioPosition pos : positions) {
            totalValue = totalValue.add(pos.getMarketValue() != null ? pos.getMarketValue() : BigDecimal.ZERO);
            investedAmount = investedAmount.add(pos.getCostBasis() != null ? pos.getCostBasis() : BigDecimal.ZERO);
            totalPnl = totalPnl.add(pos.getUnrealizedPnl() != null ? pos.getUnrealizedPnl() : BigDecimal.ZERO);
        }

        BigDecimal totalPnlPct = investedAmount.compareTo(BigDecimal.ZERO) != 0
                ? totalPnl.divide(investedAmount, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO;

        return new DashboardSummaryResponse(
                totalValue.add(cash),
                investedAmount.add(cash),
                totalPnl,
                totalPnlPct,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                cash,
                baseCurrency
        );
    }

    public List<AllocationItemResponse> getAllocation() {
        List<PortfolioPosition> positions = positionMapper.findAllByPortfolio(DEFAULT_PORTFOLIO_ID);
        WalletAccount account = walletMapper.getWalletByUserId("default_user");
        BigDecimal cash = account != null ? account.getBalance() : BigDecimal.ZERO;

        Map<String, CategoryStats> statsMap = new HashMap<>();

        if (positions != null) {
            for (PortfolioPosition pos : positions) {
                Asset asset = assetMapper.findById(pos.getAssetId());
                String category = mapAssetType(asset != null ? asset.getAssetType() : "OTHER");
                
                CategoryStats stats = statsMap.computeIfAbsent(category, k -> new CategoryStats());
                stats.value = stats.value.add(pos.getMarketValue() != null ? pos.getMarketValue() : BigDecimal.ZERO);
                stats.invested = stats.invested.add(pos.getCostBasis() != null ? pos.getCostBasis() : BigDecimal.ZERO);
                stats.gain = stats.gain.add(pos.getUnrealizedPnl() != null ? pos.getUnrealizedPnl() : BigDecimal.ZERO);
                stats.count++;
                
                // 将具体持仓加入列表
                stats.positions.add(toPositionResponse(pos, asset));
            }
        }

        if (cash.compareTo(BigDecimal.ZERO) > 0) {
            CategoryStats cashStats = statsMap.computeIfAbsent("Cash", k -> new CategoryStats());
            cashStats.value = cashStats.value.add(cash);
            cashStats.invested = cashStats.invested.add(cash);
            cashStats.count = 1;
        }

        BigDecimal totalValue = statsMap.values().stream()
                .map(s -> s.value)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<AllocationItemResponse> response = new ArrayList<>();
        for (Map.Entry<String, CategoryStats> entry : statsMap.entrySet()) {
            CategoryStats stats = entry.getValue();
            BigDecimal weight = totalValue.compareTo(BigDecimal.ZERO) != 0
                    ? stats.value.divide(totalValue, 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            
            BigDecimal gainPct = stats.invested.compareTo(BigDecimal.ZERO) != 0
                    ? stats.gain.divide(stats.invested, 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            response.add(new AllocationItemResponse(
                    entry.getKey(),
                    stats.value,
                    stats.invested,
                    stats.gain,
                    gainPct,
                    stats.count,
                    weight,
                    stats.positions
            ));
        }

        return response;
    }

    private String mapAssetType(String assetType) {
        if (assetType == null) return "Other Assets";
        return switch (assetType.toUpperCase()) {
            case "STOCK" -> "Stocks";
            case "ETF", "FUND" -> "Funds";
            default -> "Other Assets";
        };
    }

    private PositionResponse toPositionResponse(PortfolioPosition pos, Asset asset) {
        String symbol = asset != null ? asset.getSymbol() : "Unknown";
        String assetName = asset != null ? (asset.getNameZh() != null ? asset.getNameZh() : asset.getName()) : "Unknown";
        
        return new PositionResponse(
                symbol,
                assetName,
                pos.getQuantity(),
                pos.getAvgCost(),
                pos.getCostBasis(),
                pos.getLastPrice(),
                pos.getMarketValue(),
                pos.getUnrealizedPnl(),
                pos.getUnrealizedPnlPct(),
                pos.getPortfolioWeight(),
                pos.getPriceAsOf()
        );
    }

    private static class CategoryStats {
        BigDecimal value = BigDecimal.ZERO;
        BigDecimal invested = BigDecimal.ZERO;
        BigDecimal gain = BigDecimal.ZERO;
        int count = 0;
        List<PositionResponse> positions = new ArrayList<>();
    }
}
