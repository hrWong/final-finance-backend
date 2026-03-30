import { TrendingUp, TrendingDown, ChevronDown } from "lucide-react";

const portfolioItems = [
  {
    name: "资金",
    icon: "💰",
    subtitle: "2个项目",
    value: "¥393,588.39",
    invested: "¥290,801.46",
    gain: "+¥198,891.91",
    gainPercent: "68.39%",
    allocation: "31.93%",
    target: "45%",
    color: "#60A5FA",
    isPositive: true,
  },
  {
    name: "股票",
    icon: "📈",
    subtitle: "6个项目",
    value: "¥560,413.88",
    invested: "¥353,639.58",
    gain: "+¥277,707.87",
    gainPercent: "78.53%",
    allocation: "45.47%",
    target: "30%",
    color: "#22D3EE",
    isPositive: true,
  },
  {
    name: "现金",
    icon: "💵",
    subtitle: "1个项目",
    value: "¥120,334.05",
    invested: "¥120,334.05",
    gain: "",
    gainPercent: "",
    allocation: "9.76%",
    target: "15%",
    color: "#8B5CF6",
    isPositive: true,
  },
  {
    name: "商品",
    icon: "🏬",
    subtitle: "1个项目",
    value: "¥156,756.37",
    invested: "¥69,186.35",
    gain: "+¥87,370.02",
    gainPercent: "125.92%",
    allocation: "12.72%",
    target: "10%",
    color: "#A78BFA",
    isPositive: true,
  },
  {
    name: "财务",
    icon: "",
    subtitle: "1项",
    value: "¥1,404.45",
    invested: "¥1,855.12",
    gain: "-¥438.44",
    gainPercent: "23.63%",
    allocation: "0.11%",
    target: "",
    color: "#22D3EE",
    isPositive: false,
  },
];

export function PortfolioTable() {
  return (
    <div>
      {/* Table Header */}
      <div className="grid grid-cols-3 gap-4 pb-4 border-b border-gray-200 mb-4">
        <div className="text-sm text-gray-600">名称</div>
        <div className="text-sm text-gray-600">价值/投资</div>
        <div className="text-sm text-gray-600 flex items-center justify-between">
          增益
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-4">
        {portfolioItems.map((item, index) => (
          <div key={index}>
            <div className="grid grid-cols-3 gap-4 items-start">
              {/* Name Column */}
              <div className="flex items-start gap-3">
                {/* Color bar */}
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                
                {/* Icon and Name */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#6366F1]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {item.icon && <span className="text-lg">{item.icon}</span>}
                    {!item.icon && (
                      <svg
                        className="w-5 h-5 text-[#6366F1]"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">{item.subtitle}</div>
                  </div>
                </div>
              </div>

              {/* Value Column */}
              <div>
                <div className="font-semibold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-500">{item.invested}</div>
              </div>

              {/* Gain Column */}
              <div>
                {item.gain && (
                  <>
                    <div
                      className={`font-semibold ${
                        item.isPositive ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {item.gain}
                    </div>
                    <div
                      className={`text-sm flex items-center gap-1 ${
                        item.isPositive ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {item.isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {item.gainPercent}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Allocation Bar */}
            <div className="mt-3 ml-14 grid grid-cols-3 gap-4 items-center">
              <div className="col-span-2 flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: item.allocation,
                      backgroundColor: item.color,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">
                  {item.allocation}
                </span>
              </div>
              <div className="text-sm text-gray-600 text-right">
                {item.target}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
