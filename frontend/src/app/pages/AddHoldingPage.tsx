import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Search, Bell, Settings, TrendingUp, TrendingDown } from "lucide-react";
import { BuyModal } from "../components/BuyModal";

interface Stock {
  id: string;
  name: string;
  ticker: string;
  icon: string;
  currentPrice: string;
  priceNumber: number;
  change: string;
  changePercent: string;
  isPositive: boolean;
  sector: string;
  marketCap: string;
  pe: string;
  dividendYield: string;
}

const stocks: Stock[] = [
  {
    id: "AAPL",
    name: "苹果公司",
    ticker: "AAPL",
    icon: "🍎",
    currentPrice: "¥248.80",
    priceNumber: 248.80,
    change: "-¥4.09",
    changePercent: "-1.62%",
    isPositive: false,
    sector: "科技",
    marketCap: "¥3.65T",
    pe: "31.5",
    dividendYield: "0.42%",
  },
  {
    id: "MSFT",
    name: "微软公司",
    ticker: "MSFT",
    icon: "🖥️",
    currentPrice: "¥420.55",
    priceNumber: 420.55,
    change: "+¥5.30",
    changePercent: "+1.28%",
    isPositive: true,
    sector: "科技",
    marketCap: "¥3.12T",
    pe: "35.2",
    dividendYield: "0.72%",
  },
  {
    id: "GOOGL",
    name: "谷歌公司",
    ticker: "GOOGL",
    icon: "🔍",
    currentPrice: "¥175.23",
    priceNumber: 175.23,
    change: "+¥2.15",
    changePercent: "+1.24%",
    isPositive: true,
    sector: "科技",
    marketCap: "¥2.18T",
    pe: "27.8",
    dividendYield: "0%",
  },
  {
    id: "AMZN",
    name: "亚马逊公司",
    ticker: "AMZN",
    icon: "📦",
    currentPrice: "¥186.42",
    priceNumber: 186.42,
    change: "+¥3.87",
    changePercent: "+2.12%",
    isPositive: true,
    sector: "消费",
    marketCap: "¥1.92T",
    pe: "42.3",
    dividendYield: "0%",
  },
  {
    id: "TSLA",
    name: "特斯拉公司",
    ticker: "TSLA",
    icon: "🚗",
    currentPrice: "¥245.67",
    priceNumber: 245.67,
    change: "-¥8.23",
    changePercent: "-3.24%",
    isPositive: false,
    sector: "汽车",
    marketCap: "¥778B",
    pe: "68.5",
    dividendYield: "0%",
  },
  {
    id: "NVDA",
    name: "英伟达公司",
    ticker: "NVDA",
    icon: "🎮",
    currentPrice: "¥875.28",
    priceNumber: 875.28,
    change: "+¥12.45",
    changePercent: "+1.44%",
    isPositive: true,
    sector: "科技",
    marketCap: "¥2.16T",
    pe: "95.3",
    dividendYield: "0.03%",
  },
  {
    id: "META",
    name: "Meta平台公司",
    ticker: "META",
    icon: "📱",
    currentPrice: "¥485.32",
    priceNumber: 485.32,
    change: "+¥7.89",
    changePercent: "+1.65%",
    isPositive: true,
    sector: "科技",
    marketCap: "¥1.24T",
    pe: "28.6",
    dividendYield: "0%",
  },
  {
    id: "JPM",
    name: "摩根大通银行",
    ticker: "JPM",
    icon: "🏦",
    currentPrice: "¥198.75",
    priceNumber: 198.75,
    change: "-¥1.52",
    changePercent: "-0.76%",
    isPositive: false,
    sector: "金融",
    marketCap: "¥575B",
    pe: "11.8",
    dividendYield: "2.15%",
  },
];

