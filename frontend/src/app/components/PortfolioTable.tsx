import { useState } from "react";
import { Link } from "react-router";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import { formatMoney, formatPercent, toNumber } from "../lib/formatters";
import type { AllocationItemResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";

const palette = ["#60A5FA", "#22D3EE", "#8B5CF6", "#A78BFA", "#34D399", "#06B6D4"];

interface PortfolioTableProps {
  items?: AllocationItemResponse[] | null;
  baseCurrency?: string | null;
}

function getCategoryIcon(label: string) {
  switch (label) {
    case "Stocks": return "📈";
    case "Funds": return "📊";
    case "Cash": return "💰";
    default: return "📦";
  }
}

export function PortfolioTable({ items, baseCurrency }: PortfolioTableProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const rows = (items ?? [])
    .map((item, index) => ({
      name: item.label,
      icon: getCategoryIcon(item.label),
      itemCount: item.itemCount ?? 0,
      value: toNumber(item.value) ?? 0,
      invested: toNumber(item.invested) ?? 0,
      gain: toNumber(item.gain) ?? 0,
      gainPct: toNumber(item.gainPct) ?? 0,
      weight: toNumber(item.weight) ?? 0,
      positions: item.positions || [],
      color: palette[index % palette.length],
    }))
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value);

  if (!rows.length) {
    return (
      <EmptyState
        title="暂无资产明细"

      />
    );
  }

  const currency = baseCurrency ?? "CNY";

  const toggleCategory = (name: string) => {
    setExpandedCategory(expandedCategory === name ? null : name);
  };

  return (
    <div>
      <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 mb-4 px-2">
        <div className="text-sm text-gray-500 font-medium">名称</div>
        <div className="text-sm text-gray-500 font-medium">价值 / 成本</div>
        <div className="text-sm text-gray-500 font-medium">累计盈亏</div>
        <div className="text-sm text-gray-500 font-medium flex items-center justify-between">
          占比
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((item, index) => (
          <div key={index} className="border border-transparent hover:border-gray-100 rounded-2xl transition-all">
            <div
              className={`grid grid-cols-4 gap-4 items-center p-3 cursor-pointer rounded-2xl transition-colors ${expandedCategory === item.name ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}
              onClick={() => toggleCategory(item.name)}
            >
              {/* Category Name & Icon */}
              <div className="flex items-center gap-3">
                <div className="text-gray-400">
                  {expandedCategory === item.name ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </div>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                  <span className="text-xl">{item.icon}</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900 leading-tight">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {item.itemCount} {item.itemCount === 1 ? 'item' : 'items'}
                  </div>
                </div>
              </div>

              {/* Value / Invested */}
              <div>
                <div className="font-bold text-gray-900">{formatMoney(item.value, currency)}</div>
                <div className="text-xs text-gray-400 mt-1 font-medium">{formatMoney(item.invested, currency)}</div>
              </div>

              {/* Gain / Gain % */}
              <div>
                {item.name === "Cash" ? (
                  <span className="text-gray-300">-</span>
                ) : (
                  <>
                    <div className={`flex items-center gap-1 font-bold ${item.gain >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {item.gain >= 0 ? "+" : ""}{formatMoney(item.gain, currency)}
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-semibold mt-1 ${item.gain >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {formatPercent(item.gainPct, { signed: true, digits: 2 })}
                    </div>
                  </>
                )}
              </div>

              {/* Allocation & Progress Bar */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center pr-1">
                  <span className="text-sm font-bold text-gray-700">
                    {formatPercent(item.weight, { digits: 2 })}
                  </span>
                </div>
                <div className="bg-gray-100 rounded-full h-2 w-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.weight}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Expanded Content (Sub-items) */}
            {expandedCategory === item.name && item.positions.length > 0 && (
              <div className="px-3 pb-4 ml-8 pr-4">
                <div className="bg-gray-50/80 rounded-xl border border-gray-100 overflow-hidden">
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                      <thead className="sticky top-0 bg-gray-100/10 backdrop-blur-sm shadow-sm">
                        <tr className="text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100">
                          <th className="px-4 py-2">代码</th>
                          <th className="px-4 py-2">名称</th>
                          <th className="px-4 py-2 text-right">计算价值</th>
                          <th className="px-4 py-2 text-center w-10"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100/50">
                        {item.positions.map((pos, pIdx) => (
                          <tr key={pIdx} className="hover:bg-white transition-colors group">
                            <td className="px-4 py-3 text-sm font-bold text-blue-600">{pos.symbol}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 truncate max-w-[150px]">{pos.assetName}</td>
                            <td className="px-4 py-3 text-sm font-mono text-gray-900 text-right">{formatMoney(pos.marketValue || 0, currency)}</td>
                            <td className="px-4 py-3 text-center">
                              <Link
                                to={`/stock/${pos.symbol}`}
                                className="p-1.5 hover:bg-blue-100 rounded-lg inline-flex text-blue-500 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
