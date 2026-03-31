type NumericValue = number | string | null | undefined;

export function toNumber(value: NumericValue): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatMoney(
  value: NumericValue,
  currency = "CNY",
  options: {
    compact?: boolean;
    signed?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {},
) {
  const numericValue = toNumber(value);

  if (numericValue === null) {
    return "--";
  }

  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    notation: options.compact ? "compact" : "standard",
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    signDisplay: options.signed ? "always" : "auto",
  }).format(numericValue);
}

export function formatPercent(
  value: NumericValue,
  options: { digits?: number; signed?: boolean } = {},
) {
  const numericValue = toNumber(value);

  if (numericValue === null) {
    return "--";
  }

  const digits = options.digits ?? 2;
  const prefix = options.signed && numericValue > 0 ? "+" : "";
  return `${prefix}${numericValue.toFixed(digits)}%`;
}

export function formatNumber(
  value: NumericValue,
  options: { digits?: number } = {},
) {
  const numericValue = toNumber(value);

  if (numericValue === null) {
    return "--";
  }

  return numericValue.toLocaleString("zh-CN", {
    minimumFractionDigits: options.digits ?? 0,
    maximumFractionDigits: options.digits ?? 2,
  });
}

export function formatDate(value: string | null | undefined, style: "short" | "long" = "short") {
  if (!value) {
    return "--";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", style === "long"
    ? { year: "numeric", month: "short", day: "numeric" }
    : { month: "short", day: "numeric", year: "2-digit" }).format(date);
}
