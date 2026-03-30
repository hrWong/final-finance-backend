import { useState } from "react";
import { X, Calendar, DollarSign, Hash, FileText, Calculator } from "lucide-react";

interface BuyModalProps {
  stock: {
    name: string;
    ticker: string;
    icon: string;
    currentPrice: string;
  };
  onClose: () => void;
}

export function BuyModal({ stock, onClose }: BuyModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    shares: "",
    price: stock.currentPrice.replace("¥", "").replace(",", ""),
    commission: "0",
    tax: "0",
    note: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const shares = parseFloat(formData.shares) || 0;
    const price = parseFloat(formData.price) || 0;
    const commission = parseFloat(formData.commission) || 0;
    const tax = parseFloat(formData.tax) || 0;
    return (shares * price + commission + tax).toFixed(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle the purchase transaction
    console.log("Purchase data:", {
      stock: stock.ticker,
      ...formData,
      total: calculateTotal(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">{stock.icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">买入 {stock.name}</h2>
              <p className="text-sm text-gray-500">{stock.ticker}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              交易日期
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Shares */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 text-gray-500" />
              购买数量
            </label>
            <input
              type="number"
              value={formData.shares}
              onChange={(e) => handleInputChange("shares", e.target.value)}
              placeholder="输入购买的股数"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="1"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              购买价格（每股）
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ¥
              </span>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              当前市场价格: {stock.currentPrice}
            </p>
          </div>

          {/* Fees Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Commission */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                手续费
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ¥
                </span>
                <input
                  type="number"
                  value={formData.commission}
                  onChange={(e) => handleInputChange("commission", e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Tax */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                税费
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ¥
                </span>
                <input
                  type="number"
                  value={formData.tax}
                  onChange={(e) => handleInputChange("tax", e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-gray-500" />
              备注（可选）
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              placeholder="添加交易备注..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Total Calculation */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calculator className="w-4 h-4 text-blue-500" />
                交易总额
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>股票成本:</span>
                <span>
                  ¥
                  {(
                    (parseFloat(formData.shares) || 0) *
                    (parseFloat(formData.price) || 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>手续费:</span>
                <span>¥{parseFloat(formData.commission || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>税费:</span>
                <span>¥{parseFloat(formData.tax || "0").toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-blue-200 flex justify-between text-lg font-semibold text-gray-900">
                <span>总计:</span>
                <span className="text-blue-600">¥{calculateTotal()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              确认买入
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
