import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatMoney, toNumber } from "../lib/formatters";
import type { AllocationItemResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";

const palette = ["#8B5CF6", "#60A5FA", "#22D3EE", "#06B6D4", "#A78BFA", "#34D399"];

interface PortfolioChartProps {
  items?: AllocationItemResponse[] | null;
  baseCurrency?: string | null;
}

export function PortfolioChart({ items, baseCurrency }: PortfolioChartProps) {
  const data = (items ?? [])
    .map((item, index) => ({
      name: item.label,
      value: toNumber(item.value) ?? 0,
      color: palette[index % palette.length],
    }))
    .filter((item) => item.value > 0);

  if (!data.length) {
    return (
      <EmptyState
        title="暂无资产分布数据"
      />
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const currency = baseCurrency ?? "CNY";

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatMoney(value, currency)}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              color: "#6b7280",
              padding: "10px 16px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              fontWeight: 500,
              fontSize: "14px"
            }}
            itemStyle={{ color: "#111827", fontWeight: 600 }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md text-gray-800 px-4 py-2.5 rounded-2xl text-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 text-center min-w-[130px]">
          <div className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-[0.1em] font-bold">Total</div>
          <div className="font-bold text-base text-gray-900 leading-tight">{formatMoney(total, currency)}</div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 flex flex-col gap-2">
        {data.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
