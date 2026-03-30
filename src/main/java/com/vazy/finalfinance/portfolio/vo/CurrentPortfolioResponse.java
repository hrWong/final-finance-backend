package com.vazy.finalfinance.portfolio.vo;

public record CurrentPortfolioResponse(
        Long id,
        String name,
        String baseCurrency,
        boolean isDefault,
        String description
) {
}
