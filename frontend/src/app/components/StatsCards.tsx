import { TrendingUp, TrendingDown, HelpCircle, Wallet } from "lucide-react";
import { formatMoney, formatPercent } from "../lib/formatters";
import type { DashboardSummaryResponse } from "../lib/types";

interface StatsCardsProps {
  summary?: DashboardSummaryResponse | null;
  onRecharge?: () => void;
}

export function StatsCards({ summary, onRecharge }: StatsCardsProps) {
  const baseCurrency = summary?.baseCurrency ?? "CNY";
  const totalPnlPositive = Number(summary?.totalPnl ?? 0) >= 0;
  const dailyPnlPositive = Number(summary?.dailyPnl ?? 0) >= 0;
  const hasDailyPnl = summary?.dailyPnl !== null && summary?.dailyPnl !== undefined
    && summary?.dailyPnlPct !== null && summary?.dailyPnlPct !== undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: 价值与利润 */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
        <div className="flex items-center gap-3 mb-5 relative z-10">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
             <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          </div>
          <span className="text-gray-600 text-sm font-semibold tracking-wide">价值 & 总利润</span>
        </div>
        <div className="relative z-10">
          <div className="text-3xl lg:text-[2rem] font-bold tracking-tight text-gray-900 mb-2 font-sans truncate">
            {formatMoney(summary?.totalValue, baseCurrency)}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-1.5 mb-6">
            <span>投资成本 {formatMoney(summary?.investedAmount, baseCurrency)}</span>
          </div>
        </div>

        <div className="relative z-10 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wider">总利润</div>
              <div className="flex items-center gap-2">
                <span className={`text-xl tracking-tight font-bold ${totalPnlPositive ? "text-emerald-500" : "text-rose-500"}`}>
                  {formatMoney(summary?.totalPnl, baseCurrency, { signed: true })}
                </span>
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-medium ${totalPnlPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                  {totalPnlPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {formatPercent(summary?.totalPnlPct, { digits: 2, signed: true })}
                </span>
              </div>
              <div className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                 {hasDailyPnl ? (
                    <>今日 <span className={dailyPnlPositive ? "text-emerald-500" : "text-rose-500"}>{formatMoney(summary?.dailyPnl, baseCurrency, { signed: true })}</span></>
                 ) : (
                    <>按收盘价口径计算</>
                 )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Curve */}
        <div className="absolute left-0 bottom-0 w-full h-full pointer-events-none opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 overflow-hidden rounded-[24px] z-0">
          <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="absolute bottom-0 w-[120%] h-32 -left-4">
            <path d="M0,150 L0,50 Q100,0 200,50 T400,50 L400,150 Z" fill="#3B82F6" />
          </svg>
        </div>
      </div>

      {/* Card 2: 累计收益 */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
        <div className="flex items-center gap-3 mb-5 relative z-10">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
             <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
          <span className="text-gray-600 text-sm font-semibold tracking-wide">累计收益</span>
        </div>
        <div className="text-3xl lg:text-[2rem] font-bold tracking-tight mb-2 font-sans truncate relative z-10">
          <span className={`${Number(summary?.cumulativePnl ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {formatMoney(summary?.cumulativePnl, baseCurrency, { signed: true })}
          </span>
        </div>
        <div className="mt-auto pt-4 text-xs text-gray-400 flex items-center gap-1.5 font-medium relative z-10">
          <HelpCircle className="w-4 h-4 text-gray-300" />
          包含已落袋为安的历史所有收益
        </div>
        
        {/* Trend Line Background */}
        <div className="absolute left-0 bottom-0 w-full h-full pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-500 overflow-hidden rounded-[24px] z-0">
          <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="absolute bottom-0 w-full h-24">
            <path d={Number(summary?.cumulativePnl ?? 0) >= 0 ? "M0,150 L0,80 Q100,50 200,70 T400,40 L400,150 Z" : "M0,150 L0,40 Q100,90 200,50 T400,80 L400,150 Z"} fill={Number(summary?.cumulativePnl ?? 0) >= 0 ? "url(#grad-emerald)" : "url(#grad-rose)"} />
            <path d={Number(summary?.cumulativePnl ?? 0) >= 0 ? "M0,80 Q100,50 200,70 T400,40" : "M0,40 Q100,90 200,50 T400,80"} fill="none" stroke={Number(summary?.cumulativePnl ?? 0) >= 0 ? "#10B981" : "#F43F5E"} strokeWidth="3" vectorEffect="non-scaling-stroke" />
            <defs>
              <linearGradient id="grad-emerald" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="grad-rose" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Card 3: 持有回报率 */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
        <div className="flex items-center gap-3 mb-5 relative z-10">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
             <div className="w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
          </div>
          <span className="text-gray-600 text-sm font-semibold tracking-wide">持有回报率</span>
        </div>
        <div className="text-3xl lg:text-[2rem] font-bold tracking-tight text-gray-900 mb-2 font-sans truncate relative z-10">
          {formatPercent(summary?.totalPnlPct, { digits: 2, signed: true })}
        </div>
        <div className="mt-auto pt-4 text-xs text-gray-400 flex items-center gap-1.5 font-medium relative z-10">
          <div className="w-4 h-4 rounded bg-gray-100 flex items-center justify-center text-[9px] text-gray-500 font-bold">
            {summary?.baseCurrency?.substring(0, 1) || "$"}
          </div>
          以 {summary?.baseCurrency || "USD"} 计价
        </div>
        
        {/* Step Chart Background */}
        <div className="absolute left-0 bottom-0 w-full h-full pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-500 overflow-hidden rounded-[24px] z-0">
          <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="absolute bottom-0 w-full h-24">
            <path d="M0,150 L0,90 L60,90 L60,60 L130,60 L130,100 L210,100 L210,40 L300,40 L300,70 L400,70 L400,150 Z" fill="url(#grad-purple)" />
            <polyline points="0,90 60,90 60,60 130,60 130,100 210,100 210,40 300,40 300,70 400,70" fill="none" stroke="#A855F7" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <defs>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Card 4: 余额 */}
      <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-[24px] p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] group">
        <div className="flex items-center gap-3 mb-5 relative z-10">
          <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors">
             <Wallet className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-gray-600 text-sm font-semibold tracking-wide">余额</span>
        </div>
        <div className="text-3xl lg:text-[2rem] font-bold tracking-tight text-gray-900 mb-2 font-sans truncate relative z-10">
          {formatMoney(summary?.cash, baseCurrency)}
        </div>
        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-sm font-medium relative z-10">
          {onRecharge ? (
            <button onClick={onRecharge} className="text-blue-600 hover:text-blue-700 transition-colors">
              立即充值 &rarr;
            </button>
          ) : (
             <span className="text-gray-400 flex items-center gap-1.5 text-xs"><Wallet className="w-4 h-4 text-gray-300" /> 用于购买资产的现金账户</span>
          )}
        </div>
        
        {/* Soft Sky Wave */}
        <div className="absolute left-0 bottom-0 w-full h-full pointer-events-none opacity-[0.15] group-hover:opacity-25 transition-opacity duration-500 overflow-hidden rounded-[24px] z-0">
          <svg viewBox="0 0 400 150" preserveAspectRatio="none" className="absolute bottom-0 w-[150%] h-32 -left-12">
            <path d="M0,150 L0,70 Q100,130 200,60 T400,90 L400,150 Z" fill="url(#grad-sky)" />
            <defs>
              <linearGradient id="grad-sky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
