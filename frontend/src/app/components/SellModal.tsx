import { useState } from "react";
import { X, Calendar, DollarSign, Hash, FileText, Calculator } from "lucide-react";
import { createTransaction } from "../lib/api";

interface SellModalProps {
  stock: {
    name: string;
    ticker: string;
    icon: string;
    currentPrice: string;
    currency?: string;
  };
  maxShares: number;
  onClose: () => void;
}

function getCurrencySymbol(currency?: string) {
  if (currency === "USD") {
    return "$";
  }
  return "¥";
}

function extractNumericValue(value: string) {
  return value.replace(/[^\d.]/g, "");
}

export function SellModal({ stock, maxShares, onClose }: SellModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    shares: "",
    price: extractNumericValue(stock.currentPrice) || "0.00",
    commission: "0",
    tax: "0",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const currency = stock.currency || "USD";
  const currencySymbol = getCurrencySymbol(currency);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    const shares = parseFloat(formData.shares) || 0;
    const price = parseFloat(formData.price) || 0;
    const commission = parseFloat(formData.commission) || 0;
    const tax = parseFloat(formData.tax) || 0;
    return (shares * price - commission - tax).toFixed(2);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (parseFloat(formData.shares) > maxShares) {
      setErrorMessage(`卖出数量不能超过可用持仓 (${maxShares}股)`);
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await createTransaction({
        symbol: stock.ticker,
        type: "SELL",
        tradeDate: formData.date,
        quantity: Number(formData.shares),
        price: Number(formData.price),
        commission: Number(formData.commission),
        tax: Number(formData.tax),
        currency,
        note: formData.note || undefined,
      });
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "提交交易失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto w-full">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-xl">{stock.icon}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">卖出 {stock.name}</h2>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              交易日期
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(event) => handleInputChange("date", event.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Hash className="w-4 h-4 text-gray-500" />
              卖出数量 (最大: {maxShares})
            </label>
            <input
              type="number"
              value={formData.shares}
              onChange={(event) => handleInputChange("shares", event.target.value)}
              placeholder="输入卖出的股数"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max={maxShares}
              step="1"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              卖出价格（每股）
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={formData.price}
                readOnly
                className="w-full pl-8 pr-4 py-2.5 border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed rounded-lg text-sm focus:outline-none"
                min="0"
                step="0.01"
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              当前市场价格: {stock.currentPrice}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                手续费
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={formData.commission}
                  onChange={(event) => handleInputChange("commission", event.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                税费
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={formData.tax}
                  onChange={(event) => handleInputChange("tax", event.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-gray-500" />
              备注（可选）
            </label>
            <textarea
              value={formData.note}
              onChange={(event) => handleInputChange("note", event.target.value)}
              placeholder="添加交易备注..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calculator className="w-4 h-4 text-blue-500" />
                交易总额预计
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>卖出收入:</span>
                <span>
                  {currencySymbol}
                  {(
                    (parseFloat(formData.shares) || 0) *
                    (parseFloat(formData.price) || 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>手续费:</span>
                <span>-{currencySymbol}{parseFloat(formData.commission || "0").toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>税费:</span>
                <span>-{currencySymbol}{parseFloat(formData.tax || "0").toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-blue-200 flex justify-between text-lg font-semibold text-gray-900">
                <span>预计净收入:</span>
                <span className="text-blue-600">{currencySymbol}{calculateTotal()}</span>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

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
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:bg-red-300"
            >
              {submitting ? "提交中..." : "确认卖出"}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
