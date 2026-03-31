import { Link } from "react-router";
import { formatMoney, formatNumber, formatPercent, toNumber } from "../lib/formatters";
import type { PositionResponse } from "../lib/types";
import { getInstrumentIcon } from "../lib/instruments";
import { EmptyState } from "./EmptyState";

interface HoldingsTableProps {
  positions?: PositionResponse[] | null;
  baseCurrency?: string | null;
}

export function HoldingsTable({ positions, baseCurrency }: HoldingsTableProps) {
  const currency = baseCurrency ?? "CNY";
  const rows = (positions ?? []).filter((position) => position.symbol || position.assetName);

  if (!rows.length) {
    return (
      <EmptyState
        title="暂无持仓数据"
        description="后端 positions 接口当前没有返回持仓列表。"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pb-3 text-sm font-medium text-gray-600">资产</th>
            <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">数量</th>
            <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">成本价</th>
            <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">最新价</th>
            <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">市值</th>
            <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">浮盈亏</th>
            <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">占比</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((position, index) => {
            const symbol = position.symbol || `ASSET-${index + 1}`;
            const positive = (toNumber(position.unrealizedPnl) ?? 0) >= 0;

            return (
              <tr key={symbol} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4">
                  <Link to={`/stock/${symbol}`} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{getInstrumentIcon(symbol, "STOCK")}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {position.assetName || symbol}
                      </div>
                      <div className="text-xs text-gray-500">{symbol}</div>
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-900">
                  {formatNumber(position.quantity, { digits: 2 })}
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-900">
                  {formatMoney(position.avgCost, currency)}
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-900">
                  {formatMoney(position.lastPrice, currency)}
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-900">
                  {formatMoney(position.marketValue, currency)}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className={`text-sm ${positive ? "text-emerald-500" : "text-red-500"}`}>
                    {formatMoney(position.unrealizedPnl, currency, { signed: true })}
                  </div>
                  <div className={`text-xs ${positive ? "text-emerald-500" : "text-red-500"}`}>
                    {formatPercent(position.unrealizedPnlPct, { digits: 2, signed: true })}
                  </div>
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-900">
                  {formatPercent(position.portfolioWeight, { digits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
