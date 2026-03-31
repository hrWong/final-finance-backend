package com.vazy.finalfinance.asset.service;

import com.vazy.finalfinance.asset.entity.Asset;
import com.vazy.finalfinance.asset.mapper.AssetMapper;
import com.vazy.finalfinance.asset.vo.AssetResponse;
import com.vazy.finalfinance.asset.vo.AssetSearchItemResponse;
import com.vazy.finalfinance.market.client.ItickFinanceClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssetService {

    private final ItickFinanceClient itickFinanceClient;
    private final AssetMapper assetMapper;

    public List<AssetSearchItemResponse> search(String keyword, String type) {
        return itickFinanceClient.searchAssets(keyword, type, 12);
    }

    public AssetResponse getBySymbol(String symbol) {
        // 1. 先查本地数据库
        Asset local = assetMapper.findBySymbol(symbol);

        // 2. 调用外部 API 获取最新数据
        AssetResponse remote = null;
        try {
            remote = itickFinanceClient.getAsset(symbol);
        } catch (Exception e) {
            log.warn("Failed to fetch asset from iTick for symbol={}", symbol, e);
        }

        // 3. 如果远程拿到了数据，且本地不存在 → 自动入库
        if (remote != null && local == null) {
            local = persistFromRemote(remote);
            log.info("Auto-persisted new asset from iTick: symbol={}, id={}", local.getSymbol(), local.getId());
        }

        // 4. 优先返回远程数据（信息更全），补上本地 id
        if (remote != null) {
            return new AssetResponse(
                    local != null ? local.getId() : null,
                    remote.symbol(),
                    remote.exchange(),
                    remote.name(),
                    remote.nameZh(),
                    remote.assetType(),
                    remote.currency(),
                    remote.country(),
                    remote.sector(),
                    remote.industry(),
                    remote.isin(),
                    remote.iconUrl(),
                    remote.status()
            );
        }

        // 5. 远程不可用时兜底返回本地数据
        if (local != null) {
            return toResponse(local);
        }

        return null;
    }

    /**
     * 根据 symbol 查询本地 Asset 实体，如果本地不存在则尝试从外部 API 获取并自动入库。
     * 主要供内部服务（如 TransactionService）调用。
     */
    public Asset getOrCreateAsset(String symbol) {
        Asset local = assetMapper.findBySymbol(symbol);
        if (local != null) {
            return local;
        }

        // 本地没有，尝试从 iTick 拉取并入库
        try {
            AssetResponse remote = itickFinanceClient.getAsset(symbol);
            if (remote != null) {
                local = persistFromRemote(remote);
                log.info("Auto-persisted new asset on-demand: symbol={}, id={}", local.getSymbol(), local.getId());
                return local;
            }
        } catch (Exception e) {
            log.warn("Failed to fetch and persist asset for symbol={}", symbol, e);
        }

        return null;
    }

    // ---- 私有辅助方法 ----

    private Asset persistFromRemote(AssetResponse remote) {
        Asset asset = new Asset();
        asset.setSymbol(remote.symbol());
        asset.setExchange(remote.exchange());
        asset.setName(remote.name());
        asset.setNameZh(remote.nameZh());
        asset.setAssetType(remote.assetType());
        asset.setCurrency(remote.currency());
        asset.setCountry(remote.country());
        asset.setSector(remote.sector());
        asset.setIndustry(remote.industry());
        asset.setIsin(remote.isin());
        asset.setIconUrl(remote.iconUrl());
        asset.setStatus(remote.status() != null ? remote.status() : "ACTIVE");
        assetMapper.insert(asset);  // insert 后 id 会自动回填
        return asset;
    }

    private AssetResponse toResponse(Asset local) {
        return new AssetResponse(
                local.getId(),
                local.getSymbol(),
                local.getExchange(),
                local.getName(),
                local.getNameZh(),
                local.getAssetType(),
                local.getCurrency(),
                local.getCountry(),
                local.getSector(),
                local.getIndustry(),
                local.getIsin(),
                local.getIconUrl(),
                local.getStatus()
        );
    }
}
