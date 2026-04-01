export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export interface DashboardSummaryResponse {
  totalValue: number | null;
  investedAmount: number | null;
  totalPnl: number | null;
  totalPnlPct: number | null;
  cumulativePnl: number | null;
  dailyPnl: number | null;
  dailyPnlPct: number | null;
  cash: number | null;
  baseCurrency: string | null;
}

export interface AllocationItemResponse {
  label: string;
  value: number | null;
  invested: number | null;
  gain: number | null;
  gainPct: number | null;
  itemCount: number | null;
  weight: number | null;
  positions: PositionResponse[] | null;
}

export interface MarketMoverResponse {
  symbol: string;
  name: string | null;
  lastPrice: number | null;
  changeAmount: number | null;
  changePercent: number | null;
  positive: boolean;
}

export interface StockOverviewResponse {
  symbol: string;
  name: string | null;
  exchange: string | null;
  currency: string | null;
  lastPrice: number | null;
  changeAmount: number | null;
  changePercent: number | null;
  marketCap: number | null;
  pe: number | null;
  eps: number | null;
  dividendYield: number | null;
  iconUrl: string | null;
  breadcrumb: string[] | null;
}

export interface StockHistoryPointResponse {
  date: string;
  close: number | null;
}

export interface PositionResponse {
  symbol: string | null;
  assetName: string | null;
  quantity: number | null;
  avgCost: number | null;
  costBasis: number | null;
  lastPrice: number | null;
  previousClose: number | null;
  marketValue: number | null;
  unrealizedPnl: number | null;
  unrealizedPnlPct: number | null;
  portfolioWeight: number | null;
  priceAsOf: string | null;
}

export interface CurrentPortfolioResponse {
  id: number;
  name: string;
  baseCurrency: string | null;
  isDefault: boolean;
  description: string | null;
}

export interface TransactionResponse {
  id: number;
  symbol: string | null;
  assetName: string | null;
  type: string;
  tradeDate: string;
  quantity: number | null;
  price: number | null;
  grossAmount: number | null;
  commission: number | null;
  tax: number | null;
  netAmount: number | null;
  currency: string | null;
  note: string | null;
}

export interface AssetResponse {
  id: number;
  symbol: string;
  exchange: string | null;
  name: string | null;
  nameZh: string | null;
  assetType: string | null;
  currency: string | null;
  country: string | null;
  sector: string | null;
  industry: string | null;
  isin: string | null;
  iconUrl: string | null;
  status: string | null;
}

export interface AssetSearchItemResponse {
  symbol: string;
  exchange: string | null;
  name: string | null;
  nameZh: string | null;
  assetType: string | null;
  currency: string | null;
  sector: string | null;
  iconUrl: string | null;
  lastPrice: number | null;
  changeAmount: number | null;
  changePercent: number | null;
  marketCap: number | null;
  pe: number | null;
  dividendYield: number | null;
}

export interface CreateTransactionRequest {
  symbol: string;
  type: string;
  tradeDate: string;
  quantity: number;
  price: number;
  commission: number;
  tax: number;
  currency: string;
  note?: string;
}
