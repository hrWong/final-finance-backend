package com.vazy.finalfinance.market.service;

import com.vazy.finalfinance.market.client.ItickFinanceClient;
import com.vazy.finalfinance.market.dto.MarketHistoryPoint;
import com.vazy.finalfinance.market.dto.MarketQuote;
import com.vazy.finalfinance.market.vo.MarketMoverResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MarketDataService {

    private final ItickFinanceClient itickFinanceClient;

    @Cacheable(cacheNames = "quotes", key = "#symbol")
    public MarketQuote getQuote(String symbol) {
        return itickFinanceClient.getQuote(symbol);
    }

    @Cacheable(cacheNames = "histories", key = "#symbol + ':' + #range + ':' + #interval")
    public List<MarketHistoryPoint> getHistory(String symbol, String range, String interval) {
        return itickFinanceClient.getHistory(symbol, range, interval);
    }

    @Cacheable(cacheNames = "movers", key = "#limit")
    public List<MarketMoverResponse> getMovers(int limit) {
        return itickFinanceClient.getMovers(limit);
    }

    public Map<String, BigDecimal> getPreviousCloses(List<String> symbols) {
        return itickFinanceClient.getPreviousCloses(symbols);
    }
}
