import { TrendingUp, TrendingDown, ChevronDown, Search, Maximize2, MoreHorizontal } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

const holdings = [
  {
    name: "苹果公司",
    ticker: "AAPL",
    symbol: "AAPL",
    icon: "🍎",
    shares: 100,
    costBasis: "¥70,972.61",
    costBasisPerShare: "¥709.73",
    currentValue: "¥171,943.19",
    currentPrice: "¥7.19",
    price: "¥718.73",
    pricePerShare: "¥7.19",
    change: "0.42%",
    changePerShare: "1.01%",
    gain5Year: "3.75%",
    totalAllocation: "13.95%",
    portfolioAllocation: "4.85%",
    changePositive: true,
    gain5YearPositive: true,
  },
  {
    name: "1911年黄金公司",
    ticker: "AUMRF",
    symbol: "AUMRF",
    icon: "💰",
    shares: 1,
    costBasis: "¥4.51",
    costBasisPerShare: "¥4.512818",
    currentValue: "¥4.51",
    currentPrice: "¥4.512818",
    price: "¥0.00",
    pricePerShare: "¥0.00",
    change: "0%",
    changePerShare: "0%",
    gain5Year: "0%",
    totalAllocation: "",
    portfolioAllocation: "0%",
    changePositive: false,
    gain5YearPositive: false,
    showRedGain: true,
    redGainValue: "¥13.82",
    redGainPercent: "306.28%",
  },
  {
    name: "好市多批发公司",
    ticker: "住流",
    symbol: "COST",
    icon: "🏪",
    shares: 20,
    costBasis: "¥45,495.42",
    costBasisPerShare: "¥2,274.71",
    currentValue: "¥135,987.16",
    currentPrice: "¥6,798.36",
    price: "¥718.73",
    pricePerShare: "¥35.94",
    change: "0.53%",
    changePerShare: "1.58%",
    gain5Year: "11.12%",
    totalAllocation: "11.04%",
    portfolioAllocation: "4.85%",
    changePositive: true,
    gain5YearPositive: true,
    greenGainValue: "+¥96,308.55",
    greenGainPercent: "211.69%",
  },
  {
    name: "金源",
    ticker: "卫生医疗",
    symbol: "WELL",
    icon: "🏥",
    shares: 5,
    costBasis: "¥69,386.35",
    costBasisPerShare: "¥13,877.27",
    currentValue: "¥156,950.09",
    currentPrice: "¥31,390.00",
    price: "¥0.00",
    pricePerShare: "¥0.00",
    change: "0%",
    changePerShare: "0%",
    gain5Year: "0%",
    totalAllocation: "12.74%",
    portfolioAllocation: "10%",
    changePositive: false,
    gain5YearPositive: false,
    greenGainValue: "+¥87,563.65",
    greenGainPercent: "126.2%",
  },
  {
    name: "家得宝公司",
    ticker: "家清",
    symbol: "HD",
    icon: "🏠",
    shares: 40,
    costBasis: "¥74,208.70",
    costBasisPerShare: "¥1,855.22",
    currentValue: "¥88,915.64",
    currentPrice: "¥2,222.89",
    price: "¥2,576.38",
    pricePerShare: "¥64.41",
    change: "2.9%",
    changePerShare: "3.47%",
    gain5Year: "7.15%",
    totalAllocation: "7.22%",
    portfolioAllocation: "4.95%",
    changePositive: true,
    gain5YearPositive: true,
    greenGainValue: "+¥26,203.76",
    greenGainPercent: "35.32%",
  },
  {
    name: "皮斯大洛梅案法律医医ETF",
    ticker: "医医",
    symbol: "VYM",
    icon: "📊",
    shares: 500,
    costBasis: "¥185,948.02",
    costBasisPerShare: "¥371.90",
    currentValue: "¥191,950.25",
    currentPrice: "¥383.90",
    price: "¥16,455.61",
    pricePerShare: "¥32.91",
    change: "8.57%",
    changePerShare: "8.85%",
    gain5Year: "5.14%",
    totalAllocation: "15.58%",
    portfolioAllocation: "7%",
    changePositive: true,
    gain5YearPositive: true,
    greenGainValue: "+¥31,402.43",
    greenGainPercent: "49.15%",
  },
  {
    name: "Netflix公司",
    ticker: "NTLX",
    symbol: "NFLX",
    icon: "🎬",
    shares: 100,
    costBasis: "¥34,162.45",
    costBasisPerShare: "¥341.62",
    currentValue: "¥64,568.54",
    currentPrice: "¥645.69",
    price: "¥0.00",
    pricePerShare: "¥0.00",
    change: "0%",
    changePerShare: "0%",
    gain5Year: "0%",
    totalAllocation: "5.24%",
    portfolioAllocation: "4.95%",
    changePositive: false,
    gain5YearPositive: false,
    greenGainValue: "+¥30,399.11",
    greenGainPercent: "88.98%",
  },
];

