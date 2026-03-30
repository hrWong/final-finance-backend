package com.vazy.finalfinance.asset.vo;

public record AssetResponse(
        Long id,
        String symbol,
        String exchange,
        String name,
        String nameZh,
        String assetType,
        String currency,
        String country,
        String sector,
        String industry,
        String isin,
        String iconUrl,
        String status
) {
}
