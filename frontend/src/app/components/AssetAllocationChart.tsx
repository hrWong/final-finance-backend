import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { X } from "lucide-react";

const assetData = [
  { name: "SK 大韩航空股价 ETF", value: 16.35, color: "#6366F1" },
  { name: "本周 默种水增费单独组留站ETF", value: 15.39, color: "#8B5CF6" },
  { name: "AAPL 医益公司", value: 13.95, color: "#22D3EE" },
  { name: "原分析价 金源", value: 12.74, color: "#A78BFA" },
  { name: "住流 好开多批发公司", value: 11.04, color: "#60A5FA" },
  { name: "泉属 营业公司", value: 7.22, color: "#34D399" },
  { name: "实际3 大气现金相关公司", value: 5.58, color: "#10B981" },
  { name: "案长 奏长", value: 5.41, color: "#14B8A6" },
  { name: "MRSK Netflix公司", value: 5.24, color: "#06B6D4" },
  { name: "后记 库石", value: 4.35, color: "#0EA5E9" },
  { name: "SBUX 器巴克公司", value: 2.41, color: "#3B82F6" },
  { name: "3196 54岁 甲骨文公司", value: 0.11, color: "#6366F1" },
  { name: "AGMRF 1311巨资金公司", value: 0.00, color: "#8B5CF6" },
];

export function AssetAllocationChart() {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2">
            所有资产
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
            区域
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
            接所
          </button>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm">
            国家
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">地区有肯</span>
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2">
            定入
            <span className="w-6 h-6 flex items-center justify-center">▽</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg text-sm flex items-center gap-2">
            所有发医
            <span className="text-blue-500">卷</span>
          </button>
        </div>
      </div>

      {/* Chart and Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Pie Chart */}
        <div className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={assetData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={160}
                paddingAngle={1}
                dataKey="value"
                stroke="none"
              >
                {assetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toFixed(2)}%`}
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

        {/* Legend */}
        <div className="space-y-3">
          {assetData.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900 ml-4">
                {item.value.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg text-gray-900 mb-4">资产类型</h3>
      </div>
    </div>
  );
}
