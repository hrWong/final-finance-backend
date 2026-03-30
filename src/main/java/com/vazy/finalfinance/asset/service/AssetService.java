package com.vazy.finalfinance.asset.service;

import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.asset.vo.AssetResponse;
import com.vazy.finalfinance.asset.vo.AssetSearchItemResponse;
import com.vazy.finalfinance.common.exception.BusinessException;
import com.vazy.finalfinance.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetMapper assetMapper;

    public List<AssetSearchItemResponse> search(String keyword, String type) {
        var assets = assetMapper.search(keyword, type);
        if (assets == null || assets.isEmpty()) {
            return Collections.emptyList();
        }
        return assets.stream()
                .map(asset -> new AssetSearchItemResponse(
                        asset.getSymbol(),
                        asset.getExchange(),
                        asset.getName(),
                        asset.getNameZh(),
                        asset.getAssetType(),
                        asset.getCurrency()
                ))
                .toList();
    }

    public AssetResponse getBySymbol(String symbol) {
        var asset = assetMapper.findBySymbol(symbol);
        if (asset == null) {
            throw new BusinessException(ErrorCode.ASSET_NOT_FOUND, "Asset not found for symbol: " + symbol);
        }

        return new AssetResponse(
                asset.getId(),
                asset.getSymbol(),
                asset.getExchange(),
                asset.getName(),
                asset.getNameZh(),
                asset.getAssetType(),
                asset.getCurrency(),
                asset.getCountry(),
                asset.getSector(),
                asset.getIndustry(),
                asset.getIsin(),
                asset.getIconUrl(),
                asset.getStatus()
        );
    }
}
