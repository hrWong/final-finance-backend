package com.vazy.finalfinance.transaction.service;

import com.vazy.finalfinance.position.entity.PortfolioPosition;
import com.vazy.finalfinance.position.mapper.PortfolioPositionMapper;
import com.vazy.finalfinance.transaction.entity.Transaction;
import com.vazy.finalfinance.transaction.mapper.TransactionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class PositionRebuildService {

    private final TransactionMapper transactionMapper;
    private final PortfolioPositionMapper positionMapper;

    /**
     * 根据该 asset 的所有交易记录，重新计算持仓（移动加权平均成本法）
     */
    public void rebuildPosition(Long portfolioId, Long assetId) {
        log.info("Rebuilding position for portfolioId={}, assetId={}", portfolioId, assetId);

        List<Transaction> txList = transactionMapper.findByPortfolioAndAsset(portfolioId, assetId);

        BigDecimal holdingQty = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO; // 持仓总成本

        for (Transaction tx : txList) {
            BigDecimal qty = tx.getQuantity();
            BigDecimal price = tx.getPrice();

            if ("BUY".equalsIgnoreCase(tx.getType())) {
                // 买入：增加持仓，累加成本
                totalCost = totalCost.add(qty.multiply(price));
                holdingQty = holdingQty.add(qty);
            } else if ("SELL".equalsIgnoreCase(tx.getType())) {
                // 卖出：按当前均价减少成本
                if (holdingQty.compareTo(BigDecimal.ZERO) > 0) {
                    BigDecimal avgCostBefore = totalCost.divide(holdingQty, 6, RoundingMode.HALF_UP);
                    totalCost = totalCost.subtract(qty.multiply(avgCostBefore));
                }
                holdingQty = holdingQty.subtract(qty);
            }
        }

        PortfolioPosition existing = positionMapper.findByPortfolioAndAsset(portfolioId, assetId);

        // 如果持仓为 0 或负数，删除持仓记录
        if (holdingQty.compareTo(BigDecimal.ZERO) <= 0) {
            if (existing != null) {
                positionMapper.deleteByPortfolioAndAsset(portfolioId, assetId);
                log.info("Position cleared for assetId={}", assetId);
            }
            return;
        }

        // 计算均价和成本
        BigDecimal avgCost = totalCost.divide(holdingQty, 6, RoundingMode.HALF_UP);
        BigDecimal costBasis = totalCost.setScale(2, RoundingMode.HALF_UP);

        if (existing != null) {
            // 更新已有持仓
            existing.setQuantity(holdingQty);
            existing.setAvgCost(avgCost);
            existing.setCostBasis(costBasis);
            // market_value / pnl 等依赖实时行情，暂时按均价估算
            BigDecimal lastPrice = existing.getLastPrice() != null ? existing.getLastPrice() : avgCost;
            BigDecimal marketValue = holdingQty.multiply(lastPrice).setScale(2, RoundingMode.HALF_UP);
            BigDecimal unrealizedPnl = marketValue.subtract(costBasis);
            BigDecimal unrealizedPnlPct = costBasis.compareTo(BigDecimal.ZERO) != 0
                    ? unrealizedPnl.divide(costBasis, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                    : BigDecimal.ZERO;

            existing.setMarketValue(marketValue);
            existing.setUnrealizedPnl(unrealizedPnl);
            existing.setUnrealizedPnlPct(unrealizedPnlPct);

            positionMapper.update(existing);
            log.info("Position updated for assetId={}: qty={}, avgCost={}", assetId, holdingQty, avgCost);
        } else {
            // 新建持仓
            PortfolioPosition pos = new PortfolioPosition();
            pos.setPortfolioId(portfolioId);
            pos.setAssetId(assetId);
            pos.setQuantity(holdingQty);
            pos.setAvgCost(avgCost);
            pos.setCostBasis(costBasis);
            pos.setLastPrice(avgCost); // 初始用均价
            BigDecimal marketValue = holdingQty.multiply(avgCost).setScale(2, RoundingMode.HALF_UP);
            pos.setMarketValue(marketValue);
            pos.setUnrealizedPnl(BigDecimal.ZERO);
            pos.setUnrealizedPnlPct(BigDecimal.ZERO);
            pos.setPortfolioWeight(BigDecimal.ZERO);
            pos.setPriceAsOf(LocalDateTime.now());

            positionMapper.insert(pos);
            log.info("Position created for assetId={}: qty={}, avgCost={}", assetId, holdingQty, avgCost);
        }
    }

    /**
     * 重新计算作品集内各持仓的权重
     */
    public void rebuildPortfolioSummary(Long portfolioId) {
        log.info("Refreshing portfolio summary for portfolioId={}", portfolioId);

        List<PortfolioPosition> positions = positionMapper.findAllByPortfolio(portfolioId);
        if (positions == null || positions.isEmpty()) {
            return;
        }

        // 计算总市值
        BigDecimal totalMarketValue = positions.stream()
                .map(PortfolioPosition::getMarketValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 更新每个持仓的权重
        for (PortfolioPosition pos : positions) {
            BigDecimal weight = totalMarketValue.compareTo(BigDecimal.ZERO) != 0
                    ? pos.getMarketValue().divide(totalMarketValue, 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            pos.setPortfolioWeight(weight);
            positionMapper.update(pos);
        }

        log.info("Portfolio summary refreshed: {} positions, totalMarketValue={}", positions.size(), totalMarketValue);
    }
}
