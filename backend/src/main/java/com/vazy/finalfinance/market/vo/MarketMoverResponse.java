package com.vazy.finalfinance.market.vo;

import java.math.BigDecimal;

public record MarketMoverResponse(
        String symbol,
        String name,
        BigDecimal lastPrice,
        BigDecimal changeAmount,
        BigDecimal changePercent,
        boolean positive
) {
}
