import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router";
import { formatMoney, formatPercent } from "../lib/formatters";
import { getInstrumentIcon } from "../lib/instruments";
import type { MarketMoverResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";

interface MarketMoversProps {
  movers?: MarketMoverResponse[] | null;
}

export function MarketMovers({ movers }: MarketMoversProps) {
  const navigate = useNavigate();
  const gainers = (movers ?? []).filter((item) => item.positive);
  const losers = (movers ?? []).filter((item) => !item.positive);

  const handleStockClick = (ticker: string) => {
    navigate(`/stock/${ticker}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg text-gray-900">当日涨幅最大的股票</h3>
        </div>

        {gainers.length ? (
          <div className="space-y-4">
            {gainers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between group cursor-pointer"
                onClick={() => handleStockClick(stock.symbol)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500 transition-colors">
                    <span className="text-lg">{getInstrumentIcon(stock.symbol, "STOCK")}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-500 transition-colors">
                      {stock.name || stock.symbol}
                    </div>
                    <div className="text-xs text-gray-400">{stock.symbol}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-900 mb-1">{formatMoney(stock.lastPrice, "USD")}</div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-emerald-500 text-sm flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {formatPercent(stock.changePercent, { digits: 2, signed: true })}
                    </span>
                    <span className="text-xs text-emerald-500">
                      ({formatMoney(stock.changeAmount, "USD", { signed: true })})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="暂无涨幅榜数据"
          />
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg text-gray-900">当日跌幅最大的几家</h3>
        </div>

        {losers.length ? (
          <div className="space-y-4">
            {losers.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between group cursor-pointer"
                onClick={() => handleStockClick(stock.symbol)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                    <span className="text-lg">{getInstrumentIcon(stock.symbol, "STOCK")}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-500 transition-colors">
                      {stock.name || stock.symbol}
                    </div>
                    <div className="text-xs text-gray-400">{stock.symbol}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-gray-900 mb-1">{formatMoney(stock.lastPrice, "USD")}</div>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-red-500 text-sm flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      {formatPercent(stock.changePercent, { digits: 2, signed: true })}
                    </span>
                    <span className="text-xs text-red-500">
                      ({formatMoney(stock.changeAmount, "USD", { signed: true })})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="暂无跌幅榜数据"
          />
        )}
      </div>
    </div>
  );
}
