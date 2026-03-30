package com.vazy.finalfinance.dashboard.controller;

import com.vazy.finalfinance.common.response.ApiResponse;
import com.vazy.finalfinance.dashboard.service.DashboardService;
import com.vazy.finalfinance.dashboard.vo.AllocationItemResponse;
import com.vazy.finalfinance.dashboard.vo.DashboardSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryResponse> summary() {
        return ApiResponse.success(dashboardService.getSummary());
    }

    @GetMapping("/allocation")
    public ApiResponse<List<AllocationItemResponse>> allocation() {
        return ApiResponse.success(dashboardService.getAllocation());
    }
}
