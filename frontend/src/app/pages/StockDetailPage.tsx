import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { Star, Plus, Share2, ChevronDown } from "lucide-react";
import { StockChart } from "../components/StockChart";
import { InstrumentIcon } from "../components/InstrumentIcon";
import { StockSidebar } from "../components/StockSidebar";
import { MyPositions } from "../components/MyPositions";
import { TransactionsTable } from "../components/TransactionsTable";
import { AboutCompany } from "../components/AboutCompany";
import { BuyModal } from "../components/BuyModal";
import { SellModal } from "../components/SellModal";
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
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);

  const loadStockPage = useCallback(async () => {
    const [overviewData, assetData, positionData, transactionData, portfolioData] = await Promise.all([
      getStockOverview(normalizedSymbol),
      getAsset(normalizedSymbol),
      getStockPosition(normalizedSymbol),
      getStockTransactions(normalizedSymbol),
      getPortfolio(),
    ]);

    setOverview(overviewData);
    setAsset(assetData);
    setPosition(positionData);
    setTransactions(transactionData);
    setPortfolio(portfolioData);
  }, [normalizedSymbol]);

  useEffect(() => {
    loadStockPage();
  }, [loadStockPage]);

  const displayCurrency = overview?.currency || asset?.currency || "USD";
  const displayName = overview?.name || asset?.nameZh || asset?.name || normalizedSymbol;
  const displayExchange = overview?.exchange || asset?.exchange || "--";
  const displayIconUrl = asset?.iconUrl || overview?.iconUrl;
  const priceText = formatMoney(overview?.lastPrice, displayCurrency);
  const changeText = formatMoney(overview?.changeAmount, displayCurrency, { signed: true });
  const changePercentText = formatPercent(overview?.changePercent, { digits: 2, signed: true });
  const isNegative = Number(overview?.changeAmount ?? 0) < 0;
  const breadcrumb = (
    overview?.breadcrumb?.length ? overview.breadcrumb : [normalizedSymbol]
  ).filter((item: string) => item.toLowerCase() !== "stocks");
  const marketCapText = formatMoney(overview?.marketCap, displayCurrency, { compact: true, maximumFractionDigits: 1 });
  const peText = overview?.pe !== null && overview?.pe !== undefined ? String(overview.pe) : "--";
  const epsText = overview?.eps !== null && overview?.eps !== undefined ? String(overview.eps) : "--";
  const dividendText = formatPercent(overview?.dividendYield, { digits: 2 });

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
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
              <InstrumentIcon
                alt={`${displayName} icon`}
                fallback={getInstrumentIcon(normalizedSymbol, asset?.assetType)}
                iconUrl={displayIconUrl}
                containerClassName="w-14 h-14 bg-black rounded-xl flex items-center justify-center overflow-hidden"
                imageClassName="w-9 h-9 rounded-lg bg-white object-contain p-1"
                fallbackClassName="text-3xl"
              />
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
                <span className={`text-sm flex items-center gap-1 px-2 py-1 rounded ${isNegative ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
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


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 relative h-[600px] lg:h-auto">
            <div className="lg:absolute lg:inset-0 flex flex-col w-full h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#f8f9fa]">
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

            <div className="border-t border-gray-200 bg-white p-4 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setShowBuyModal(true)}
                className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                买入
              </button>
              <button
                onClick={() => setShowSellModal(true)}
                disabled={!position || (position.quantity ?? 0) <= 0}
                className="px-8 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                卖出
              </button>
            </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <StockSidebar overview={overview} asset={asset} />
          </div>
        </div>
      </main>
      {showBuyModal && (
        <BuyModal
          stock={{
            name: displayName,
            ticker: normalizedSymbol,
            icon: getInstrumentIcon(normalizedSymbol, asset?.assetType) || "📈",
            currentPrice: overview?.lastPrice?.toString() || "0",
            currency: displayCurrency,
          }}
          onClose={() => setShowBuyModal(false)}
          onSuccess={loadStockPage}
        />
      )}

      {showSellModal && (
        <SellModal
          stock={{
            name: displayName,
            ticker: normalizedSymbol,
            icon: getInstrumentIcon(normalizedSymbol, asset?.assetType) || "📈",
            currentPrice: overview?.lastPrice?.toString() || "0",
            currency: displayCurrency,
          }}
          maxShares={position?.quantity ?? 0}
          onClose={() => setShowSellModal(false)}
          onSuccess={loadStockPage}
        />
      )}
    </div>
  );
}
