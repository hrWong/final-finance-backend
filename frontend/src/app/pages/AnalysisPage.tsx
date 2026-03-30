import { SecondaryNav } from "../components/SecondaryNav";
import { AnalysisStatsCards } from "../components/AnalysisStatsCards";
import { HoldingsTable } from "../components/HoldingsTable";
import { AssetAllocationChart } from "../components/AssetAllocationChart";
import { ChevronRight } from "lucide-react";

export function AnalysisPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-8 py-6">
      {/* Secondary Navigation */}
      <SecondaryNav />

      {/* Stats Cards */}
      <AnalysisStatsCards />

      {/* Cash Section */}
      <div className="mt-6 flex items-center gap-2 text-gray-600">
        <ChevronRight className="w-4 h-4" />
        <span className="text-sm">现金：¥120,273.34</span>
      </div>

      {/* Holdings Table */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">
        <HoldingsTable />
      </div>

      {/* Asset Allocation Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">
        <AssetAllocationChart />
      </div>
    </main>
  );
}
