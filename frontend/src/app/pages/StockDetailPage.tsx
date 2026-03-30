import { useParams, Link } from "react-router";
import { Star, Plus, Share2, ChevronDown, MoreHorizontal } from "lucide-react";
import { StockChart } from "../components/StockChart";
import { StockSidebar } from "../components/StockSidebar";
import { MyPositions } from "../components/MyPositions";
import { TransactionsTable } from "../components/TransactionsTable";
import { AboutCompany } from "../components/AboutCompany";

const stockData: Record<string, any> = {
  AAPL: {
    name: "Apple Inc",
    ticker: "AAPL",
    exchange: "NASDAQ",
    icon: "🍎",
    price: "$248.80",
    change: "-$4.09",
    changePercent: "-1.62%",
    isNegative: true,
    earningsDate: "Apr 29",
    pe: "31.5",
    eps: "7.9",
    exDivDate: "$3.65T",
    dividendYield: "0.42%",
    breadcrumb: ["Stocks", "United States of America", "Information Technology"],
  },
};

export function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const stock = stockData[symbol?.toUpperCase() || "AAPL"] || stockData.AAPL;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="text-gray-900 font-semibold text-sm">
                  SNOWBALL
                </div>
                <div className="text-gray-600 text-sm">ANALYTICS</div>
              </div>
              <nav className="flex items-center gap-6">
                <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  Tools
                </Link>
                <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
                  Community
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <div className="w-5 h-5 bg-yellow-400 rounded-full"></div>
              </button>
              <Link 
                to="/analysis"
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-sm hover:bg-blue-200"
              >
                My portfolios
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          {stock.breadcrumb.map((item: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <span>{item}</span>
              {index < stock.breadcrumb.length - 1 && (
                <span className="text-gray-400">›</span>
              )}
            </div>
          ))}
        </div>

        {/* Stock Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
                <span className="text-3xl">{stock.icon}</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {stock.name}
                  </h1>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <span>{stock.ticker} · {stock.exchange}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Star className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Plus className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="flex items-end gap-3">
              <div className="text-4xl font-semibold text-gray-900">
                {stock.price}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-lg ${stock.isNegative ? "text-red-500" : "text-emerald-500"}`}>
                  {stock.change}
                </span>
                <span className={`text-sm flex items-center gap-1 px-2 py-1 rounded ${
                  stock.isNegative ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                }`}>
                  {stock.isNegative ? "▼" : "▲"} {stock.changePercent}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-gray-500 mb-1">Earnings date</div>
                <div className="text-gray-900 font-medium">{stock.earningsDate}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 mb-1">P/E</div>
                <div className="text-gray-900 font-medium">{stock.pe}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 mb-1">EPS</div>
                <div className="text-gray-900 font-medium">{stock.eps}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 mb-1">Ex-div cap</div>
                <div className="text-gray-900 font-medium">{stock.exDivDate}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 mb-1">Dividend yield</div>
                <div className="text-gray-900 font-medium">{stock.dividendYield}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex items-center gap-8">
            <button className="px-1 pb-3 text-blue-500 font-medium border-b-2 border-blue-500">
              Overview
            </button>
            <button className="px-1 pb-3 text-gray-600 hover:text-gray-900">
              Dividends
            </button>
            <button className="px-1 pb-3 text-gray-600 hover:text-gray-900">
              Financials
            </button>
            <button className="px-1 pb-3 text-gray-600 hover:text-gray-900">
              News
            </button>
            <button className="px-1 pb-3 text-gray-600 hover:text-gray-900">
              Community
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chart Section */}
            <StockChart />

            {/* My Positions */}
            <MyPositions />

            {/* Transactions Table */}
            <TransactionsTable />

            {/* About Company */}
            <AboutCompany />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <StockSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
