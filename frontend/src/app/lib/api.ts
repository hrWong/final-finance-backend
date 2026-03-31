import type {
  AllocationItemResponse,
  ApiResponse,
  AssetResponse,
  AssetSearchItemResponse,
  CreateTransactionRequest,
  CurrentPortfolioResponse,
  DashboardSummaryResponse,
  MarketMoverResponse,
  PositionResponse,
  StockHistoryPointResponse,
  StockOverviewResponse,
  TransactionResponse,
} from "./types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function buildUrl(path: string) {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseBody(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function request<T>(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
  });
  const payload = await parseBody(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "message" in payload
        ? String(payload.message)
        : `Request failed with status ${response.status}`;
    const code =
      typeof payload === "object" && payload && "code" in payload
        ? String(payload.code)
        : undefined;
    throw new ApiError(message, response.status, code);
  }

  if (typeof payload === "object" && payload && "success" in payload) {
    const apiResponse = payload as ApiResponse<T>;
    if (!apiResponse.success) {
      throw new ApiError(apiResponse.message || "Request failed", response.status, apiResponse.code);
    }
    return apiResponse.data;
  }

  return payload as T;
}

export async function safeRequest<T>(path: string, init?: RequestInit) {
  try {
    return await request<T>(path, init);
  } catch (error) {
    console.warn(`Request failed for ${path}`, error);
    return null;
  }
}

export function getDashboardSummary() {
  return safeRequest<DashboardSummaryResponse>("/api/dashboard/summary");
}

export function getDashboardAllocation() {
  return safeRequest<AllocationItemResponse[]>("/api/dashboard/allocation");
}

export function getMarketMovers(limit = 8) {
  return safeRequest<MarketMoverResponse[]>(`/api/market/movers?limit=${limit}`);
}

export function getStockOverview(symbol: string) {
  return safeRequest<StockOverviewResponse>(`/api/stocks/${encodeURIComponent(symbol)}/overview`);
}

export function getStockHistory(symbol: string, range = "1y", interval = "1d") {
  return safeRequest<StockHistoryPointResponse[]>(
    `/api/stocks/${encodeURIComponent(symbol)}/history?range=${encodeURIComponent(range)}&interval=${encodeURIComponent(interval)}`,
  );
}

export function getStockPosition(symbol: string) {
  return safeRequest<PositionResponse>(`/api/stocks/${encodeURIComponent(symbol)}/position`);
}

export function getStockTransactions(symbol: string) {
  return safeRequest<TransactionResponse[]>(`/api/stocks/${encodeURIComponent(symbol)}/transactions`);
}

export function getAsset(symbol: string) {
  return safeRequest<AssetResponse>(`/api/assets/${encodeURIComponent(symbol)}`);
}

export function searchAssets(keyword: string, type?: string) {
  const trimmedKeyword = keyword.trim();

  if (!trimmedKeyword) {
    return Promise.resolve<AssetSearchItemResponse[] | null>([]);
  }

  const params = new URLSearchParams({ q: trimmedKeyword });
  if (type) {
    params.set("type", type);
  }

  return safeRequest<AssetSearchItemResponse[]>(`/api/assets/search?${params.toString()}`);
}

export function getPositions() {
  return safeRequest<PositionResponse[]>("/api/positions");
}

export function getPortfolio() {
  return safeRequest<CurrentPortfolioResponse>("/api/portfolio/current");
}

export function createTransaction(body: CreateTransactionRequest) {
  return request<TransactionResponse>("/api/transactions", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
