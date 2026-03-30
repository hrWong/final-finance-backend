package com.vazy.finalfinance.portfolio.mapper;

import com.vazy.finalfinance.portfolio.entity.Portfolio;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PortfolioMapper {
    Portfolio findDefaultPortfolio();
}
