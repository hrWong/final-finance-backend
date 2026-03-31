package com.vazy.finalfinance.market.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MarketHistoryPoint(
        LocalDate date,
        BigDecimal close
) {
}
