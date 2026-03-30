package com.vazy.finalfinance.position.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PortfolioPosition {
    private Long id;
    private Long portfolioId;
    private Long assetId;
    private BigDecimal quantity;
    private BigDecimal avgCost;
    private BigDecimal costBasis;
    private BigDecimal marketValue;
    private BigDecimal unrealizedPnl;
    private BigDecimal unrealizedPnlPct;
    private BigDecimal portfolioWeight;
    private BigDecimal lastPrice;
    private LocalDateTime priceAsOf;
    private LocalDateTime updatedAt;
}
