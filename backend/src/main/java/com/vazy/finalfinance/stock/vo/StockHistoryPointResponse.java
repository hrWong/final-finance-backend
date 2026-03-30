package com.vazy.finalfinance.stock.vo;

import java.math.BigDecimal;
import java.time.LocalDate;

public record StockHistoryPointResponse(
        LocalDate date,
        BigDecimal close
) {
}
