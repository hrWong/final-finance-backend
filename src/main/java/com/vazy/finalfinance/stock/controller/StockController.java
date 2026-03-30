package com.vazy.finalfinance.stock.controller;

import com.vazy.finalfinance.common.response.ApiResponse;
import com.vazy.finalfinance.stock.service.StockService;
import com.vazy.finalfinance.stock.vo.StockHistoryPointResponse;
import com.vazy.finalfinance.stock.vo.StockOverviewResponse;
import com.vazy.finalfinance.transaction.vo.TransactionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping("/{symbol}/overview")
    public ApiResponse<StockOverviewResponse> getOverview(@PathVariable String symbol) {
        return ApiResponse.success(stockService.getOverview(symbol));
    }

    @GetMapping("/{symbol}/history")
    public ApiResponse<List<StockHistoryPointResponse>> getHistory(
            @PathVariable String symbol,
            @RequestParam(defaultValue = "1y") String range,
            @RequestParam(defaultValue = "1d") String interval
    ) {
        return ApiResponse.success(stockService.getHistory(symbol, range, interval));
    }

    @GetMapping("/{symbol}/position")
    public ApiResponse<Object> getPosition(@PathVariable String symbol) {
        return ApiResponse.success(stockService.getPosition(symbol));
    }

    @GetMapping("/{symbol}/transactions")
    public ApiResponse<List<TransactionResponse>> getTransactions(@PathVariable String symbol) {
        return ApiResponse.success(stockService.getTransactions(symbol));
    }
}
