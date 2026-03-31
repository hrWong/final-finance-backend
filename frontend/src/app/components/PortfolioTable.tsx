import { ChevronDown } from "lucide-react";
import { formatMoney, formatPercent, toNumber } from "../lib/formatters";
import type { AllocationItemResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";
import { getInstrumentIcon } from "../lib/instruments";

const palette = ["#60A5FA", "#22D3EE", "#8B5CF6", "#A78BFA", "#34D399", "#06B6D4"];

interface PortfolioTableProps {
  items?: AllocationItemResponse[] | null;
  baseCurrency?: string | null;
}

export function PortfolioTable({ items, baseCurrency }: PortfolioTableProps) {
  const rows = (items ?? [])
    .map((item, index) => ({
      name: item.label,
      icon: getInstrumentIcon(item.label),
      value: toNumber(item.value) ?? 0,
      weight: toNumber(item.weight) ?? 0,
      color: palette[index % palette.length],
    }))
    .filter((item) => item.value > 0);

  if (!rows.length) {
    return (
      <EmptyState
        title="暂无资产明细"
        description="后端还没有返回 dashboard allocation 列表。"
      />
    );
  }

  const currency = baseCurrency ?? "CNY";

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200 mb-4">
        <div className="text-sm text-gray-600">名称</div>
        <div className="text-sm text-gray-600">价值</div>
        <div className="text-sm text-gray-600 flex items-center justify-between">
          占比
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-3 gap-4 items-start">
              <div className="flex items-start gap-3">
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#6366F1]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">后端 allocation</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold text-gray-900">{formatMoney(item.value, currency)}</div>
              </div>

              <div className="font-semibold text-gray-900">
                {formatPercent(item.weight, { digits: 2 })}
              </div>
            </div>

            <div className="mt-3 ml-14 grid grid-cols-3 gap-4 items-center">
              <div className="col-span-2 flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${item.weight}%`,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">
                  {formatPercent(item.weight, { digits: 2 })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
