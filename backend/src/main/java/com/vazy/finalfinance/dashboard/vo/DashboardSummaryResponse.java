package com.vazy.finalfinance.dashboard.vo;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        BigDecimal totalValue,
        BigDecimal investedAmount,
        BigDecimal totalPnl,
        BigDecimal totalPnlPct,
        BigDecimal cumulativePnl,
        BigDecimal dailyPnl,
        BigDecimal dailyPnlPct,
        BigDecimal cash,
        String baseCurrency
) {
}
