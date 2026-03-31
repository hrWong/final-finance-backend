import { formatMoney, formatPercent } from "../lib/formatters";
import type { AssetResponse, StockOverviewResponse } from "../lib/types";

interface StockSidebarProps {
  overview?: StockOverviewResponse | null;
  asset?: AssetResponse | null;
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  );
}

export function StockSidebar({ overview, asset }: StockSidebarProps) {
  const currency = overview?.currency || asset?.currency || "USD";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Estimate</h3>
        <div className="space-y-3">
          <MetricRow label="P/E" value={overview?.pe !== null && overview?.pe !== undefined ? String(overview.pe) : "--"} />
          <MetricRow label="EPS" value={overview?.eps !== null && overview?.eps !== undefined ? String(overview.eps) : "--"} />
          <MetricRow label="Exchange" value={overview?.exchange || asset?.exchange || "--"} />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Market</h3>
        <div className="space-y-3">
          <MetricRow label="Currency" value={currency} />
          <MetricRow label="Last price" value={formatMoney(overview?.lastPrice, currency)} />
          <MetricRow label="Market cap" value={formatMoney(overview?.marketCap, currency, { compact: true, maximumFractionDigits: 1 })} />
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Profile</h3>
        <div className="space-y-3">
          <MetricRow label="Country" value={asset?.country || "--"} />
          <MetricRow label="Sector" value={asset?.sector || "--"} />
          <MetricRow label="Industry" value={asset?.industry || "--"} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Dividends</h3>
        <div className="space-y-3">
          <MetricRow label="Dividend yield" value={formatPercent(overview?.dividendYield, { digits: 2 })} />
          <MetricRow label="ISIN" value={asset?.isin || "--"} />
          <MetricRow label="Status" value={asset?.status || "--"} />
        </div>
      </div>
    </div>
  );
}
