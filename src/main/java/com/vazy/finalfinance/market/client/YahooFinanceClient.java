package com.vazy.finalfinance.market.client;

import com.vazy.finalfinance.market.dto.MarketQuote;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Component
public class YahooFinanceClient {

    private final WebClient yahooWebClient;

    public YahooFinanceClient(WebClient yahooWebClient) {
        this.yahooWebClient = yahooWebClient;
    }

    public MarketQuote getQuote(String symbol) {
        // TODO: Map your chosen Yahoo Finance API response into MarketQuote.
        return new MarketQuote(symbol, null, null, null, null, null, null, null);
    }

    public List<?> getHistory(String symbol, String range, String interval) {
        // TODO: Wire historical price endpoint.
        return List.of();
    }
}
