import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import { formatMoney, formatPercent } from "../lib/formatters";
import type { DashboardSummaryResponse } from "../lib/types";

interface AnalysisStatsCardsProps {
  summary?: DashboardSummaryResponse | null;
}

export function AnalysisStatsCards({ summary }: AnalysisStatsCardsProps) {
  const baseCurrency = summary?.baseCurrency ?? "CNY";
  const totalPnlPositive = Number(summary?.totalPnl ?? 0) >= 0;
  const dailyPnlPositive = Number(summary?.dailyPnl ?? 0) >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-gray-600 text-sm">价值</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-1" />
        </div>
        <div className="text-3xl font-semibold text-gray-900 mb-1">
          {formatMoney(summary?.totalValue, baseCurrency)}
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>投资 {formatMoney(summary?.investedAmount, baseCurrency)}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[#22D3EE] rounded-full"></div>
          <span className="text-gray-600 text-sm">总利润</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-1" />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl font-semibold text-gray-900">
            {formatMoney(summary?.totalPnl, baseCurrency, { signed: true })}
          </span>
          <span className={`text-sm flex items-center gap-1 ${totalPnlPositive ? "text-emerald-500" : "text-red-500"}`}>
            {totalPnlPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercent(summary?.totalPnlPct, { digits: 2, signed: true })}
          </span>
        </div>
        <div className="text-sm flex items-center gap-2">
          <span className={dailyPnlPositive ? "text-emerald-500" : "text-red-500"}>
            {formatMoney(summary?.dailyPnl, baseCurrency, { signed: true })}
          </span>
          <span className={`flex items-center gap-1 ${dailyPnlPositive ? "text-emerald-500" : "text-red-500"}`}>
            {dailyPnlPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercent(summary?.dailyPnlPct, { digits: 2, signed: true })}
          </span>
          <span className="text-gray-500">今日</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[#A78BFA] rounded-full"></div>
          <span className="text-gray-600 text-sm">总回报率</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-1" />
        </div>
        <div className="text-3xl font-semibold text-gray-900 mb-1">
          {formatPercent(summary?.totalPnlPct, { digits: 2, signed: true })}
        </div>
        <div className="text-sm text-gray-500">基准货币 {summary?.baseCurrency || "--"}</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[#22D3EE] rounded-full"></div>
          <span className="text-gray-600 text-sm">现金</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-1" />
        </div>
        <div className="text-3xl font-semibold text-gray-900 mb-1">
          {formatMoney(summary?.cash, baseCurrency)}
        </div>
        <div className="text-sm text-gray-500">后端汇总字段</div>
      </div>
    </div>
  );
}
