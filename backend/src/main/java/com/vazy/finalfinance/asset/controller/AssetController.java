package com.vazy.finalfinance.asset.controller;

import com.vazy.finalfinance.asset.service.AssetService;
import com.vazy.finalfinance.asset.vo.AssetResponse;
import com.vazy.finalfinance.asset.vo.AssetSearchItemResponse;
import com.vazy.finalfinance.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @GetMapping("/search")
    public ApiResponse<List<AssetSearchItemResponse>> search(
            @RequestParam("q") String keyword,
            @RequestParam(value = "type", required = false) String type
    ) {
        return ApiResponse.success(assetService.search(keyword, type));
    }

    @GetMapping("/{symbol}")
    public ApiResponse<AssetResponse> getBySymbol(@PathVariable String symbol) {
        return ApiResponse.success(assetService.getBySymbol(symbol));
    }
}
