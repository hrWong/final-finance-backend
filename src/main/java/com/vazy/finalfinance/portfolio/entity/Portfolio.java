package com.vazy.finalfinance.portfolio.entity;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Portfolio {
    private Long id;
    private String name;
    private String baseCurrency;
    private Boolean isDefault;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
