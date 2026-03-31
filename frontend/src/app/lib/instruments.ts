const SYMBOL_ICONS: Record<string, string> = {
  AAPL: "🍎",
  MSFT: "🖥️",
  GOOGL: "🔍",
  GOOG: "🔍",
  AMZN: "📦",
  TSLA: "🚗",
  NVDA: "🎮",
  META: "📱",
  JPM: "🏦",
  VOO: "📊",
  VTI: "📈",
  QQQ: "💹",
  TLT: "📜",
  AGG: "📑",
  COST: "🏪",
  NFLX: "🎬",
  HD: "🏠",
  WELL: "🏥",
};

const TYPE_ICONS: Record<string, string> = {
  STOCK: "📈",
  FUND: "📊",
  BOND: "📜",
};

export function getInstrumentIcon(symbol?: string | null, assetType?: string | null) {
  const normalizedSymbol = symbol?.toUpperCase() ?? "";
  const normalizedType = assetType?.toUpperCase() ?? "";

  return SYMBOL_ICONS[normalizedSymbol] ?? TYPE_ICONS[normalizedType] ?? "💹";
}
