package com.vazy.finalfinance.transaction.service;

import com.vazy.finalfinance.transaction.dto.CreateTransactionRequest;
import com.vazy.finalfinance.transaction.dto.UpdateTransactionRequest;
import com.vazy.finalfinance.transaction.vo.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final long DEFAULT_PORTFOLIO_ID = 1L;

    private final PositionRebuildService positionRebuildService;

    public List<TransactionResponse> findAll(String symbol, String type) {
        return Collections.emptyList();
    }

    public TransactionResponse findById(Long id) {
        return null;
    }

    @Transactional
    public TransactionResponse create(CreateTransactionRequest request) {
        BigDecimal grossAmount = request.quantity().multiply(request.price());
        BigDecimal netAmount = grossAmount.add(request.commission()).add(request.tax());

        // TODO: Resolve asset by symbol, insert transaction with mapper, and use generated id.
        positionRebuildService.rebuildPosition(DEFAULT_PORTFOLIO_ID, 0L);
        positionRebuildService.rebuildPortfolioSummary(DEFAULT_PORTFOLIO_ID);

        return new TransactionResponse(
                null,
                request.symbol(),
                null,
                request.type(),
                request.tradeDate(),
                request.quantity(),
                request.price(),
                grossAmount,
                request.commission(),
                request.tax(),
                netAmount,
                request.currency(),
                request.note()
        );
    }

    @Transactional
    public TransactionResponse update(Long id, UpdateTransactionRequest request) {
        BigDecimal grossAmount = request.quantity().multiply(request.price());
        BigDecimal netAmount = grossAmount.add(request.commission()).add(request.tax());

        // TODO: Load old transaction, update it, then rebuild the old/new affected positions.
        positionRebuildService.rebuildPortfolioSummary(DEFAULT_PORTFOLIO_ID);

        return new TransactionResponse(
                id,
                null,
                null,
                request.type(),
                request.tradeDate(),
                request.quantity(),
                request.price(),
                grossAmount,
                request.commission(),
                request.tax(),
                netAmount,
                request.currency(),
                request.note()
        );
    }

    @Transactional
    public void delete(Long id) {
        // TODO: Delete transaction by id and rebuild the related position.
        positionRebuildService.rebuildPortfolioSummary(DEFAULT_PORTFOLIO_ID);
    }
}
