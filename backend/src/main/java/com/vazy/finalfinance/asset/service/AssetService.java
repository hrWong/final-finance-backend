package com.vazy.finalfinance.asset.service;

import com.vazy.finalfinance.asset.vo.AssetResponse;
import com.vazy.finalfinance.asset.vo.AssetSearchItemResponse;
import com.vazy.finalfinance.market.client.ItickFinanceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final ItickFinanceClient itickFinanceClient;

    public List<AssetSearchItemResponse> search(String keyword, String type) {
        return itickFinanceClient.searchAssets(keyword, type, 12);
    }

    public AssetResponse getBySymbol(String symbol) {
        return itickFinanceClient.getAsset(symbol);
    }
}
