import { TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router";

const topGainers = [
  {
    icon: "🏅",
    name: "金牛",
    subtitle: "气息连道",
    ticker: "GOLD",
    price: "22,763.50美元",
    change: "+1.35%",
    changeAmount: "(+ 303.50美元)",
    isPositive: true,
  },
  {
    icon: "🏪",
    name: "好市多批发公司",
    subtitle: "磅来",
    ticker: "COST",
    price: "19,677.20美元",
    change: "+0.43%",
    changeAmount: "(+ 84.20美元)",
    isPositive: true,
  },
  {
    icon: "🎬",
    name: "奈飞公司",
    subtitle: "NFLX",
    ticker: "NFLX",
    price: "9,343.00美元",
    change: "+0.12%",
    changeAmount: "(+ 11.00美元)",
    isPositive: true,
  },
];

const topLosers = [
  {
    icon: "🛡️",
    name: "Vanguard标普500指数ETF",
    subtitle: "伏考",
    ticker: "VOO",
    price: "29,148.00美元",
    change: "-1.7%",
    changeAmount: "(- 504.00美元)",
    isPositive: false,
  },
  {
    icon: "🍎",
    name: "苹果公司",
    subtitle: "苹果公司",
    ticker: "AAPL",
    price: "24,880.00美元",
    change: "-1.62%",
    changeAmount: "(- 409.00美元)",
    isPositive: false,
  },
  {
    icon: "🏥",
    name: "世邦大通银发当的收获ETF",
    subtitle: "日本世界银发世界银",
    ticker: "JEPI",
    price: "27,775.00美元",
    change: "-1.14%",
    changeAmount: "(- 320.00美元)",
    isPositive: false,
  },
  {
    icon: "🏠",
    name: "家得宝公司",
    subtitle: "磅建",
    ticker: "HD",
    price: "12,866.00美元",
    change: "-2.06%",
    changeAmount: "(- 271.20美元)",
    isPositive: false,
  },
  {
    icon: "☕",
    name: "星巴克公司",
    subtitle: "星巴克",
    ticker: "SBUX",
    price: "4,340.50美元",
    change: "-4.83%",
    changeAmount: "(- 220.50美元)",
    isPositive: false,
  },
];

export function MarketMovers() {
  const navigate = useNavigate();

  const handleStockClick = (ticker: string) => {
    navigate(`/stock/${ticker}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
      {/* Top Gainers */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg text-gray-900">当日涨幅最大的股票</h3>
        </div>

        <div className="space-y-4">
          {topGainers.map((stock, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer" onClick={() => handleStockClick(stock.ticker)}>
              {/* Left Side - Stock Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500 transition-colors">
                  <span className="text-lg">{stock.icon}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-500 transition-colors">
                    {stock.name}
                  </div>
                  <div className="text-xs text-gray-400">{stock.subtitle}</div>
                </div>
              </div>

              {/* Right Side - Price & Change */}
              <div className="text-right">
                <div className="text-sm text-gray-900 mb-1">{stock.price}</div>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-emerald-500 text-sm flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stock.change}
                  </span>
                  <span className="text-xs text-emerald-500">
                    {stock.changeAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="text-lg text-gray-900">当日跌幅最大的几家</h3>
        </div>

        <div className="space-y-4">
          {topLosers.map((stock, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer" onClick={() => handleStockClick(stock.ticker)}>
              {/* Left Side - Stock Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors">
                  <span className="text-lg">{stock.icon}</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-500 transition-colors">
                    {stock.name}
                  </div>
                  <div className="text-xs text-gray-400">{stock.subtitle}</div>
                </div>
              </div>

              {/* Right Side - Price & Change */}
              <div className="text-right">
                <div className="text-sm text-gray-900 mb-1">{stock.price}</div>
                <div className="flex items-center justify-end gap-1">
                  <span className="text-red-500 text-sm flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {stock.change}
                  </span>
                  <span className="text-xs text-red-500">
                    {stock.changeAmount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button className="text-sm text-blue-500 hover:text-blue-600">
            查看全部
          </button>
        </div>
      </div>
    </div>
  );
}