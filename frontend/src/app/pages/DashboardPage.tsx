import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { StatsCards } from "../components/StatsCards";
import { PortfolioChart } from "../components/PortfolioChart";
import { PortfolioTable } from "../components/PortfolioTable";
import { MarketMovers } from "../components/MarketMovers";
import { getDashboardAllocation, getDashboardSummary, getMarketMovers } from "../lib/api";
import type { AllocationItemResponse, DashboardSummaryResponse, MarketMoverResponse } from "../lib/types";

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [allocation, setAllocation] = useState<AllocationItemResponse[] | null>(null);
  const [movers, setMovers] = useState<MarketMoverResponse[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      const [summaryData, allocationData, moversData] = await Promise.all([
        getDashboardSummary(),
        getDashboardAllocation(),
        getMarketMovers(8),
      ]);

      if (cancelled) {
        return;
      }

      setSummary(summaryData);
      setAllocation(allocationData);
      setMovers(moversData);
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl text-gray-900">演示作品集</h1>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <StatsCards summary={summary} />

      <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl text-gray-900">作品集</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <PortfolioChart items={allocation} baseCurrency={summary?.baseCurrency} />
          <PortfolioTable items={allocation} baseCurrency={summary?.baseCurrency} />
        </div>
      </div>

      <MarketMovers movers={movers} />
    </main>
  );
}
