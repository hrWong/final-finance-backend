package com.vazy.finalfinance.transaction.vo;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        Long id,
        String symbol,
        String assetName,
        String type,
        LocalDate tradeDate,
        BigDecimal quantity,
        BigDecimal price,
        BigDecimal grossAmount,
        BigDecimal commission,
        BigDecimal tax,
        BigDecimal netAmount,
        String currency,
        String note
) {
}
