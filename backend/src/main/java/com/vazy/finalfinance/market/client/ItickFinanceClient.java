package com.vazy.finalfinance.market.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.vazy.finalfinance.asset.vo.AssetResponse;
import com.vazy.finalfinance.asset.vo.AssetSearchItemResponse;
import com.vazy.finalfinance.common.exception.BusinessException;
import com.vazy.finalfinance.common.exception.ErrorCode;
import com.vazy.finalfinance.market.dto.MarketHistoryPoint;
import com.vazy.finalfinance.market.dto.MarketQuote;
import com.vazy.finalfinance.market.vo.MarketMoverResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.net.URI;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class ItickFinanceClient {

    private static final String DEFAULT_REGION = "US";
    private static final Pattern HTML_TAG_PATTERN = Pattern.compile("<[^>]+>");
    private static final int DEFAULT_SEARCH_LIMIT = 12;
    private static final int DEFAULT_MOVER_UNIVERSE_SIZE = 40;
    private static final int QUOTE_BATCH_SIZE = 2;
    private static final long MOVER_REQUEST_DELAY_MILLIS = 150L;

    private final WebClient itickWebClient;
    private final Map<String, List<CatalogEntry>> catalogCache = new ConcurrentHashMap<>();

    public MarketQuote getQuote(String symbol) {
        ResolvedSymbol resolvedSymbol = resolveSymbol(symbol);
        JsonNode quoteData = requestData(resolvedSymbol.displaySymbol(), uriBuilder -> uriBuilder
                .path("/stock/quote")
                .queryParam("region", resolvedSymbol.region())
                .queryParam("code", resolvedSymbol.code())
                .build());

        BigDecimal lastPrice = decimal(quoteData, "ld");
        if (lastPrice == null) {
            throw new BusinessException(
                    ErrorCode.MARKET_DATA_UNAVAILABLE,
                    "iTick did not return a latest price for " + symbol
            );
        }

        JsonNode infoData = null;
        try {
            infoData = requestData(resolvedSymbol.displaySymbol(), uriBuilder -> uriBuilder
                    .path("/stock/info")
                    .queryParam("type", "stock")
                    .queryParam("region", resolvedSymbol.region())
                    .queryParam("code", resolvedSymbol.code())
                    .build());
        } catch (BusinessException exception) {
            log.warn("iTick stock info request failed for {}. Returning quote-only overview.", symbol, exception);
        }

        return new MarketQuote(
                resolvedSymbol.displaySymbol(),
                text(infoData, "n"),
                text(infoData, "e"),
                firstNonBlank(text(infoData, "fcc"), text(infoData, "r")),
                lastPrice,
                decimal(quoteData, "ch"),
                decimal(quoteData, "chp"),
                decimal(infoData, "mcb"),
                decimal(infoData, "pet"),
                null,
                null,
                buildIconUrl(text(infoData, "wu"))
        );
    }

    public List<MarketHistoryPoint> getHistory(String symbol, String range, String interval) {
        ResolvedSymbol resolvedSymbol = resolveSymbol(symbol);
        JsonNode data = requestData(resolvedSymbol.displaySymbol(), uriBuilder -> uriBuilder
                .path("/stock/kline")
                .queryParam("region", resolvedSymbol.region())
                .queryParam("code", resolvedSymbol.code())
                .queryParam("kType", resolveKType(interval))
                .queryParam("limit", resolveLimit(range, interval))
                .queryParam("et", System.currentTimeMillis())
                .build());

        if (!data.isArray()) {
            return List.of();
        }

        return java.util.stream.StreamSupport.stream(data.spliterator(), false)
                .map(this::toHistoryPoint)
                .filter(java.util.Objects::nonNull)
                .sorted(Comparator.comparing(MarketHistoryPoint::date))
                .toList();
    }

    public List<AssetSearchItemResponse> searchAssets(String keyword, String assetType, int limit) {
        String normalizedType = normalizeAssetType(assetType);
        List<CatalogEntry> catalog = loadCatalog(normalizedType, DEFAULT_REGION);
        String normalizedKeyword = normalizeKeyword(keyword);

        return catalog.stream()
                .filter(entry -> !"stock".equals(normalizedType) || normalizedKeyword.isBlank() ? looksLikeCommonStock(entry) : true)
                .filter(entry -> matchesKeyword(entry, normalizedKeyword))
                .limit(limit > 0 ? limit : DEFAULT_SEARCH_LIMIT)
                .map(entry -> new AssetSearchItemResponse(
                        entry.symbol(),
                        entry.exchange(),
                        entry.name(),
                        null,
                        entry.assetType().toUpperCase(Locale.ROOT),
                        null
                ))
                .toList();
    }

    public AssetResponse getAsset(String symbol) {
        String normalizedSymbol = normalizeSymbol(symbol);
        CatalogEntry matchedEntry = findCatalogEntry(normalizedSymbol);
        if (matchedEntry == null) {
            throw new BusinessException(ErrorCode.ASSET_NOT_FOUND, "Asset not found for symbol: " + symbol);
        }

        if (!"stock".equals(matchedEntry.assetType())) {
            return new AssetResponse(
                    null,
                    matchedEntry.symbol(),
                    matchedEntry.exchange(),
                    matchedEntry.name(),
                    null,
                    matchedEntry.assetType().toUpperCase(Locale.ROOT),
                    null,
                    null,
                    matchedEntry.sector(),
                    null,
                    null,
                    null,
                    "ACTIVE"
            );
        }

        ResolvedSymbol resolvedSymbol = resolveSymbol(normalizedSymbol);
        JsonNode infoData = requestData(resolvedSymbol.displaySymbol(), uriBuilder -> uriBuilder
                .path("/stock/info")
                .queryParam("type", "stock")
                .queryParam("region", resolvedSymbol.region())
                .queryParam("code", resolvedSymbol.code())
                .build());

        return new AssetResponse(
                null,
                resolvedSymbol.displaySymbol(),
                firstNonBlank(text(infoData, "e"), matchedEntry.exchange()),
                firstNonBlank(text(infoData, "n"), matchedEntry.name()),
                null,
                "STOCK",
                firstNonBlank(text(infoData, "fcc"), text(infoData, "r")),
                null,
                firstNonBlank(text(infoData, "s"), matchedEntry.sector()),
                text(infoData, "i"),
                null,
                buildIconUrl(text(infoData, "wu")),
                "ACTIVE"
        );
    }

    public List<MarketMoverResponse> getMovers(int limit) {
        int perSideLimit = Math.max(limit, 1);
        List<CatalogEntry> moverUniverse = loadCatalog("stock", DEFAULT_REGION).stream()
                .filter(this::looksLikeCommonStock)
                .limit(Math.max(perSideLimit * 3, DEFAULT_MOVER_UNIVERSE_SIZE / 2))
                .toList();

        if (moverUniverse.isEmpty()) {
            return List.of();
        }

        Map<String, CatalogEntry> entriesBySymbol = moverUniverse.stream()
                .collect(Collectors.toMap(CatalogEntry::symbol, Function.identity(), (left, right) -> left, LinkedHashMap::new));

        List<BatchQuote> quotes = fetchBatchQuotes(DEFAULT_REGION, new ArrayList<>(entriesBySymbol.keySet()));

        List<MarketMoverResponse> gainers = quotes.stream()
                .filter(quote -> quote.changePercent() != null && quote.changePercent().compareTo(BigDecimal.ZERO) > 0)
                .sorted(Comparator.comparing(BatchQuote::changePercent).reversed())
                .limit(perSideLimit)
                .map(quote -> toMarketMover(quote, entriesBySymbol.get(quote.symbol()), true))
                .toList();

        List<MarketMoverResponse> losers = quotes.stream()
                .filter(quote -> quote.changePercent() != null && quote.changePercent().compareTo(BigDecimal.ZERO) < 0)
                .sorted(Comparator.comparing(BatchQuote::changePercent))
                .limit(perSideLimit)
                .map(quote -> toMarketMover(quote, entriesBySymbol.get(quote.symbol()), false))
                .toList();

        List<MarketMoverResponse> movers = new ArrayList<>(gainers.size() + losers.size());
        movers.addAll(gainers);
        movers.addAll(losers);
        return movers;
    }

    private JsonNode requestData(
            String requestLabel,
            Function<org.springframework.web.util.UriBuilder, java.net.URI> uriBuilder
    ) {
        try {
            JsonNode root = itickWebClient.get()
                    .uri(uriBuilder::apply)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            if (root == null) {
                throw new BusinessException(
                        ErrorCode.MARKET_DATA_UNAVAILABLE,
                        "iTick returned an empty response for " + requestLabel
                );
            }

            int code = root.path("code").asInt(-1);
            if (code != 0) {
                String message = text(root, "msg");
                throw new BusinessException(
                        ErrorCode.MARKET_DATA_UNAVAILABLE,
                        "iTick returned code " + code + " for " + requestLabel + ": " + message
                );
            }

            return root.path("data");
        } catch (BusinessException exception) {
            throw exception;
        } catch (WebClientResponseException exception) {
            throw new BusinessException(
                    ErrorCode.MARKET_DATA_UNAVAILABLE,
                    "iTick HTTP error for " + requestLabel + ": "
                            + exception.getStatusCode().value() + " " + exception.getStatusText()
            );
        } catch (RuntimeException exception) {
            throw new BusinessException(
                    ErrorCode.MARKET_DATA_UNAVAILABLE,
                    "Failed to fetch iTick data for " + requestLabel + ": " + exception.getMessage()
            );
        }
    }

    private MarketHistoryPoint toHistoryPoint(JsonNode node) {
        BigDecimal close = decimal(node, "c");
        JsonNode timestampNode = node.path("t");
        if (close == null || timestampNode.isMissingNode() || timestampNode.isNull() || !timestampNode.canConvertToLong()) {
            return null;
        }

        LocalDate date = Instant.ofEpochMilli(timestampNode.asLong())
                .atZone(ZoneOffset.UTC)
                .toLocalDate();
        return new MarketHistoryPoint(date, close);
    }

    private String resolveKType(String interval) {
        String normalizedInterval = interval == null ? "1d" : interval.trim().toLowerCase(Locale.ROOT);
        return switch (normalizedInterval) {
            case "1wk", "1w", "wk", "weekly" -> "9";
            case "1mo", "monthly" -> "10";
            default -> "8";
        };
    }

    private int resolveLimit(String range, String interval) {
        String normalizedInterval = interval == null ? "1d" : interval.trim().toLowerCase(Locale.ROOT);
        if ("1wk".equals(normalizedInterval) || "1w".equals(normalizedInterval) || "wk".equals(normalizedInterval) || "weekly".equals(normalizedInterval)) {
            return switch (normalizeRange(range)) {
                case "7d", "1m", "3m" -> 13;
                case "6m" -> 27;
                case "ytd", "1y" -> 54;
                case "5y" -> 261;
                case "all" -> 520;
                default -> 54;
            };
        }
        if ("1mo".equals(normalizedInterval) || "monthly".equals(normalizedInterval)) {
            return switch (normalizeRange(range)) {
                case "7d", "1m", "3m" -> 3;
                case "6m" -> 6;
                case "ytd", "1y" -> 12;
                case "5y" -> 60;
                case "all" -> 240;
                default -> 12;
            };
        }

        return switch (normalizeRange(range)) {
            case "7d" -> 7;
            case "1m" -> 31;
            case "3m" -> 92;
            case "6m" -> 183;
            case "ytd" -> 120;
            case "1y" -> 366;
            case "5y" -> 1826;
            case "all" -> 5000;
            default -> 366;
        };
    }

    private String normalizeRange(String range) {
        return range == null || range.isBlank() ? "1y" : range.trim().toLowerCase(Locale.ROOT);
    }

    private List<CatalogEntry> loadCatalog(String assetType, String region) {
        String cacheKey = assetType + ":" + region;
        return catalogCache.computeIfAbsent(cacheKey, ignored -> fetchCatalog(assetType, region));
    }

    private List<CatalogEntry> fetchCatalog(String assetType, String region) {
        JsonNode data = requestData("symbol list " + assetType + ":" + region, uriBuilder -> uriBuilder
                .path("/symbol/list")
                .queryParam("type", assetType)
                .queryParam("region", region)
                .queryParam("code", "")
                .build());

        if (!data.isArray()) {
            return List.of();
        }

        return java.util.stream.StreamSupport.stream(data.spliterator(), false)
                .map(node -> new CatalogEntry(
                        normalizeSymbol(text(node, "c")),
                        sanitizeText(text(node, "n")),
                        sanitizeText(text(node, "e")),
                        assetType,
                        sanitizeText(text(node, "s")),
                        sanitizeText(text(node, "l"))
                ))
                .filter(entry -> entry.symbol() != null && !entry.symbol().isBlank())
                .toList();
    }

    private CatalogEntry findCatalogEntry(String symbol) {
        for (String assetType : List.of("stock", "fund", "bond")) {
            CatalogEntry exactMatch = loadCatalog(assetType, DEFAULT_REGION).stream()
                    .filter(entry -> symbol.equals(entry.symbol()))
                    .findFirst()
                    .orElse(null);
            if (exactMatch != null) {
                return exactMatch;
            }
        }
        return null;
    }

    private boolean matchesKeyword(CatalogEntry entry, String normalizedKeyword) {
        if (normalizedKeyword.isBlank()) {
            return true;
        }

        return containsIgnoreCase(entry.symbol(), normalizedKeyword)
                || containsIgnoreCase(entry.name(), normalizedKeyword);
    }

    private String normalizeAssetType(String assetType) {
        if (assetType == null || assetType.isBlank()) {
            return "stock";
        }

        String normalized = assetType.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "stock", "fund", "bond" -> normalized;
            default -> "stock";
        };
    }

    private String normalizeKeyword(String keyword) {
        return keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeSymbol(String symbol) {
        return symbol == null ? "" : symbol.trim().toUpperCase(Locale.ROOT);
    }

    private boolean containsIgnoreCase(String value, String normalizedKeyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(normalizedKeyword);
    }

    private String sanitizeText(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return HTML_TAG_PATTERN.matcher(value).replaceAll("").trim();
    }

    private boolean looksLikeCommonStock(CatalogEntry entry) {
        if (entry == null || entry.name() == null) {
            return false;
        }

        String normalizedName = entry.name().toLowerCase(Locale.ROOT);
        return !normalizedName.contains(" etf")
                && !normalizedName.contains(" etn")
                && !normalizedName.contains(" fund")
                && !normalizedName.contains(" trust")
                && !normalizedName.contains(" notes")
                && !normalizedName.contains("income")
                && !normalizedName.contains("yield");
    }

    private List<BatchQuote> fetchBatchQuotes(String region, List<String> symbols) {
        List<List<String>> chunks = new ArrayList<>();
        for (int index = 0; index < symbols.size(); index += QUOTE_BATCH_SIZE) {
            chunks.add(symbols.subList(index, Math.min(index + QUOTE_BATCH_SIZE, symbols.size())));
        }

        List<BatchQuote> quotes = new ArrayList<>();
        for (List<String> chunk : chunks) {
            try {
                quotes.addAll(fetchQuoteChunk(region, chunk));
            } catch (BusinessException exception) {
                log.warn("Skipping iTick mover quote chunk {} after provider error: {}", chunk, exception.getMessage());
            }
            sleepQuietly(MOVER_REQUEST_DELAY_MILLIS);
        }
        return quotes.stream().filter(Objects::nonNull).toList();
    }

    private List<BatchQuote> fetchQuoteChunk(String region, List<String> symbols) {
        JsonNode data = requestData("batch quotes " + String.join(",", symbols), uriBuilder -> uriBuilder
                .path("/stock/quotes")
                .queryParam("region", region)
                .queryParam("codes", String.join(",", symbols))
                .build());

        List<BatchQuote> quotes = new ArrayList<>();
        for (String symbol : symbols) {
            JsonNode quoteNode = data.path(symbol);
            if (quoteNode.isMissingNode() || quoteNode.isNull()) {
                continue;
            }
            quotes.add(new BatchQuote(
                    normalizeSymbol(text(quoteNode, "s")),
                    decimal(quoteNode, "ld"),
                    decimal(quoteNode, "ch"),
                    decimal(quoteNode, "chp")
            ));
        }
        return quotes;
    }

    private MarketMoverResponse toMarketMover(BatchQuote quote, CatalogEntry entry, boolean positive) {
        return new MarketMoverResponse(
                quote.symbol(),
                entry == null ? quote.symbol() : entry.name(),
                quote.lastPrice(),
                quote.changeAmount(),
                quote.changePercent(),
                positive
        );
    }

    private ResolvedSymbol resolveSymbol(String symbol) {
        String normalized = normalizeSymbol(symbol);
        if (normalized.isBlank()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Symbol is required");
        }

        if (normalized.contains(":")) {
            String[] parts = normalized.split(":", 2);
            return new ResolvedSymbol(parts[0], parts[1], normalized);
        }

        int suffixIndex = normalized.lastIndexOf('.');
        if (suffixIndex > 0 && suffixIndex < normalized.length() - 1) {
            String code = normalized.substring(0, suffixIndex);
            String suffix = normalized.substring(suffixIndex + 1);
            String region = switch (suffix) {
                case "HK" -> "HK";
                case "SH", "SS" -> "SH";
                case "SZ" -> "SZ";
                case "SI" -> "SG";
                case "T" -> "JP";
                case "TW" -> "TW";
                case "L" -> "GB";
                case "DE" -> "DE";
                case "PA" -> "FR";
                case "MI" -> "IT";
                case "AS" -> "NL";
                case "AX" -> "AU";
                case "TO" -> "CA";
                default -> "US";
            };
            return new ResolvedSymbol(region, code, normalized);
        }

        return new ResolvedSymbol("US", normalized, normalized);
    }

    private BigDecimal decimal(JsonNode node, String fieldName) {
        if (node == null) {
            return null;
        }
        JsonNode valueNode = node.path(fieldName);
        if (valueNode.isMissingNode() || valueNode.isNull()) {
            return null;
        }
        try {
            return new BigDecimal(valueNode.asText());
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private String text(JsonNode node, String fieldName) {
        if (node == null) {
            return null;
        }
        JsonNode valueNode = node.path(fieldName);
        return valueNode.isMissingNode() || valueNode.isNull() ? null : valueNode.asText();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private String buildIconUrl(String websiteUrl) {
        if (websiteUrl == null || websiteUrl.isBlank()) {
            return null;
        }

        try {
            URI uri = URI.create(websiteUrl.contains("://") ? websiteUrl : "https://" + websiteUrl);
            String host = uri.getHost();
            if (host == null || host.isBlank()) {
                return null;
            }

            String scheme = "https";
            return scheme + "://" + host + "/favicon.ico";
        } catch (IllegalArgumentException exception) {
            log.warn("Failed to derive favicon URL from company website {}", websiteUrl, exception);
            return null;
        }
    }

    private void sleepQuietly(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
        }
    }

    private record ResolvedSymbol(String region, String code, String displaySymbol) {
    }

    private record CatalogEntry(
            String symbol,
            String name,
            String exchange,
            String assetType,
            String sector,
            String slug
    ) {
    }

    private record BatchQuote(
            String symbol,
            BigDecimal lastPrice,
            BigDecimal changeAmount,
            BigDecimal changePercent
    ) {
    }
}
