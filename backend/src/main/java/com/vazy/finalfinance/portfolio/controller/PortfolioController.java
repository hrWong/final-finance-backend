package com.vazy.finalfinance.portfolio.controller;

import com.vazy.finalfinance.common.response.ApiResponse;
import com.vazy.finalfinance.portfolio.service.PortfolioService;
import com.vazy.finalfinance.portfolio.vo.CurrentPortfolioResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping("/current")
    public ApiResponse<CurrentPortfolioResponse> getCurrentPortfolio() {
        return ApiResponse.success(portfolioService.getCurrentPortfolio());
    }
}
