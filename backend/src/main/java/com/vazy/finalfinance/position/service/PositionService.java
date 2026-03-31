package com.vazy.finalfinance.position.service;

import com.vazy.finalfinance.asset.entity.Asset;
import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.position.entity.PortfolioPosition;
import com.vazy.finalfinance.position.mapper.PortfolioPositionMapper;
import com.vazy.finalfinance.position.vo.PositionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionService {

    private static final long DEFAULT_PORTFOLIO_ID = 1L;

    private final PortfolioPositionMapper portfolioPositionMapper;
    private final AssetMapper assetMapper;

    public List<PositionResponse> getPositions() {
        var positions = portfolioPositionMapper.findAllByPortfolio(DEFAULT_PORTFOLIO_ID);
        if (positions == null || positions.isEmpty()) {
            return Collections.emptyList();
        }

        return positions.stream()
                .map(this::toResponse)
                .toList();
    }

    public PositionResponse getPosition(String symbol) {
        // 先通过 symbol 找到 asset，再通过 assetId 查持仓
        Asset asset = assetMapper.findBySymbol(symbol);
        if (asset == null) {
            return null;
        }
        PortfolioPosition position = portfolioPositionMapper.findByPortfolioAndAsset(DEFAULT_PORTFOLIO_ID, asset.getId());
        if (position == null) {
            return null;
        }
        String assetName = asset.getNameZh() != null ? asset.getNameZh() : asset.getName();
        return new PositionResponse(
                asset.getSymbol(),
                assetName,
                position.getQuantity(),
                position.getAvgCost(),
                position.getCostBasis(),
                position.getLastPrice(),
                position.getMarketValue(),
                position.getUnrealizedPnl(),
                position.getUnrealizedPnlPct(),
                position.getPortfolioWeight(),
                position.getPriceAsOf()
        );
    }

    private PositionResponse toResponse(PortfolioPosition position) {
        String symbol = null;
        String assetName = null;
        if (position.getAssetId() != null) {
            Asset asset = assetMapper.findById(position.getAssetId());
            if (asset != null) {
                symbol = asset.getSymbol();
                assetName = asset.getNameZh() != null ? asset.getNameZh() : asset.getName();
            }
        }
        return new PositionResponse(
                symbol,
                assetName,
                position.getQuantity(),
                position.getAvgCost(),
                position.getCostBasis(),
                position.getLastPrice(),
                position.getMarketValue(),
                position.getUnrealizedPnl(),
                position.getUnrealizedPnlPct(),
                position.getPortfolioWeight(),
                position.getPriceAsOf()
        );
    }
}
