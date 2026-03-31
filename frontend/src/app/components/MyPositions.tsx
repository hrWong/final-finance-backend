import { formatMoney, formatNumber, formatPercent } from "../lib/formatters";
import type { CurrentPortfolioResponse, PositionResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";

interface MyPositionsProps {
  position?: PositionResponse | null;
  portfolio?: CurrentPortfolioResponse | null;
  currency?: string | null;
}

export function MyPositions({ position, portfolio, currency }: MyPositionsProps) {
  if (!position || (!position.symbol && !position.assetName)) {
    return (
      <EmptyState
        title="暂无我的持仓数据"
        description="后端单只股票持仓接口当前没有返回数据。"
      />
    );
  }

  const displayCurrency = currency ?? portfolio?.baseCurrency ?? "USD";
  const positive = Number(position.unrealizedPnl ?? 0) >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">My positions</h3>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs">📊</span>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {portfolio?.name || "CURRENT PORTFOLIO"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">General</h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Shares</div>
              <div className="text-sm text-gray-900">{formatNumber(position.quantity, { digits: 2 })}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Current value</div>
              <div className="text-sm text-gray-900">{formatMoney(position.marketValue, displayCurrency)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Cost per share</div>
              <div className="text-sm text-gray-900">{formatMoney(position.avgCost, displayCurrency)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Cost basis</div>
              <div className="text-sm text-gray-900">{formatMoney(position.costBasis, displayCurrency)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Share in portfolio</div>
              <div className="text-sm text-gray-900">{formatPercent(position.portfolioWeight, { digits: 2 })}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Pricing</h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Last price</div>
              <div className="text-sm text-gray-900">{formatMoney(position.lastPrice, displayCurrency)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Price as of</div>
              <div className="text-sm text-gray-900">{position.priceAsOf || "--"}</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Returns</h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Unrealized profit</div>
              <div className={`text-sm flex items-center gap-1 ${positive ? "text-emerald-500" : "text-red-500"}`}>
                {formatMoney(position.unrealizedPnl, displayCurrency, { signed: true })}
                <span>{formatPercent(position.unrealizedPnlPct, { digits: 2, signed: true })}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Notes</h4>
          <div className="text-sm text-gray-500 leading-relaxed">
            后端当前没有额外 notes 字段，这里只展示仓位汇总。
          </div>
        </div>
      </div>
    </div>
  );
}
