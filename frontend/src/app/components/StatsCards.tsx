import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";
import { formatMoney, formatPercent } from "../lib/formatters";
import type { DashboardSummaryResponse } from "../lib/types";

interface StatsCardsProps {
  summary?: DashboardSummaryResponse | null;
}

export function StatsCards({ summary }: StatsCardsProps) {
  const baseCurrency = summary?.baseCurrency ?? "CNY";
  const totalPnlPositive = Number(summary?.totalPnl ?? 0) >= 0;
  const dailyPnlPositive = Number(summary?.dailyPnl ?? 0) >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-[#60A5FA] rounded"></div>
          <span className="text-gray-600 text-sm">价值</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
        <div className="text-3xl font-semibold text-gray-900 mb-1">
          {formatMoney(summary?.totalValue, baseCurrency)}
        </div>
        <div className="text-sm text-gray-500">
          投资 {formatMoney(summary?.investedAmount, baseCurrency)}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-[#34D399] rounded"></div>
          <span className="text-gray-600 text-sm">总利润</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl font-semibold text-gray-900">
            {formatMoney(summary?.totalPnl, baseCurrency, { signed: true })}
          </span>
          <span className={`text-sm flex items-center gap-1 ${totalPnlPositive ? "text-emerald-500" : "text-red-500"}`}>
            {totalPnlPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {formatPercent(summary?.totalPnlPct, { digits: 2, signed: true })}
          </span>
        </div>
        <div className="text-sm flex items-center gap-2">
          <span className={dailyPnlPositive ? "text-emerald-500" : "text-red-500"}>
            {formatMoney(summary?.dailyPnl, baseCurrency, { signed: true })}
          </span>
          <span className={`flex items-center gap-1 ${dailyPnlPositive ? "text-emerald-500" : "text-red-500"}`}>
            {dailyPnlPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {formatPercent(summary?.dailyPnlPct, { digits: 2, signed: true })}
          </span>
          <span className="text-gray-500">今日</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-[#A78BFA] rounded"></div>
          <span className="text-gray-600 text-sm">总回报率</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
        <div className="text-3xl font-semibold text-gray-900 mb-1">
          {formatPercent(summary?.totalPnlPct, { digits: 2, signed: true })}
        </div>
        <div className="text-sm text-gray-500">
          基准货币 {summary?.baseCurrency || "--"}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 bg-[#22D3EE] rounded"></div>
          <span className="text-gray-600 text-sm">现金</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-auto" />
        </div>
        <div className="text-3xl font-semibold text-gray-900 mb-1">
          {formatMoney(summary?.cash, baseCurrency)}
        </div>
        <div className="text-sm text-gray-500">
          后端汇总字段
        </div>
      </div>
    </div>
  );
}
