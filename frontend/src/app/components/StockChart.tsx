import { useEffect, useState } from "react";
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Calendar, MoreHorizontal } from "lucide-react";
import { getStockHistory } from "../lib/api";
import { formatDate, formatMoney, formatPercent, toNumber } from "../lib/formatters";
import type { StockHistoryPointResponse, TransactionResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";

const timeRanges = [
  { id: "7d", label: "7d" },
  { id: "1m", label: "1m" },
  { id: "3m", label: "3m" },
  { id: "6m", label: "6m" },
  { id: "ytd", label: "YTD" },
  { id: "1y", label: "1y" },
  { id: "5y", label: "5y" },
  { id: "all", label: "all" },
];

interface StockChartProps {
  symbol?: string;
  currency?: string | null;
  costPerShare?: number | null;
  transactions?: TransactionResponse[] | null;
}

export function StockChart({ symbol = "AAPL", currency = "USD", costPerShare, transactions }: StockChartProps) {
  const [selectedRange, setSelectedRange] = useState("1y");
  const [history, setHistory] = useState<StockHistoryPointResponse[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      const data = await getStockHistory(symbol, selectedRange);
      if (cancelled) {
        return;
      }

      const meaningfulData = (data ?? []).filter((point) => toNumber(point.close) !== null);
      setHistory(meaningfulData.length > 1 ? meaningfulData : null);
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, [selectedRange, symbol]);

  if (!history?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium text-gray-900">Price history</h3>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-gray-100 rounded-lg">
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setSelectedRange(range.id)}
              className={`px-3 py-1.5 text-sm rounded-lg ${selectedRange === range.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {range.label}
            </button>
          ))}
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <EmptyState
          title="暂无历史行情数据"
        />
      </div>
    );
  }

  const formattedTxs = (transactions || []).map(t => ({
    ...t,
    formattedDate: formatDate(t.tradeDate),
    rawTimestamp: new Date(t.tradeDate).getTime()
  }));

  const baseHistory = history.map((point) => ({
    rawDate: new Date(point.date).getTime(),
    date: formatDate(point.date),
    value: toNumber(point.close) ?? 0,
  }));

  // 将不在 history 中的交易日期强制插入到走势图中
  formattedTxs.forEach(t => {
    if (!baseHistory.some(h => h.date === t.formattedDate)) {
      baseHistory.push({
        rawDate: t.rawTimestamp,
        date: t.formattedDate,
        value: 0, // 之后会用临近的值向前填充
      });
    }
  });

  baseHistory.sort((a, b) => a.rawDate - b.rawDate);

  let lastVal = baseHistory[0]?.value || 0;
  const displayData = baseHistory.map((point) => {
    if (point.value && point.value > 0) {
      lastVal = point.value;
    } else {
      point.value = lastVal;
    }

    const dayTxs = formattedTxs.filter(t => t.formattedDate === point.date);
    const buys = dayTxs.filter(t => t.type === 'BUY');
    const sells = dayTxs.filter(t => t.type === 'SELL');
    return {
      date: point.date,
      value: point.value,
      buyPrice: buys.length > 0 ? buys[0].price : null,
      sellPrice: sells.length > 0 ? sells[0].price : null,
      transactions: dayTxs.length > 0 ? dayTxs : null,
    };
  });
  const firstValue = displayData[0]?.value ?? 0;
  const lastValue = displayData[displayData.length - 1]?.value ?? 0;
  const changeAmount = lastValue - firstValue;
  const changePercent = firstValue ? (changeAmount / firstValue) * 100 : 0;
  const maxValue = Math.max(...displayData.map((item) => item.value));
  const minValue = Math.min(...displayData.map((item) => item.value));
  const yPadding = Math.max((maxValue - minValue) * 0.15, 1);
  const domainMin = Math.max(0, Math.floor(minValue - yPadding));
  const domainMax = Math.ceil(maxValue + yPadding);
  const headerRange = `${formatDate(history[0].date)} - ${formatDate(history[history.length - 1].date)}`;
  const positive = changeAmount >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900">Price history</h3>
          <button className="text-sm text-blue-500 hover:text-blue-600">
            Backend
          </button>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700">
            <option>{currency} Price</option>
          </select>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setSelectedRange(range.id)}
              className={`px-3 py-1.5 text-sm rounded-lg ${selectedRange === range.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {range.label}
            </button>
          ))}
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Calendar className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-gray-600">{headerRange}</div>
          <div className={`${positive ? "text-emerald-500" : "text-red-500"} flex items-center gap-1`}>
            {formatMoney(changeAmount, currency, { signed: true })}
            <span>{formatPercent(changePercent, { digits: 2, signed: true })}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={displayData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              domain={[domainMin, domainMax]}
              dx={-10}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload;
                  return (
                    <div className="bg-[#1F2937] text-white p-3 rounded-lg shadow-lg text-sm border-none z-50 relative">
                      <p className="font-semibold mb-2">{label}</p>
                      <p className="text-gray-300 font-medium pb-2 border-b border-gray-600 mb-2">
                        收盘价: <span className="text-white">{formatMoney(dataPoint.value, currency)}</span>
                      </p>
                      {dataPoint.transactions && dataPoint.transactions.map((tx: any, idx: number) => (
                        <div key={idx} className={`mt-2 ${tx.type === 'BUY' ? 'text-red-400' : 'text-emerald-400'}`}>
                          <p className="font-medium">{tx.type === 'BUY' ? '🔴 买入' : '🟢 卖出'}</p>
                          <p>成交价: {formatMoney(tx.price, currency)}</p>
                          <p>数量: {tx.quantity} 股</p>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            {costPerShare ? (
              <ReferenceLine
                y={costPerShare}
                stroke="#f87171"
                strokeDasharray="6 6"
                label={{
                  value: `My cost per share: ${formatMoney(costPerShare, currency)}`,
                  position: "insideTopLeft",
                  fill: "#ef4444",
                  fontSize: 12,
                }}
              />
            ) : null}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
            <Line
              type="monotone"
              dataKey="buyPrice"
              stroke="none"
              isAnimationActive={false}
              dot={{ r: 5, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="sellPrice"
              stroke="none"
              isAnimationActive={false}
              dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 7, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="absolute top-12 right-8 text-xs text-gray-500">
          max: {formatMoney(maxValue, currency)}
        </div>
        <div className="absolute bottom-12 right-8 text-xs text-gray-500">
          min: {formatMoney(minValue, currency)}
        </div>
      </div>
    </div>
  );
}
