package com.vazy.finalfinance.market.controller;

import com.vazy.finalfinance.common.response.ApiResponse;
import com.vazy.finalfinance.market.service.MarketDataService;
import com.vazy.finalfinance.market.vo.MarketMoverResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketController {

    private final MarketDataService marketDataService;

    @GetMapping("/movers")
    public ApiResponse<List<MarketMoverResponse>> getMovers(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return ApiResponse.success(marketDataService.getMovers(limit));
    }
}
