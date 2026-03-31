import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { SecondaryNav } from "../components/SecondaryNav";
import { AnalysisStatsCards } from "../components/AnalysisStatsCards";
import { HoldingsTable } from "../components/HoldingsTable";
import { AssetAllocationChart } from "../components/AssetAllocationChart";
import { getDashboardSummary, getPositions } from "../lib/api";
import { formatMoney } from "../lib/formatters";
import type { DashboardSummaryResponse, PositionResponse } from "../lib/types";

export function AnalysisPage() {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [positions, setPositions] = useState<PositionResponse[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalysis() {
      const [summaryData, positionsData] = await Promise.all([
        getDashboardSummary(),
        getPositions(),
      ]);

      if (cancelled) {
        return;
      }

      setSummary(summaryData);
      setPositions(positionsData);
    }

    loadAnalysis();

    return () => {
      cancelled = true;
    };
  }, []);

  const cashLabel = formatMoney(summary?.cash, summary?.baseCurrency ?? "CNY");

  return (
    <main className="max-w-[1440px] mx-auto px-8 py-6">
      <SecondaryNav />

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
