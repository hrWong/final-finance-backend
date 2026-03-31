import type { AssetResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";

interface AboutCompanyProps {
  asset?: AssetResponse | null;
}

export function AboutCompany({ asset }: AboutCompanyProps) {
  if (!asset || (!asset.symbol && !asset.name && !asset.nameZh)) {
    return (
      <EmptyState
        title="暂无公司资料"
        description="后端资产详情接口当前没有返回该标的的基础信息。"
      />
    );
  }

  const displayName = asset.nameZh || asset.name || asset.symbol;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">About the company</h3>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
        <div>
          <div className="text-sm text-gray-600 mb-1">Ticker</div>
          <div className="text-sm text-gray-900">{asset.symbol}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Country</div>
          <div className="text-sm text-blue-600">{asset.country || "--"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">ISIN</div>
          <div className="text-sm text-gray-900">{asset.isin || "--"}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Sector (GICS)</div>
          <div className="text-sm text-blue-600">{asset.sector || "--"}</div>
        </div>
      </div>

      <div className="text-sm text-gray-700 leading-relaxed">
        <p className="mb-4">
          名称：{displayName}
        </p>
        <p>
          资产类型：{asset.assetType || "--"}，交易所：{asset.exchange || "--"}，行业：{asset.industry || "--"}，交易货币：{asset.currency || "--"}。
        </p>
      </div>
    </div>
  );
}
