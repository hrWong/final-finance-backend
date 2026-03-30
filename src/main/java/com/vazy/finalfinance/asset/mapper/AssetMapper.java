package com.vazy.finalfinance.asset.mapper;

import com.vazy.finalfinance.asset.entity.Asset;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AssetMapper {
    Asset findBySymbol(String symbol);

    List<Asset> search(String keyword, String assetType);

    int insert(Asset asset);
}
