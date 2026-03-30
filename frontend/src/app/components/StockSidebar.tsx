export function StockSidebar() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
      {/* Estimate Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Estimate</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">P/E</span>
            <span className="text-sm text-gray-900">31.5</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">EPS</span>
            <span className="text-sm text-gray-900">7.9</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Beta</span>
            <span className="text-sm text-gray-900">1.116</span>
          </div>
        </div>
      </div>

      {/* Growth Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Growth</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Revenue, YoY</span>
            <span className="text-sm text-gray-900">15.65%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Net income, YoY</span>
            <span className="text-sm text-gray-900">15.87%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">FCF, YoY</span>
            <span className="text-sm text-gray-900">90.97%</span>
          </div>
        </div>
      </div>

      {/* Forecast Section */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Forecast</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">P/E (FWD)</span>
            <span className="text-sm text-gray-900">26.6</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">EPS (FWD)</span>
            <span className="text-sm text-gray-900">9.337</span>
          </div>
        </div>
      </div>

      {/* Dividends Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-4">Dividends</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Dividend yield</span>
            <span className="text-sm text-gray-900">0.42%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Annual payout</span>
            <span className="text-sm text-gray-900">$1.04</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Next ex. div date</span>
            <span className="text-sm text-gray-900">May 9, 26</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Payout</span>
            <span className="text-sm text-gray-900">13.15%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Div growth, 5y</span>
            <span className="text-sm text-gray-900">3.75%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Dividend growth streak</span>
            <span className="text-sm text-gray-900">13 y</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Div rating</span>
            <span className="text-sm text-teal-600 font-medium">83</span>
          </div>
        </div>
      </div>
    </div>
  );
}
