package com.vazy.finalfinance.dashboard.service;

import com.vazy.finalfinance.dashboard.vo.AllocationItemResponse;
import com.vazy.finalfinance.dashboard.vo.DashboardSummaryResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class DashboardService {

    public DashboardSummaryResponse getSummary() {
        return new DashboardSummaryResponse(
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                "USD"
        );
    }

    public List<AllocationItemResponse> getAllocation() {
        return List.of();
    }
}
