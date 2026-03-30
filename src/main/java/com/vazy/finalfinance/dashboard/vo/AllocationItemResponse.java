package com.vazy.finalfinance.dashboard.vo;

import java.math.BigDecimal;

public record AllocationItemResponse(
        String label,
        BigDecimal value,
        BigDecimal weight
) {
}
