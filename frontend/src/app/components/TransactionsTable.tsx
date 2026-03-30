import { Plus, Filter, Printer, Edit2, Trash2 } from "lucide-react";

export function TransactionsTable() {
  const transactions = [
    {
      id: 1,
      operation: "Buy",
      holding: "Apple Inc",
      ticker: "AAPL",
      date: "07/31/2020",
      shares: 25,
      price: "$426.26",
      feeTax: "$0.00",
      summ: "-$10,156.50",
      profit: "▲ 144.97%",
      profitAmount: "-$14,723.50",
      isPositive: true,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-blue-500 border-b-2 border-blue-500 text-sm font-medium">
            Transactions
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">
            Incomes
          </button>
        </div>
      </div>

      {/* Add Button and Stats */}
      <div className="flex items-center justify-between mb-6">
        <button className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg text-sm">
          <Plus className="w-4 h-4" />
          Add
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Printer className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600 mb-1">Σ Buy</div>
        <div className="text-lg font-semibold text-gray-900">$10,156.50</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-3 text-sm font-medium text-gray-600 px-2">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="text-left pb-3 text-sm font-medium text-gray-600 px-4">
                Operation
              </th>
              <th className="text-left pb-3 text-sm font-medium text-gray-600 px-4">
                Holding
              </th>
              <th className="text-left pb-3 text-sm font-medium text-gray-600 px-4">
                Date
              </th>
              <th className="text-center pb-3 text-sm font-medium text-gray-600 px-4">
                Shares
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                Price
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                Fee / Tax
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                Summ
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                Total profit
              </th>
              <th className="text-right pb-3 text-sm font-medium text-gray-600 px-4">
                Note
              </th>
              <th className="pb-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-blue-500 font-medium">
                    {transaction.operation}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="text-sm text-gray-900">{transaction.holding}</div>
                  <div className="text-xs text-gray-500">{transaction.ticker}</div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-900">{transaction.date}</span>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="text-sm text-gray-900">{transaction.shares}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-gray-900">{transaction.price}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-gray-900">{transaction.feeTax}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-red-500">{transaction.summ}</span>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className={`text-sm ${transaction.isPositive ? "text-emerald-500" : "text-red-500"}`}>
                    {transaction.profit}
                  </div>
                  <div className={`text-xs ${transaction.isPositive ? "text-emerald-500" : "text-red-500"}`}>
                    {transaction.profitAmount}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Total</span>
          <span className="text-sm font-semibold text-emerald-500">+$14,723.50</span>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
        <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded">
          25
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <span>See 1-1 from 1</span>
      </div>
    </div>
  );
}
