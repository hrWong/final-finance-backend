package com.vazy.finalfinance.dashboard.service;

import com.vazy.finalfinance.asset.entity.Asset;
import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.dashboard.vo.AllocationItemResponse;
import com.vazy.finalfinance.dashboard.vo.DashboardSummaryResponse;
import com.vazy.finalfinance.portfolio.entity.Portfolio;
import com.vazy.finalfinance.portfolio.mapper.PortfolioMapper;
import com.vazy.finalfinance.position.entity.PortfolioPosition;
import com.vazy.finalfinance.position.mapper.PortfolioPositionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final long DEFAULT_PORTFOLIO_ID = 1L;

    private final PortfolioPositionMapper positionMapper;
    private final PortfolioMapper portfolioMapper;
    private final AssetMapper assetMapper;

    public DashboardSummaryResponse getSummary() {
        Portfolio portfolio = portfolioMapper.findDefaultPortfolio();
        String baseCurrency = portfolio != null ? portfolio.getBaseCurrency() : "USD";

        List<PortfolioPosition> positions = positionMapper.findAllByPortfolio(DEFAULT_PORTFOLIO_ID);
        if (positions == null || positions.isEmpty()) {
            return new DashboardSummaryResponse(
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, BigDecimal.ZERO,
                    BigDecimal.ZERO, baseCurrency
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
                totalValue,
                investedAmount,
                totalPnl,
                totalPnlPct,
                BigDecimal.ZERO,  // dailyPnl — 需要实时行情才能算
                BigDecimal.ZERO,  // dailyPnlPct
                BigDecimal.ZERO,  // cash
                baseCurrency
        );
    }

    public List<AllocationItemResponse> getAllocation() {
        List<PortfolioPosition> positions = positionMapper.findAllByPortfolio(DEFAULT_PORTFOLIO_ID);
        if (positions == null || positions.isEmpty()) {
            return Collections.emptyList();
        }

        BigDecimal totalValue = positions.stream()
                .map(p -> p.getMarketValue() != null ? p.getMarketValue() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return positions.stream()
                .map(pos -> {
                    String label = "Unknown";
                    if (pos.getAssetId() != null) {
                        Asset asset = assetMapper.findById(pos.getAssetId());
                        if (asset != null) {
                            label = asset.getSymbol();
                        }
                    }
                    BigDecimal value = pos.getMarketValue() != null ? pos.getMarketValue() : BigDecimal.ZERO;
                    BigDecimal weight = totalValue.compareTo(BigDecimal.ZERO) != 0
                            ? value.divide(totalValue, 4, RoundingMode.HALF_UP)
                            : BigDecimal.ZERO;
                    return new AllocationItemResponse(label, value, weight);
                })
                .toList();
    }
}
