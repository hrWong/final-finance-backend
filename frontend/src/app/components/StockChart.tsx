import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, MoreHorizontal } from "lucide-react";

// Mock data for the chart
const chartData = [
  { date: "Apr 25", value: 180 },
  { date: "May 25", value: 185 },
  { date: "Jun 25", value: 175 },
  { date: "Jul 25", value: 190 },
  { date: "Aug 25", value: 205 },
  { date: "Sep 25", value: 210 },
  { date: "Oct 25", value: 235 },
  { date: "Nov 25", value: 230 },
  { date: "Dec 25", value: 255 },
  { date: "2026", value: 250 },
  { date: "Feb 26", value: 270 },
  { date: "Mar 26", value: 248 },
];

const timeRanges = [
  { id: "7d", label: "7d" },
  { id: "1m", label: "1m" },
  { id: "3m", label: "3m" },
  { id: "6m", label: "6m" },
  { id: "ytd", label: "YTD" },
  { id: "1y", label: "1y", active: true },
  { id: "5y", label: "5y" },
  { id: "all", label: "all" },
];

export function StockChart() {
  const [selectedRange, setSelectedRange] = useState("1y");

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-medium text-gray-900">Price history</h3>
          <button className="text-sm text-blue-500 hover:text-blue-600">
            Select
          </button>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700">
            <option>Price ($)</option>
          </select>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setSelectedRange(range.id)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                range.active || selectedRange === range.id
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
          <div className="text-gray-600">
            Mar 30, 25 - Mar 30, 26
          </div>
          <div className="text-emerald-500 flex items-center gap-1">
            = $30.90
            <span className="flex items-center gap-1">
              ▲ +14.15%
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            data={chartData}
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
              domain={[100, 300]}
              ticks={[100, 150, 200, 250, 300]}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "8px",
                color: "white",
                padding: "8px 12px",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Cost Share Line */}
        <div className="absolute left-0 right-8 top-[220px] border-t-2 border-dashed border-red-400">
          <div className="absolute -top-3 left-4 text-xs text-red-500 bg-white px-1">
            My cost per share: $101.565
          </div>
        </div>

        {/* Max/Min indicators */}
        <div className="absolute top-12 right-8 text-xs text-gray-500">
          max: $346.18
        </div>
        <div className="absolute bottom-12 right-8 text-xs text-gray-500">
          min: $172.42
        </div>
      </div>

      {/* Benchmarks */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Benchmarks</span>
          <button className="text-sm text-blue-500 hover:text-blue-600">
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
