import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Bell, Settings, TrendingUp, TrendingDown } from "lucide-react";
import { BuyModal } from "../components/BuyModal";
import { searchAssets, getStockOverview } from "../lib/api";
import { formatMoney, formatPercent } from "../lib/formatters";
import { getInstrumentIcon } from "../lib/instruments";
import type { AssetSearchItemResponse, StockOverviewResponse } from "../lib/types";
import { EmptyState } from "../components/EmptyState";

interface SearchRow {
  id: string;
  name: string;
  ticker: string;
  icon: string;
  currentPrice: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  sector: string;
  marketCap: string;
  pe: string;
  dividendYield: string;
  currency: string;
}

const typeMap = {
  stocks: "STOCK",
  funds: "FUND",
  bonds: "BOND",
} as const;

function buildSearchRow(
  asset: AssetSearchItemResponse,
  overview: StockOverviewResponse | null,
): SearchRow {
  const currency = overview?.currency || asset.currency || "USD";
  return {
    id: asset.symbol,
    name: asset.nameZh || asset.name || asset.symbol,
    ticker: asset.symbol,
    icon: getInstrumentIcon(asset.symbol, asset.assetType),
    currentPrice: formatMoney(overview?.lastPrice, currency),
    change: formatMoney(overview?.changeAmount, currency, { signed: true }),
    changePercent: formatPercent(overview?.changePercent, { digits: 2, signed: true }),
    isPositive: Number(overview?.changeAmount ?? 0) >= 0,
    sector: asset.assetType || "--",
    marketCap: formatMoney(overview?.marketCap, currency, { compact: true, maximumFractionDigits: 1 }),
    pe: overview?.pe !== null && overview?.pe !== undefined ? String(overview.pe) : "--",
    dividendYield: formatPercent(overview?.dividendYield, { digits: 2 }),
    currency,
  };
}

export function AddHoldingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"stocks" | "funds" | "bonds">("stocks");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchRow[]>([]);
  const [selectedStock, setSelectedStock] = useState<SearchRow | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTouched, setSearchTouched] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSearchResults() {
      if (!searchQuery.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const assets = await searchAssets(searchQuery, typeMap[activeTab]);

      if (cancelled) {
        return;
      }

      if (!assets?.length) {
        setResults([]);
        setLoading(false);
        return;
      }

      const enriched = await Promise.all(
        assets.slice(0, 12).map(async (asset) => {
          const overview = await getStockOverview(asset.symbol);
          return buildSearchRow(asset, overview);
        }),
      );

      if (cancelled) {
        return;
      }

      setResults(enriched);
      setLoading(false);
    }

    loadSearchResults();

    return () => {
      cancelled = true;
    };
  }, [activeTab, searchQuery]);

  const handleBuyClick = (stock: SearchRow, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedStock(stock);
    setShowBuyModal(true);
  };

  const handleRowClick = (ticker: string) => {
    navigate(`/stock/${ticker}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
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
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">添加持仓</h1>
          <p className="text-gray-600">搜索后端资产库并直接提交买入交易</p>
        </div>

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

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索股票代码或公司名称..."
              value={searchQuery}
              onChange={(event) => {
                setSearchTouched(true);
                setSearchQuery(event.target.value);
              }}
              className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-500">正在从后端搜索资产...</div>
          ) : results.length ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">资产</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">当前价格</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">涨跌额</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">涨跌幅</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">市值</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">市盈率</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">股息率</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {results.map((item) => (
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
                      <span className="text-sm font-medium text-gray-900">{item.currentPrice}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`text-sm ${item.isPositive ? "text-emerald-500" : "text-red-500"}`}>
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
                        <span className={`text-sm font-medium ${item.isPositive ? "text-emerald-500" : "text-red-500"}`}>
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
                        onClick={(event) => handleBuyClick(item, event)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        买入
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8">
              <EmptyState
                title={searchTouched ? "没有搜索到可用资产" : "输入关键字开始搜索"}
                description={searchTouched
                  ? "如果后端搜索接口未完成或没有数据，这里会保持为空。"
                  : "该页面不再使用前端 mock 列表，只展示后端搜索结果。"}
              />
            </div>
          )}
        </div>
      </main>

      {showBuyModal && selectedStock ? (
        <BuyModal
          stock={selectedStock}
          onClose={() => {
            setShowBuyModal(false);
            setSelectedStock(null);
          }}
        />
      ) : null}
    </div>
  );
}