const funds: Stock[] = [
  {
    id: "VOO",
    name: "Vanguard标普500指数ETF",
    ticker: "VOO",
    icon: "📊",
    currentPrice: "¥450.32",
    priceNumber: 450.32,
    change: "+¥3.25",
    changePercent: "+0.73%",
    isPositive: true,
    sector: "指数基金",
    marketCap: "¥428B",
    pe: "24.5",
    dividendYield: "1.35%",
  },
  {
    id: "VTI",
    name: "Vanguard整体股市ETF",
    ticker: "VTI",
    icon: "📈",
    currentPrice: "¥235.67",
    priceNumber: 235.67,
    change: "+¥2.15",
    changePercent: "+0.92%",
    isPositive: true,
    sector: "指数基金",
    marketCap: "¥325B",
    pe: "23.8",
    dividendYield: "1.42%",
  },
  {
    id: "QQQ",
    name: "纳斯达克100指数ETF",
    ticker: "QQQ",
    icon: "💹",
    currentPrice: "¥378.45",
    priceNumber: 378.45,
    change: "-¥2.34",
    changePercent: "-0.61%",
    isPositive: false,
    sector: "指数基金",
    marketCap: "¥198B",
    pe: "32.1",
    dividendYield: "0.58%",
  },
];

const bonds: Stock[] = [
  {
    id: "TLT",
    name: "iShares 20年期美国国债ETF",
    ticker: "TLT",
    icon: "📜",
    currentPrice: "¥92.45",
    priceNumber: 92.45,
    change: "+¥0.85",
    changePercent: "+0.93%",
    isPositive: true,
    sector: "债券",
    marketCap: "¥45B",
    pe: "-",
    dividendYield: "3.85%",
  },
  {
    id: "AGG",
    name: "iShares核心美国综合债券ETF",
    ticker: "AGG",
    icon: "📑",
    currentPrice: "¥98.32",
    priceNumber: 98.32,
    change: "+¥0.42",
    changePercent: "+0.43%",
    isPositive: true,
    sector: "债券",
    marketCap: "¥95B",
    pe: "-",
    dividendYield: "3.12%",
  },
];

export function AddHoldingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"stocks" | "funds" | "bonds">("stocks");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const getCurrentList = () => {
    switch (activeTab) {
      case "stocks":
        return stocks;
      case "funds":
        return funds;
      case "bonds":
        return bonds;
      default:
        return stocks;
    }
  };

  const filteredList = getCurrentList().filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ticker.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBuyClick = (stock: Stock, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStock(stock);
    setShowBuyModal(true);
  };

  const handleRowClick = (ticker: string) => {
    navigate(`/stock/${ticker}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="text-gray-900 font-semibold text-sm">SNOWBALL</div>
                <div className="text-gray-600 text-sm">ANALYTICS</div>
              </div>
              <nav className="flex items-center gap-6">
                <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  仪表板
                </Link>
                <Link to="/analysis" className="text-gray-600 hover:text-gray-900 text-sm">
                  分析
                </Link>
                <Link to="/add-holding" className="text-blue-500 text-sm font-medium">
                  添加
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">添加持仓</h1>
          <p className="text-gray-600">选择要添加到投资组合的资产</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab("stocks")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "stocks"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            股票
          </button>
          <button
            onClick={() => setActiveTab("funds")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "funds"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            基金
          </button>
          <button
            onClick={() => setActiveTab("bonds")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "bonds"
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            债券
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索股票代码或公司名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  股票
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  当前价格
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  涨跌额
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  涨跌幅
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  市值
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  市盈率
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  股息率
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredList.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(item.ticker)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 hover:text-blue-500">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">{item.ticker}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600">{item.sector}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900">
                      {item.currentPrice}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`text-sm ${
                        item.isPositive ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {item.change}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      {item.isPositive ? (
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          item.isPositive ? "text-emerald-500" : "text-red-500"
                        }`}
                      >
                        {item.changePercent}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-gray-600">{item.marketCap}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-gray-600">{item.pe}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-gray-600">{item.dividendYield}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => handleBuyClick(item, e)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      买入
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredList.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">未找到匹配的结果</p>
            </div>
          )}
        </div>
      </main>

      {/* Buy Modal */}
      {showBuyModal && selectedStock && (
        <BuyModal
          stock={selectedStock}
          onClose={() => {
            setShowBuyModal(false);
            setSelectedStock(null);
          }}
        />
      )}
    </div>
  );
}