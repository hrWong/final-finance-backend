import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Star, Plus, Share2, ChevronDown } from "lucide-react";
import { StockChart } from "../components/StockChart";
import { StockSidebar } from "../components/StockSidebar";
import { MyPositions } from "../components/MyPositions";
import { TransactionsTable } from "../components/TransactionsTable";
import { AboutCompany } from "../components/AboutCompany";
import { getAsset, getPortfolio, getStockOverview, getStockPosition, getStockTransactions } from "../lib/api";
import { formatMoney, formatPercent } from "../lib/formatters";
import { getInstrumentIcon } from "../lib/instruments";
import type {
  AssetResponse,
  CurrentPortfolioResponse,
  PositionResponse,
  StockOverviewResponse,
  TransactionResponse,
} from "../lib/types";

export function StockDetailPage() {
  const { symbol } = useParams<{ symbol: string }>();
  const normalizedSymbol = symbol?.toUpperCase() || "AAPL";
  const [overview, setOverview] = useState<StockOverviewResponse | null>(null);
  const [asset, setAsset] = useState<AssetResponse | null>(null);
  const [position, setPosition] = useState<PositionResponse | null>(null);
  const [transactions, setTransactions] = useState<TransactionResponse[] | null>(null);
  const [portfolio, setPortfolio] = useState<CurrentPortfolioResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStockPage() {
      const [overviewData, assetData, positionData, transactionData, portfolioData] = await Promise.all([
        getStockOverview(normalizedSymbol),
        getAsset(normalizedSymbol),
        getStockPosition(normalizedSymbol),
        getStockTransactions(normalizedSymbol),
        getPortfolio(),
      ]);

      if (cancelled) {
        return;
      }

      setOverview(overviewData);
      setAsset(assetData);
      setPosition(positionData);
      setTransactions(transactionData);
      setPortfolio(portfolioData);
    }

    loadStockPage();

    return () => {
      cancelled = true;
    };
  }, [normalizedSymbol]);

  const displayCurrency = overview?.currency || asset?.currency || "USD";
  const displayName = overview?.name || asset?.nameZh || asset?.name || normalizedSymbol;
  const displayExchange = overview?.exchange || asset?.exchange || "--";
  const priceText = formatMoney(overview?.lastPrice, displayCurrency);
  const changeText = formatMoney(overview?.changeAmount, displayCurrency, { signed: true });
  const changePercentText = formatPercent(overview?.changePercent, { digits: 2, signed: true });
  const isNegative = Number(overview?.changeAmount ?? 0) < 0;
  const breadcrumb = overview?.breadcrumb?.length
    ? overview.breadcrumb
    : ["Stocks", normalizedSymbol];
  const marketCapText = formatMoney(overview?.marketCap, displayCurrency, { compact: true, maximumFractionDigits: 1 });
  const peText = overview?.pe !== null && overview?.pe !== undefined ? String(overview.pe) : "--";
  const epsText = overview?.eps !== null && overview?.eps !== undefined ? String(overview.eps) : "--";
  const dividendText = formatPercent(overview?.dividendYield, { digits: 2 });

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
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
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          {breadcrumb.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center gap-2">
              <span>{item}</span>
              {index < breadcrumb.length - 1 && (
                <span className="text-gray-400">›</span>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center">
                <span className="text-3xl">{getInstrumentIcon(normalizedSymbol, asset?.assetType)}</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    {displayName}
                  </h1>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <span>{normalizedSymbol} · {displayExchange}</span>
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
                {priceText}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-lg ${isNegative ? "text-red-500" : "text-emerald-500"}`}>
                  {changeText}
                </span>
                <span className={`text-sm flex items-center gap-1 px-2 py-1 rounded ${
                  isNegative ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                }`}>
                  {isNegative ? "▼" : "▲"} {changePercentText}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <div className="text-center">
                <div className="text-gray-500 mb-1">Market cap</div>
                <div className="text-gray-900 font-medium">{marketCapText}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 mb-1">P/E</div>
                <div className="text-gray-900 font-medium">{peText}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 mb-1">EPS</div>
                <div className="text-gray-900 font-medium">{epsText}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 mb-1">Currency</div>
                <div className="text-gray-900 font-medium">{displayCurrency}</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 mb-1">Dividend yield</div>
                <div className="text-gray-900 font-medium">{dividendText}</div>
              </div>
            </div>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StockChart
              symbol={normalizedSymbol}
              currency={displayCurrency}
              costPerShare={position?.avgCost ?? null}
            />

            <MyPositions
              position={position}
              portfolio={portfolio}
              currency={displayCurrency}
            />

            <TransactionsTable
              transactions={transactions}
              currency={displayCurrency}
            />

            <AboutCompany asset={asset} />
          </div>

          <div className="lg:col-span-1">
            <StockSidebar overview={overview} asset={asset} />
          </div>
        </div>
      </main>
    </div>
  );
}
