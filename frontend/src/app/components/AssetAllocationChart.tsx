import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatPercent, toNumber } from "../lib/formatters";
import type { PositionResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";

const palette = ["#6366F1", "#8B5CF6", "#22D3EE", "#A78BFA", "#60A5FA", "#34D399", "#10B981", "#14B8A6"];

interface AssetAllocationChartProps {
  positions?: PositionResponse[] | null;
}

export function AssetAllocationChart({ positions }: AssetAllocationChartProps) {
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
        value: weight,
        color: palette[index % palette.length],
      };
    })
    .filter((item) => item.value > 0);

  if (!data.length) {
    return (
      <EmptyState
        title="暂无持仓分布数据"
        description="后端 positions 接口当前没有返回可用的仓位占比。"
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2">
            所有资产
          </button>
        </div>
        <div className="text-sm text-gray-600">来自后端持仓占比</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={160}
                paddingAngle={1}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatPercent(value, { digits: 2 })}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  padding: "8px 12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 ml-4">
                {formatPercent(item.value, { digits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
