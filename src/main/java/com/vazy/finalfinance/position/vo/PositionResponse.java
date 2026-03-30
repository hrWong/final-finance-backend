package com.vazy.finalfinance.position.vo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PositionResponse(
        String symbol,
        String assetName,
        BigDecimal quantity,
        BigDecimal avgCost,
        BigDecimal costBasis,
        BigDecimal lastPrice,
        BigDecimal marketValue,
        BigDecimal unrealizedPnl,
        BigDecimal unrealizedPnlPct,
        BigDecimal portfolioWeight,
        LocalDateTime priceAsOf
) {
}
