import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatPercent, toNumber, formatMoney } from "../lib/formatters";
import type { PositionResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";

const palette = ["#6366F1", "#8B5CF6", "#22D3EE", "#A78BFA", "#60A5FA", "#34D399", "#10B981", "#14B8A6"];

interface AssetAllocationChartProps {
  positions?: PositionResponse[] | null;
  baseCurrency?: string | null;
}

export function AssetAllocationChart({ positions, baseCurrency }: AssetAllocationChartProps) {
  const totalMarketValue = (positions ?? []).reduce(
    (sum, position) => sum + (toNumber(position.marketValue) ?? 0),
    0,
  );

  const data = (positions ?? [])
    .map((position, index) => {
      const marketValue = toNumber(position.marketValue) ?? 0;
      const weight = toNumber(position.portfolioWeight) ?? (totalMarketValue > 0 ? (marketValue / totalMarketValue) * 100 : 0);

      return {
        name: position.assetName || position.symbol || `Asset ${index + 1}`,
        symbol: position.symbol,
        marketValue: marketValue,
        value: weight,
        color: palette[index % palette.length],
      };
    })
    .filter((item) => item.value > 0);

  if (!data.length) {
    return (
      <EmptyState
        title="暂无持仓分布数据"
      />
    );
  }

  const currency = baseCurrency ?? "USD";

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-2xl text-sm font-semibold transition-colors flex items-center gap-2 border border-indigo-100 shadow-sm">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            所有资产分布
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="relative group">
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={110}
                outerRadius={160}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} className="hover:fill-opacity-100 transition-all cursor-pointer" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatPercent(value, { digits: 2 })}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid #f1f5f9",
                  borderRadius: "16px",
                  padding: "12px 16px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                itemStyle={{ color: "#1e293b", fontWeight: 600, fontSize: "14px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
             <div className="text-gray-400 text-xs font-medium uppercase tracking-[0.1em] mb-1">总市值</div>
             <div className="text-2xl font-bold text-slate-800 tracking-tight">
               {formatMoney(totalMarketValue, currency)}
             </div>
          </div>
        </div>

        <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100/50">
          <div className="flex items-center justify-between px-3 mb-5 border-b border-slate-200/50 pb-3">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">资产明细</span>
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider text-right">占比 / 市值</span>
          </div>
          
          <div className="space-y-1 max-h-[340px] overflow-y-auto custom-scrollbar pr-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white hover:shadow-sm hover:border-slate-200 border border-transparent transition-all group">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm border-2 border-white"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[140px]">{item.name}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">{item.symbol}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 leading-none">
                    {formatPercent(item.value, { digits: 2 })}
                  </div>
                  <div className="text-[11px] font-medium text-slate-400 mt-1">
                    {formatMoney(item.marketValue, currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
