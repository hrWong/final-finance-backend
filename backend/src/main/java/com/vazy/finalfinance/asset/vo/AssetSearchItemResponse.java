package com.vazy.finalfinance.asset.vo;

import java.math.BigDecimal;

public record AssetSearchItemResponse(
        String symbol,
        String exchange,
        String name,
        String nameZh,
        String assetType,
        String currency,
        String sector,
        String iconUrl,
        BigDecimal lastPrice,
        BigDecimal changeAmount,
        BigDecimal changePercent,
        BigDecimal marketCap,
        BigDecimal pe,
        BigDecimal dividendYield
) {
}
