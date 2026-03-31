import { useState } from "react";
import { X, DollarSign, Wallet } from "lucide-react";
import { rechargeWallet } from "../lib/api";

interface RechargeModalProps {
  currentBalance: string | number;
  currency?: string;
  onClose: () => void;
  onSuccess: () => void;
}

function getCurrencySymbol(currency?: string) {
  if (currency === "USD") {
    return "$";
  }
  return "¥";
}

export function RechargeModal({ currentBalance, currency = "USD", onClose, onSuccess }: RechargeModalProps) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const currencySymbol = getCurrencySymbol(currency);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const numAmount = parseFloat(amount);
    
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage("请输入大于 0 的有效金额");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      await rechargeWallet(numAmount);
      onSuccess();
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "充值失败");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Wallet className="text-blue-500 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">钱包充值</h2>
              <p className="text-sm text-gray-500">当前余额：{currencySymbol}{currentBalance}</p>
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
              <DollarSign className="w-4 h-4 text-gray-500" />
              充值金额
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                {currencySymbol}
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0.01"
                step="0.01"
                required
                autoFocus
              />
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3 pt-2">
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
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {submitting ? "提交中..." : "确认充值"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
