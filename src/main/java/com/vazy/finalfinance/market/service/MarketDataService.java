package com.vazy.finalfinance.market.service;

import com.vazy.finalfinance.market.client.YahooFinanceClient;
import com.vazy.finalfinance.market.dto.MarketQuote;
import com.vazy.finalfinance.market.vo.MarketMoverResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketDataService {

    private final YahooFinanceClient yahooFinanceClient;

    @Cacheable(cacheNames = "quotes", key = "#symbol")
    public MarketQuote getQuote(String symbol) {
        return yahooFinanceClient.getQuote(symbol);
    }

    @Cacheable(cacheNames = "histories", key = "#symbol + ':' + #range + ':' + #interval")
    public List<?> getHistory(String symbol, String range, String interval) {
        return yahooFinanceClient.getHistory(symbol, range, interval);
    }

    public List<MarketMoverResponse> getMovers(int limit) {
        // TODO: Replace this stub with a real market movers source or a curated watchlist calculation.
        return List.of();
    }
}
