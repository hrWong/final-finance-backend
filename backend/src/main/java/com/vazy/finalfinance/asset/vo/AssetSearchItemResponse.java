package com.vazy.finalfinance.asset.vo;

public record AssetSearchItemResponse(
        String symbol,
        String exchange,
        String name,
        String nameZh,
        String assetType,
        String currency
) {
}
