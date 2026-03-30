package com.vazy.finalfinance.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "BAD_REQUEST", "Bad request"),
    ASSET_NOT_FOUND(HttpStatus.NOT_FOUND, "ASSET_NOT_FOUND", "Asset not found"),
    TRANSACTION_NOT_FOUND(HttpStatus.NOT_FOUND, "TRANSACTION_NOT_FOUND", "Transaction not found"),
    POSITION_NOT_FOUND(HttpStatus.NOT_FOUND, "POSITION_NOT_FOUND", "Position not found"),
    INVALID_SELL_QUANTITY(HttpStatus.BAD_REQUEST, "INVALID_SELL_QUANTITY", "Sell quantity exceeds current position"),
    MARKET_DATA_UNAVAILABLE(HttpStatus.BAD_GATEWAY, "MARKET_DATA_UNAVAILABLE", "Market data provider is unavailable"),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "Internal server error");

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }
}
