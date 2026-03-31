# Frontend / Backend Integration Summary

Date: 2026-03-31

## Scope

This round focused on making the frontend use the backend as its only data source in development, instead of relying on built-in mock/demo data.

The frontend now:

- Uses a shared API layer for backend requests.
- Uses Vite dev proxy for `/api` and `/api-docs`.
- Renders real backend responses when they are available.
- Renders empty states, placeholders, or `--` when backend data is missing, instead of falling back to mock values.

## Main Frontend Changes

### Infrastructure

- Added backend proxy in [frontend/vite.config.ts](/Users/vazy/JavaProjects/final_finance/frontend/vite.config.ts)
- Added Vite env typings in [frontend/src/vite-env.d.ts](/Users/vazy/JavaProjects/final_finance/frontend/src/vite-env.d.ts)
- Added API client and DTO types:
- [frontend/src/app/lib/api.ts](/Users/vazy/JavaProjects/final_finance/frontend/src/app/lib/api.ts)
- [frontend/src/app/lib/types.ts](/Users/vazy/JavaProjects/final_finance/frontend/src/app/lib/types.ts)
- [frontend/src/app/lib/formatters.ts](/Users/vazy/JavaProjects/final_finance/frontend/src/app/lib/formatters.ts)
- [frontend/src/app/lib/instruments.ts](/Users/vazy/JavaProjects/final_finance/frontend/src/app/lib/instruments.ts)
- Added a reusable empty-state component:
- [frontend/src/app/components/EmptyState.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/EmptyState.tsx)

### Dashboard / Analysis

- Rewired dashboard summary, allocation, and movers to backend:
- [frontend/src/app/pages/DashboardPage.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/pages/DashboardPage.tsx)
- [frontend/src/app/components/StatsCards.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/StatsCards.tsx)
- [frontend/src/app/components/PortfolioChart.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/PortfolioChart.tsx)
- [frontend/src/app/components/PortfolioTable.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/PortfolioTable.tsx)
- [frontend/src/app/components/MarketMovers.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/MarketMovers.tsx)
- Rewired analysis summary, positions, and allocation to backend:
- [frontend/src/app/pages/AnalysisPage.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/pages/AnalysisPage.tsx)
- [frontend/src/app/components/AnalysisStatsCards.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/AnalysisStatsCards.tsx)
- [frontend/src/app/components/HoldingsTable.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/HoldingsTable.tsx)
- [frontend/src/app/components/AssetAllocationChart.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/AssetAllocationChart.tsx)

### Stock Detail

- Rewired stock overview, history, position, transactions, and asset info to backend:
- [frontend/src/app/pages/StockDetailPage.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/pages/StockDetailPage.tsx)
- [frontend/src/app/components/StockChart.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/StockChart.tsx)
- [frontend/src/app/components/StockSidebar.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/StockSidebar.tsx)
- [frontend/src/app/components/MyPositions.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/MyPositions.tsx)
- [frontend/src/app/components/TransactionsTable.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/TransactionsTable.tsx)
- [frontend/src/app/components/AboutCompany.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/AboutCompany.tsx)

### Add Holding / Buy Flow

- Rewired asset search and buy submission to backend:
- [frontend/src/app/pages/AddHoldingPage.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/pages/AddHoldingPage.tsx)
- [frontend/src/app/components/BuyModal.tsx](/Users/vazy/JavaProjects/final_finance/frontend/src/app/components/BuyModal.tsx)

## Connectivity Validation

### Result

The frontend can access the backend in development when requests go through the Vite proxy.

Verified path:

- Browser/dev server origin: `http://127.0.0.1:5173`
- Backend target: `http://127.0.0.1:8080`
- Proxy route: `/api/*`

Tested request:

- `GET http://127.0.0.1:5173/api/dashboard/summary`
- Result: `HTTP 200`

This confirms that frontend-to-backend access works through the dev proxy.

### CORS Result

The backend is not configured for direct cross-origin browser requests.

Findings:

- No backend CORS configuration was found in Java source.
- A direct request to `http://127.0.0.1:8080` with `Origin: http://127.0.0.1:5173` did not return `Access-Control-Allow-Origin`.
- A preflight request for `POST /api/transactions` returned:
- `HTTP 403`
- `Invalid CORS request`

Conclusion:

- Development mode with Vite proxy: works
- Direct browser cross-origin requests to backend: blocked by CORS

## Runtime API Verification

Backend startup was verified successfully on 2026-03-31 after allowing local MySQL access.

### APIs that are reachable from frontend

- `GET /api/dashboard/summary`
- reachable
- returns `200`
- current payload is all zeros
- `GET /api/dashboard/allocation`
- reachable
- returns `200`
- current payload is `[]`
- `GET /api/market/movers?limit=8`
- reachable
- returns `200`
- current payload is `[]`
- `GET /api/stocks/AAPL/overview`
- reachable
- returns `200`
- current payload only includes `symbol` and `breadcrumb`
- `GET /api/stocks/AAPL/history?range=1y&interval=1d`
- reachable
- returns `200`
- current payload is `[]`
- `GET /api/stocks/AAPL/transactions`
- reachable
- returns `200`
- current payload is `[]`
- `GET /api/transactions`
- reachable
- returns `200`
- current payload is `[]`
- `POST /api/transactions`
- reachable
- returns `200`
- returns a transaction echo payload
- does not actually persist data

