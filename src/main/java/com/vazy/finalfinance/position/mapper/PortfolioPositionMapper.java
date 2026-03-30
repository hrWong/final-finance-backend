package com.vazy.finalfinance.position.mapper;

import com.vazy.finalfinance.position.entity.PortfolioPosition;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PortfolioPositionMapper {
    PortfolioPosition findByPortfolioAndAsset(Long portfolioId, Long assetId);

    List<PortfolioPosition> findAllByPortfolio(Long portfolioId);

    int insert(PortfolioPosition position);

    int update(PortfolioPosition position);

    int deleteByPortfolioAndAsset(Long portfolioId, Long assetId);
}
