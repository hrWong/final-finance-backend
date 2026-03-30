package com.vazy.finalfinance.transaction.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class PositionRebuildService {

    public void rebuildPosition(Long portfolioId, Long assetId) {
        log.info("Rebuilding position for portfolioId={}, assetId={}", portfolioId, assetId);
        // TODO: Recalculate quantity, avg_cost, cost_basis, market_value and pnl using moving average cost.
    }

    public void rebuildPortfolioSummary(Long portfolioId) {
        log.info("Refreshing dashboard aggregates for portfolioId={}", portfolioId);
        // TODO: Recompute portfolio summary and allocation if you later persist dashboard snapshots.
    }
}
