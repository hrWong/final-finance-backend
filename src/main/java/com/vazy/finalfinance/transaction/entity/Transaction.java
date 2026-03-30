package com.vazy.finalfinance.transaction.entity;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class Transaction {
    private Long id;
    private Long portfolioId;
    private Long assetId;
    private String type;
    private LocalDate tradeDate;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal grossAmount;
    private BigDecimal commission;
    private BigDecimal tax;
    private BigDecimal netAmount;
    private String currency;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
