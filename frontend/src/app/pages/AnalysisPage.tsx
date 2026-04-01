import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { AnalysisStatsCards } from "../components/AnalysisStatsCards";
import { HoldingsTable } from "../components/HoldingsTable";
import { AssetAllocationChart } from "../components/AssetAllocationChart";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { getDashboardSummary, getPositions } from "../lib/api";
import { formatMoney } from "../lib/formatters";
import type { DashboardSummaryResponse, PositionResponse } from "../lib/types";

export function AnalysisPage() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [positions, setPositions] = useState<PositionResponse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalysis() {
      setIsLoading(true);
      try {
        const [summaryData, positionsData] = await Promise.all([
          getDashboardSummary(),
          getPositions(),
        ]);

        if (cancelled) return;

        setSummary(summaryData);
        setPositions(positionsData);
      } catch (error) {
        console.error("Failed to load analysis page data:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, []);

  const cashLabel = formatMoney(summary?.cash, summary?.baseCurrency ?? "CNY");

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-6">
      {isLoading && <LoadingSpinner message="正在深度分析您的资产构成..." />}
      
      <AnalysisStatsCards summary={summary} />

      <div className="mt-6 flex items-center gap-2 text-gray-600">
        <ChevronRight className="w-4 h-4" />
        <span className="text-sm">现金：{cashLabel}</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">
        <HoldingsTable positions={positions} baseCurrency={summary?.baseCurrency} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">
        <AssetAllocationChart positions={positions} />
      </div>
    </main>
  );
}
