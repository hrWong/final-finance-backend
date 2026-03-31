package com.vazy.finalfinance.dashboard.vo;

import com.vazy.finalfinance.position.vo.PositionResponse;
import java.math.BigDecimal;
import java.util.List;

public record AllocationItemResponse(
        String label,
        BigDecimal value,      // 当前市值
        BigDecimal invested,   // 投资成本
        BigDecimal gain,       // 累计盈亏额
        BigDecimal gainPct,    // 盈亏百分比
        Integer itemCount,     // 包含项目数
        BigDecimal weight,     // 占比 (0-1)
        List<PositionResponse> positions // 具体持仓项
) {
}
