package com.vazy.finalfinance.transaction.mapper;

import com.vazy.finalfinance.transaction.entity.Transaction;
import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface TransactionMapper {
    Transaction findById(Long id);

    List<Transaction> findAll(Long portfolioId, String symbol, String type);

    List<Transaction> findByPortfolioAndAsset(Long portfolioId, Long assetId);

    BigDecimal calculateNetCashFlow(Long portfolioId);

    int insert(Transaction transaction);

    int update(Transaction transaction);

    int deleteById(Long id);
}
