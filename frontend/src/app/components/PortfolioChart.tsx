import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const portfolioData = [
  { name: "现金", value: 120334.05, color: "#8B5CF6" },
  { name: "资金", value: 393588.39, color: "#60A5FA" },
  { name: "股票", value: 560413.88, color: "#22D3EE" },
  { name: "财务", value: 1404.45, color: "#06B6D4" },
  { name: "商品", value: 156756.37, color: "#A78BFA" },
];

const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0);

export function PortfolioChart() {
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={portfolioData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={140}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {portfolioData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `¥${value.toLocaleString("zh-CN")}`}
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

      {/* Custom Tooltip for Cash */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-[#8B5CF6] rounded-full"></div>
            <span>Cash: CNH 120,334.05</span>
          </div>
          <div className="text-center text-xs text-gray-300">9.76 %</div>
        </div>
      </div>

      {/* Legend - showing at bottom left of chart */}
      <div className="absolute bottom-0 left-0 flex flex-col gap-2">
        {portfolioData.slice(0, 3).map((item, index) => (
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
