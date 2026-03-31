package com.vazy.finalfinance.transaction.service;

import com.vazy.finalfinance.asset.entity.Asset;
import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.position.entity.PortfolioPosition;
import com.vazy.finalfinance.position.mapper.PortfolioPositionMapper;
import com.vazy.finalfinance.transaction.dto.CreateTransactionRequest;
import com.vazy.finalfinance.transaction.dto.UpdateTransactionRequest;
import com.vazy.finalfinance.transaction.entity.Transaction;
import com.vazy.finalfinance.transaction.mapper.TransactionMapper;
import com.vazy.finalfinance.transaction.vo.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.vazy.finalfinance.wallet.service.WalletService;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final long DEFAULT_PORTFOLIO_ID = 1L;

    private final TransactionMapper transactionMapper;
    private final AssetMapper assetMapper;
    private final PortfolioPositionMapper positionMapper;
    private final PositionRebuildService positionRebuildService;
    private final WalletService walletService;

    public List<TransactionResponse> findAll(String symbol, String type) {
        List<Transaction> transactions = transactionMapper.findAll(DEFAULT_PORTFOLIO_ID, symbol, type);
        if (transactions == null || transactions.isEmpty()) {
            return Collections.emptyList();
        }
        return transactions.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public TransactionResponse findById(Long id) {
        Transaction tx = transactionMapper.findById(id);
        if (tx == null) {
            return null;
        }
        return toResponse(tx);
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest request) {
        // 1. 通过 symbol 查找 asset
        Asset asset = assetMapper.findBySymbol(request.symbol());
        if (asset == null) {
            throw new IllegalArgumentException("Asset not found: " + request.symbol());
        }

        // 2. 卖出时校验持仓数量
        if ("SELL".equalsIgnoreCase(request.type())) {
            PortfolioPosition position = positionMapper.findByPortfolioAndAsset(DEFAULT_PORTFOLIO_ID, asset.getId());
            BigDecimal holdingQty = position != null ? position.getQuantity() : BigDecimal.ZERO;
            if (holdingQty.compareTo(request.quantity()) < 0) {
                throw new IllegalArgumentException(
                        "Insufficient holding: you have " + holdingQty + " shares but trying to sell " + request.quantity());
            }
        }

        BigDecimal grossAmount = request.quantity().multiply(request.price());
        BigDecimal netAmount = "SELL".equalsIgnoreCase(request.type())
                ? grossAmount.subtract(request.commission()).subtract(request.tax())
                : grossAmount.add(request.commission()).add(request.tax());

        // 3. 钱包结算：买入扣减，卖出增加
        BigDecimal walletDelta = "SELL".equalsIgnoreCase(request.type()) ? netAmount : netAmount.negate();
        walletService.updateBalance("default_user", walletDelta);

        // 4. 构建 entity 并插入数据库
        Transaction tx = new Transaction();
        tx.setPortfolioId(DEFAULT_PORTFOLIO_ID);
        tx.setAssetId(asset.getId());
        tx.setType(request.type());
        tx.setTradeDate(request.tradeDate());
        tx.setQuantity(request.quantity());
        tx.setPrice(request.price());
        tx.setGrossAmount(grossAmount);
        tx.setCommission(request.commission());
        tx.setTax(request.tax());
        tx.setNetAmount(netAmount);
        tx.setCurrency(request.currency());
        tx.setNote(request.note());

        transactionMapper.insert(tx);

        // 4. 重建持仓
        positionRebuildService.rebuildPosition(DEFAULT_PORTFOLIO_ID, asset.getId());
        positionRebuildService.rebuildPortfolioSummary(DEFAULT_PORTFOLIO_ID);

        return toResponse(tx, request.symbol(), asset.getName());
    }

    @Transactional
    public TransactionResponse update(Long id, UpdateTransactionRequest request) {
        Transaction oldTx = transactionMapper.findById(id);
        if (oldTx == null) {
            throw new IllegalArgumentException("Transaction not found: " + id);
        }

        BigDecimal grossAmount = request.quantity().multiply(request.price());
        BigDecimal newNetAmount = "SELL".equalsIgnoreCase(request.type())
                ? grossAmount.subtract(request.commission()).subtract(request.tax())
                : grossAmount.add(request.commission()).add(request.tax());

        // 处理钱包回退和重新扣费
        BigDecimal reverseOldDelta = "SELL".equalsIgnoreCase(oldTx.getType()) ? oldTx.getNetAmount().negate() : oldTx.getNetAmount();
        BigDecimal newWalletDelta = "SELL".equalsIgnoreCase(request.type()) ? newNetAmount : newNetAmount.negate();
        walletService.updateBalance("default_user", reverseOldDelta.add(newWalletDelta));

        oldTx.setType(request.type());
        oldTx.setTradeDate(request.tradeDate());
        oldTx.setQuantity(request.quantity());
        oldTx.setPrice(request.price());
        oldTx.setGrossAmount(grossAmount);
        oldTx.setCommission(request.commission());
        oldTx.setTax(request.tax());
        oldTx.setNetAmount(newNetAmount);
        oldTx.setCurrency(request.currency());
        oldTx.setNote(request.note());

        transactionMapper.update(oldTx);

        // 重建持仓
        positionRebuildService.rebuildPosition(DEFAULT_PORTFOLIO_ID, oldTx.getAssetId());
        positionRebuildService.rebuildPortfolioSummary(DEFAULT_PORTFOLIO_ID);

        return toResponse(oldTx);
    }

    @Transactional
    public void delete(Long id) {
        Transaction tx = transactionMapper.findById(id);
        if (tx == null) {
            throw new IllegalArgumentException("Transaction not found: " + id);
        }

        // 逆向钱包资金影响
        BigDecimal reverseOldDelta = "SELL".equalsIgnoreCase(tx.getType()) ? tx.getNetAmount().negate() : tx.getNetAmount();
        walletService.updateBalance("default_user", reverseOldDelta);

        transactionMapper.deleteById(id);

        positionRebuildService.rebuildPosition(DEFAULT_PORTFOLIO_ID, tx.getAssetId());
        positionRebuildService.rebuildPortfolioSummary(DEFAULT_PORTFOLIO_ID);
    }

    // ---- 私有辅助方法 ----

    private TransactionResponse toResponse(Transaction tx) {
        String symbol = null;
        String assetName = null;
        if (tx.getAssetId() != null) {
            Asset asset = assetMapper.findById(tx.getAssetId());
            if (asset != null) {
                symbol = asset.getSymbol();
                assetName = asset.getNameZh() != null ? asset.getNameZh() : asset.getName();
            }
        }
        return new TransactionResponse(
                tx.getId(),
                symbol,
                assetName,
                tx.getType(),
                tx.getTradeDate(),
                tx.getQuantity(),
                tx.getPrice(),
                tx.getGrossAmount(),
                tx.getCommission(),
                tx.getTax(),
                tx.getNetAmount(),
                tx.getCurrency(),
                tx.getNote()
        );
    }

    private TransactionResponse toResponse(Transaction tx, String symbol, String assetName) {
        return new TransactionResponse(
                tx.getId(),
                symbol,
                assetName,
                tx.getType(),
                tx.getTradeDate(),
                tx.getQuantity(),
                tx.getPrice(),
                tx.getGrossAmount(),
                tx.getCommission(),
                tx.getTax(),
                tx.getNetAmount(),
                tx.getCurrency(),
                tx.getNote()
        );
    }
}
