import { formatDate, formatMoney, formatNumber } from "../lib/formatters";
import type { TransactionResponse } from "../lib/types";
import { EmptyState } from "./EmptyState";

interface TransactionsTableProps {
  transactions?: TransactionResponse[] | null;
  currency?: string | null;
}

export function TransactionsTable({ transactions, currency }: TransactionsTableProps) {
  const rows = transactions ?? [];
  const displayCurrency = currency ?? rows[0]?.currency ?? "USD";

  if (!rows.length) {
    return (
      <EmptyState
        title="暂无交易记录"
        description="后端股票交易接口当前没有返回记录。"
      />
    );
  }

  const totalNetAmount = rows.reduce(
    (sum, item) => sum + Number(item.netAmount ?? 0),
    0,
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-blue-500 border-b-2 border-blue-500 text-sm font-medium">
            Transactions
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-1">Σ Net amount</div>
        <div className="text-lg font-semibold text-gray-900">
          {formatMoney(totalNetAmount, displayCurrency)}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-3 text-sm font-medium text-gray-600 px-4">Operation</th>
              <th className="text-left pb-3 text-sm font-medium text-gray-600 px-4">Holding</th>
              <th className="text-left pb-3 text-sm font-medium text-gray-600 px-4">Date</th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">Shares</th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">Price</th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">Fees</th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">Net amount</th>
              <th className="text-left pb-3 text-sm font-medium text-gray-600 px-4">Note</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <span className={`text-sm font-medium ${transaction.type === "BUY" ? "text-blue-500" : "text-red-500"}`}>
                    {transaction.type}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">{transaction.assetName || transaction.symbol || "--"}</div>
                  <div className="text-xs text-gray-500">{transaction.symbol || "--"}</div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">{formatDate(transaction.tradeDate)}</td>
                <td className="py-4 px-4 text-right text-sm text-gray-900">{formatNumber(transaction.quantity, { digits: 2 })}</td>
                <td className="py-4 px-4 text-right text-sm text-gray-900">
                  {formatMoney(transaction.price, transaction.currency || displayCurrency)}
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-900">
                  {formatMoney(Number(transaction.commission ?? 0) + Number(transaction.tax ?? 0), transaction.currency || displayCurrency)}
                </td>
                <td className="py-4 px-4 text-right text-sm text-gray-900">
                  {formatMoney(transaction.netAmount, transaction.currency || displayCurrency)}
                </td>
                <td className="py-4 px-4 text-sm text-gray-500">{transaction.note || "--"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
