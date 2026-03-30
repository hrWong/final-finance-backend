import { TrendingUp, TrendingDown, HelpCircle } from "lucide-react";

export function AnalysisStatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1 - 价值 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-gray-600 text-sm">价值</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-1" />
        </div>
        <div className="text-3xl font-semibold text-gray-900 mb-1">
          ¥1,232,150.76
        </div>
        <div className="text-sm text-gray-400 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>投资¥835,960.16</span>
        </div>
      </div>

      {/* Card 2 - 总利润 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[#22D3EE] rounded-full"></div>
          <span className="text-gray-600 text-sm">总利润</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-1" />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl font-semibold text-gray-900">
            +¥563,227.56
          </span>
          <span className="text-emerald-500 text-sm flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            67.4%
          </span>
        </div>
        <div className="text-sm flex items-center gap-2">
          <span className="text-red-500">-¥10,404.98</span>
          <span className="text-red-500 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            0.84%
          </span>
          <span className="text-gray-500">每日</span>
        </div>
      </div>

      {/* Card 3 - 国际反应规则 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[#A78BFA] rounded-full"></div>
          <span className="text-gray-600 text-sm">国际反应规则</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-1" />
        </div>
        <div className="text-3xl font-semibold text-gray-900 mb-1">11.8%</div>
        <div className="text-sm text-gray-500">8.1% 现有持仓</div>
      </div>

      {/* Card 4 - 被动收入 */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-[#22D3EE] rounded-full"></div>
          <span className="text-gray-600 text-sm">被动收入</span>
          <HelpCircle className="w-4 h-4 text-gray-400 ml-1" />
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-3xl font-semibold text-gray-900">2.52%</span>
          <span className="text-emerald-500 text-sm flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            3.9%
          </span>
        </div>
        <div className="text-sm text-gray-500">每年27,990.36日元</div>
      </div>
    </div>
  );
}