export function HoldingsTable() {
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<typeof holdings[0] | null>(null);
  const [sellShares, setSellShares] = useState("");

  const handleSellClick = (e: React.MouseEvent, holding: typeof holdings[0]) => {
    e.stopPropagation();
    setSelectedHolding(holding);
    setSellModalOpen(true);
    setSellShares("");
  };

  const handleSellConfirm = () => {
    // 处理卖出逻辑
    console.log(`卖出 ${sellShares} 股 ${selectedHolding?.name}`);
    setSellModalOpen(false);
    setSelectedHolding(null);
    setSellShares("");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg text-gray-900">我的资产</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm text-gray-600 hover:text-gray-900">
            节目锦囊
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="搜索...."
              className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <Maximize2 className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-3 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-1">
                  舞译
                  <ChevronDown className="w-4 h-4" />
                </div>
              </th>
              <th className="text-center pb-3 text-sm font-medium text-gray-600 px-2"></th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                成本基础
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                当前价值
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                价格
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                改变
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                配置规模（5年）
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                分穿作总盘
              </th>
              <th className="text-center pb-3 text-sm font-medium text-gray-600 px-4">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/stock/${holding.symbol}`}>
                {/* Name Column */}
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">{holding.icon}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {holding.name}
                      </div>
                      <div className="text-xs text-gray-500">{holding.ticker}</div>
                    </div>
                  </div>
                </td>

                {/* Shares */}
                <td className="text-center text-gray-900 text-sm px-2">
                  {holding.shares}
                </td>

                {/* Cost Basis */}
                <td className="text-right px-4">
                  <div className="text-sm text-gray-900">{holding.costBasis}</div>
                  <div className="text-xs text-gray-500">
                    {holding.costBasisPerShare}
                  </div>
                </td>

                {/* Current Value */}
                <td className="text-right px-4">
                  <div className="text-sm text-gray-900">{holding.currentValue}</div>
                  <div className="text-xs text-gray-500">{holding.currentPrice}</div>
                </td>

                {/* Price */}
                <td className="text-right px-4">
                  <div className="text-sm text-gray-900">{holding.price}</div>
                  <div className="text-xs text-gray-500">{holding.pricePerShare}</div>
                </td>

                {/* Change */}
                <td className="text-right px-4">
                  <div
                    className={`text-sm ${
                      holding.changePositive ? "text-emerald-500" : "text-gray-900"
                    }`}
                  >
                    {holding.change}
                  </div>
                  <div
                    className={`text-xs ${
                      holding.changePositive ? "text-emerald-500" : "text-gray-500"
                    }`}
                  >
                    {holding.changePerShare}
                  </div>
                </td>

                {/* 5-Year Gain */}
                <td className="text-right px-4">
                  {holding.showRedGain ? (
                    <>
                      <div className="text-sm text-red-500 flex items-center justify-end gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {holding.redGainValue}
                      </div>
                      <div className="text-xs text-red-500 flex items-center justify-end gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {holding.redGainPercent}
                      </div>
                    </>
                  ) : holding.greenGainValue ? (
                    <>
                      <div className="text-sm text-emerald-500 flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {holding.greenGainValue}
                      </div>
                      <div className="text-xs text-emerald-500 flex items-center justify-end gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {holding.greenGainPercent}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={`text-sm ${
                          holding.gain5YearPositive
                            ? "text-emerald-500"
                            : "text-gray-900"
                        }`}
                      >
                        {holding.gain5Year}
                      </div>
                    </>
                  )}
                </td>

                {/* Allocation */}
                <td className="text-right px-4">
                  <div className="text-sm text-gray-900">
                    {holding.totalAllocation}
                  </div>
                  <div className="text-xs text-gray-500">
                    {holding.portfolioAllocation}
                  </div>
                </td>

                {/* Actions */}
                <td className="text-center px-4">
                  <button
                    onClick={(e) => handleSellClick(e, holding)}
                    className="px-4 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    卖出
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sell Modal */}
      {sellModalOpen && selectedHolding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              卖出 {selectedHolding.name}
            </h3>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{selectedHolding.icon}</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{selectedHolding.name}</div>
                  <div className="text-sm text-gray-500">{selectedHolding.ticker}</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">持有数量：</span>
                  <span className="text-gray-900 font-medium">{selectedHolding.shares} 股</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">当前价格：</span>
                  <span className="text-gray-900 font-medium">{selectedHolding.currentPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">当前价值：</span>
                  <span className="text-gray-900 font-medium">{selectedHolding.currentValue}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  卖出数量
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedHolding.shares}
                  value={sellShares}
                  onChange={(e) => setSellShares(e.target.value)}
                  placeholder={`最多 ${selectedHolding.shares} 股`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {sellShares && parseInt(sellShares) > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">预计卖出价值：</span>
                    <span className="text-gray-900 font-medium">
                      ¥{(parseFloat(selectedHolding.currentPrice.replace(/[¥,]/g, "")) * parseInt(sellShares)).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSellModalOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSellConfirm}
                disabled={!sellShares || parseInt(sellShares) <= 0 || parseInt(sellShares) > selectedHolding.shares}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                确认卖出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}