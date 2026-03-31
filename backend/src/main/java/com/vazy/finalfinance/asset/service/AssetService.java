package com.vazy.finalfinance.asset.service;

import com.vazy.finalfinance.asset.entity.Asset;
import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.asset.vo.AssetResponse;
import com.vazy.finalfinance.asset.vo.AssetSearchItemResponse;
import com.vazy.finalfinance.market.client.ItickFinanceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssetService {

    private final ItickFinanceClient itickFinanceClient;
    private final AssetMapper assetMapper;

    public List<AssetSearchItemResponse> search(String keyword, String type) {
        return itickFinanceClient.searchAssets(keyword, type, 12);
    }

    public AssetResponse getBySymbol(String symbol) {
        // 优先调用外部 API
        try {
            AssetResponse remote = itickFinanceClient.getAsset(symbol);
            if (remote != null) {
                return remote;
            }
        } catch (Exception e) {
            log.warn("Failed to fetch asset from iTick for symbol={}, falling back to local DB", symbol, e);
        }

        // 兜底查询本地数据库
        Asset local = assetMapper.findBySymbol(symbol);
        if (local == null) {
            return null;
        }
        return new AssetResponse(
                local.getId(),
                local.getSymbol(),
                local.getExchange(),
                local.getName(),
                local.getNameZh(),
                local.getAssetType(),
                local.getCurrency(),
                local.getCountry(),
                local.getSector(),
                local.getIndustry(),
                local.getIsin(),
                local.getIconUrl(),
                local.getStatus()
        );
    }
}
