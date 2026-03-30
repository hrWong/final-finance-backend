package com.vazy.finalfinance.portfolio.service;

import com.vazy.finalfinance.portfolio.mapper.PortfolioMapper;
import com.vazy.finalfinance.portfolio.vo.CurrentPortfolioResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final PortfolioMapper portfolioMapper;

    public CurrentPortfolioResponse getCurrentPortfolio() {
        var portfolio = portfolioMapper.findDefaultPortfolio();
        if (portfolio == null) {
            return new CurrentPortfolioResponse(1L, "Default Portfolio", "USD", true, "Bootstrap default portfolio");
        }
        return new CurrentPortfolioResponse(
                portfolio.getId(),
                portfolio.getName(),
                portfolio.getBaseCurrency(),
                Boolean.TRUE.equals(portfolio.getIsDefault()),
                portfolio.getDescription()
        );
    }
}
