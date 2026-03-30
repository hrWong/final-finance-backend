package com.vazy.finalfinance.transaction.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateTransactionRequest(
        @NotBlank(message = "type is required")
        String type,
        @NotNull(message = "tradeDate is required")
        LocalDate tradeDate,
        @NotNull(message = "quantity is required")
        @DecimalMin(value = "0.000001", message = "quantity must be positive")
        BigDecimal quantity,
        @NotNull(message = "price is required")
        @DecimalMin(value = "0.00", inclusive = false, message = "price must be positive")
        BigDecimal price,
        @NotNull(message = "commission is required")
        @DecimalMin(value = "0.00", message = "commission must be non-negative")
        BigDecimal commission,
        @NotNull(message = "tax is required")
        @DecimalMin(value = "0.00", message = "tax must be non-negative")
        BigDecimal tax,
        @NotBlank(message = "currency is required")
        String currency,
        String note
) {
}
