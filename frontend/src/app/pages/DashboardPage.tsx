import { StatsCards } from "../components/StatsCards";
import { PortfolioChart } from "../components/PortfolioChart";
import { PortfolioTable } from "../components/PortfolioTable";
import { MarketMovers } from "../components/MarketMovers";
import { MoreVertical } from "lucide-react";

export function DashboardPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-8 py-6">
      {/* Title Section */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl text-gray-900">演示作品集</h1>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Portfolio Section */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl text-gray-900">作品集</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <PortfolioChart />
          <PortfolioTable />
        </div>
      </div>

      {/* Market Movers Section */}
      <MarketMovers />
    </main>
  );
}