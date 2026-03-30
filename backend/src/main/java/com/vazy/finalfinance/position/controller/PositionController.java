package com.vazy.finalfinance.position.controller;

import com.vazy.finalfinance.common.response.ApiResponse;
import com.vazy.finalfinance.position.service.PositionService;
import com.vazy.finalfinance.position.vo.PositionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    public ApiResponse<List<PositionResponse>> getPositions() {
        return ApiResponse.success(positionService.getPositions());
    }

    @GetMapping("/{symbol}")
    public ApiResponse<PositionResponse> getPosition(@PathVariable String symbol) {
        return ApiResponse.success(positionService.getPosition(symbol));
    }
}
