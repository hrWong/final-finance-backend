package com.vazy.finalfinance.market.dto;

import java.math.BigDecimal;

public record MarketQuote(
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
        BigDecimal dividendYield
) {
}
