package com.vazy.finalfinance.stock.vo;

import java.math.BigDecimal;
import java.util.List;

public record StockOverviewResponse(
        String symbol,
        String name,
        String exchange,
        String currency,
        BigDecimal lastPrice,
        BigDecimal changeAmount,
        BigDecimal changePercent,
        BigDecimal marketCap,
        BigDecimal pe,
        BigDecimal eps,
        BigDecimal dividendYield,
        String iconUrl,
        List<String> breadcrumb
) {
}