### APIs that are reachable but currently fail in backend

- `GET /api/portfolio/current`
- returns `success:false`
- reason: mapper statement missing
- `GET /api/positions`
- returns `success:false`
- reason: mapper statement missing
- `GET /api/stocks/AAPL/position`
- returns `success:false`
- reason: mapper statement missing
- `GET /api/assets/search?q=AAPL&type=STOCK`
- returns `success:false`
- reason: mapper statement missing
- `GET /api/assets/AAPL`
- returns `success:false`
- reason: mapper statement missing

These failures show that the request path is working and the current problem is backend implementation, not frontend wiring or network access.

## Backend Data / Interface Gaps

This section lists the remaining frontend data needs by status.

### Existing endpoint, but data is currently stubbed or empty

- Dashboard summary values
- endpoint exists
- current implementation returns zeros
- source: [backend/src/main/java/com/vazy/finalfinance/dashboard/service/DashboardService.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/dashboard/service/DashboardService.java)
- Dashboard allocation list
- endpoint exists
- current implementation returns an empty list
- source: [backend/src/main/java/com/vazy/finalfinance/dashboard/service/DashboardService.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/dashboard/service/DashboardService.java)
- Market movers list
- endpoint exists
- current implementation returns an empty list
- source: [backend/src/main/java/com/vazy/finalfinance/market/service/MarketDataService.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/market/service/MarketDataService.java)
- Stock overview base info
- endpoint exists
- `name`, `exchange`, and `currency` are not filled
- source: [backend/src/main/java/com/vazy/finalfinance/stock/service/StockService.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/stock/service/StockService.java)
- Stock history
- endpoint exists
- current implementation always returns an empty list
- source: [backend/src/main/java/com/vazy/finalfinance/stock/service/StockService.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/stock/service/StockService.java)
- Stock transactions / all transactions
- endpoints exist
- current implementation always returns empty lists
- source: [backend/src/main/java/com/vazy/finalfinance/transaction/service/TransactionService.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/transaction/service/TransactionService.java)
- Create transaction persistence
- endpoint exists
- currently returns success
- does not persist data
- source: [backend/src/main/java/com/vazy/finalfinance/transaction/service/TransactionService.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/transaction/service/TransactionService.java)

### Existing endpoint, but currently unusable because mapper binding is missing

- Current portfolio: `/api/portfolio/current`
- Positions list: `/api/positions`
- Single stock position: `/api/stocks/{symbol}/position`
- Asset search: `/api/assets/search`
- Asset detail: `/api/assets/{symbol}`

These are currently blocked by missing MyBatis mapped statements.

### Endpoint exists, but response shape is still not enough for full frontend UI

- Asset search result is too thin for the add-holding table
- current model: [AssetSearchItemResponse.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/asset/vo/AssetSearchItemResponse.java)
- missing fields: `lastPrice`, `changeAmount`, `changePercent`, `marketCap`, `pe`, `dividendYield`
- Allocation item is too thin for the original portfolio table richness
- current model: [AllocationItemResponse.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/dashboard/vo/AllocationItemResponse.java)
- missing fields: `investedAmount`, `gainAmount`, `gainPercent`, `targetAllocation`
- Position response does not support the full original "My positions" detail block
- current model: [PositionResponse.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/position/vo/PositionResponse.java)
- missing fields: `dividendsReceived`, `next12MonthsIncome`, `yieldOnCost`, `irr`, `notes`
- Transaction response does not support profit columns from the original UI
- current model: [TransactionResponse.java](/Users/vazy/JavaProjects/final_finance/backend/src/main/java/com/vazy/finalfinance/transaction/vo/TransactionResponse.java)
- missing fields: `realizedProfit`, `returnPercent`

### No current backend interface for this frontend need

- Default asset browse list for the add-holding page without search
- Company/business summary text for "About the company"
- Dividends tab data
- Financials tab data
- News tab data
- Community tab data
- Benchmarks/comparison data for the stock chart section
- Forecast/growth block fields such as:
- `beta`
- `revenueGrowth`
- `netIncomeGrowth`
- `fcfGrowth`
- `forwardPe`
- `forwardEps`
- `annualPayout`
- `nextExDividendDate`
- `payoutRatio`
- `dividendGrowthStreak`

## Build Verification

Frontend verification completed on 2026-03-31:

- `npm install`
- `npm run build`

Result:

- build succeeded

## Recommended Backend Priorities

### P0

- Fix MyBatis mapped statements for assets, portfolio, and positions
- Make `POST /api/transactions` actually persist and make `GET /api/transactions` return saved data

### P1

- Replace dashboard and market stubs with real data
- Fill stock overview fields
- Implement stock history

### P2

- Add richer detail interfaces for dividends, financials, news, company summary, and benchmarking
