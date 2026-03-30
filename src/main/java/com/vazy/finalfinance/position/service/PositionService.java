package com.vazy.finalfinance.position.service;

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

    public List<PositionResponse> getPositions() {
        var positions = portfolioPositionMapper.findAllByPortfolio(DEFAULT_PORTFOLIO_ID);
        if (positions == null || positions.isEmpty()) {
            return Collections.emptyList();
        }

        return positions.stream()
                .map(position -> new PositionResponse(
                        null,
                        null,
                        position.getQuantity(),
                        position.getAvgCost(),
                        position.getCostBasis(),
                        position.getLastPrice(),
                        position.getMarketValue(),
                        position.getUnrealizedPnl(),
                        position.getUnrealizedPnlPct(),
                        position.getPortfolioWeight(),
                        position.getPriceAsOf()
                ))
                .toList();
    }

    public PositionResponse getPosition(String symbol) {
        return getPositions().stream()
                .filter(position -> symbol.equalsIgnoreCase(position.symbol()))
                .findFirst()
                .orElse(null);
    }
}
