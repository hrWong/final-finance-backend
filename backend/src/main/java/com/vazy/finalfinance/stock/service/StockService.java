package com.vazy.finalfinance.stock.service;

import com.vazy.finalfinance.market.service.MarketDataService;
import com.vazy.finalfinance.position.service.PositionService;
import com.vazy.finalfinance.stock.vo.StockHistoryPointResponse;
import com.vazy.finalfinance.stock.vo.StockOverviewResponse;
import com.vazy.finalfinance.transaction.service.TransactionService;
import com.vazy.finalfinance.transaction.vo.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final MarketDataService marketDataService;
    private final PositionService positionService;
    private final TransactionService transactionService;

    public StockOverviewResponse getOverview(String symbol) {
        var quote = marketDataService.getQuote(symbol);
        return new StockOverviewResponse(
                symbol,
                quote.name(),
                quote.exchange(),
                quote.currency(),
                quote.lastPrice(),
                quote.changeAmount(),
                quote.changePercent(),
                quote.marketCap(),
                quote.pe(),
                quote.eps(),
                quote.dividendYield(),
                List.of("Stocks")
        );
    }

    public List<StockHistoryPointResponse> getHistory(String symbol, String range, String interval) {
        return marketDataService.getHistory(symbol, range, interval)
                .stream()
                .map(point -> new StockHistoryPointResponse(point.date(), point.close()))
                .toList();
    }

    public Object getPosition(String symbol) {
        return positionService.getPosition(symbol);
    }

    public List<TransactionResponse> getTransactions(String symbol) {
        return transactionService.findAll(symbol, null);
    }
}
