export function MyPositions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">My positions</h3>

      {/* Portfolio Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs">📊</span>
        </div>
        <span className="text-sm font-medium text-gray-700">DEMO PORTFOLIO</span>
      </div>

      {/* Position Details Grid */}
      <div className="grid grid-cols-4 gap-8">
        {/* General Column */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">General</h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Shares</div>
              <div className="text-sm text-gray-900">100 shares</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Current value</div>
              <div className="text-sm text-gray-900">$24,880.00</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Cost per share</div>
              <div className="text-sm text-gray-900">$101.56</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Cost basis</div>
              <div className="text-sm text-gray-900">$10,156.50</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Share in portfolio</div>
              <div className="text-sm text-gray-900">13.95%</div>
            </div>
          </div>
        </div>

        {/* Dividends Column */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Dividends</h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Next 12 months</div>
              <div className="text-sm text-gray-900">$104.00</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Yield on cost</div>
              <div className="text-sm text-gray-900">1.02%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Dividends received</div>
              <div className="text-sm text-emerald-500">+$487.35</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Tax</div>
              <div className="text-sm text-gray-900 flex items-center gap-1">
                0%
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Returns Column */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Returns</h4>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total profit</div>
              <div className="text-sm text-emerald-500 flex items-center gap-1">
                +$15,210.85
                <span className="flex items-center">
                  ▲ +149.8%
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Capital gain</div>
              <div className="text-sm text-emerald-500 flex items-center gap-1">
                +$14,723.50
                <span className="flex items-center">
                  ▲ +145%
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">IRR</div>
              <div className="text-sm text-emerald-500 flex items-center gap-1">
                ▲ 17.78%
              </div>
            </div>
          </div>
        </div>

        {/* Notes Column */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-4">Notes</h4>
          <button className="text-sm text-blue-500 hover:text-blue-600">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
