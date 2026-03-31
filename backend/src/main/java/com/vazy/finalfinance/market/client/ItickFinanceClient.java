package com.vazy.finalfinance.market.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.vazy.finalfinance.common.exception.BusinessException;
import com.vazy.finalfinance.common.exception.ErrorCode;
import com.vazy.finalfinance.market.dto.MarketHistoryPoint;
import com.vazy.finalfinance.market.dto.MarketQuote;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Component
@RequiredArgsConstructor
@Slf4j
public class ItickFinanceClient {

    private final WebClient itickWebClient;

    public MarketQuote getQuote(String symbol) {
        ResolvedSymbol resolvedSymbol = resolveSymbol(symbol);
        JsonNode quoteData = requestData("/quote", resolvedSymbol, uriBuilder -> uriBuilder
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
            infoData = requestData("/info", resolvedSymbol, uriBuilder -> uriBuilder
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
                null
        );
    }

    public List<MarketHistoryPoint> getHistory(String symbol, String range, String interval) {
        ResolvedSymbol resolvedSymbol = resolveSymbol(symbol);
        JsonNode data = requestData("/kline", resolvedSymbol, uriBuilder -> uriBuilder
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

    private JsonNode requestData(
            String path,
            ResolvedSymbol resolvedSymbol,
            java.util.function.Function<org.springframework.web.util.UriBuilder, java.net.URI> uriBuilder
    ) {
        try {
            JsonNode root = itickWebClient.get()
                    .uri(builder -> uriBuilder.apply(builder.path(path)))
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();

            if (root == null) {
                throw new BusinessException(
                        ErrorCode.MARKET_DATA_UNAVAILABLE,
                        "iTick returned an empty response for " + resolvedSymbol.displaySymbol()
                );
            }

            int code = root.path("code").asInt(-1);
            if (code != 0) {
                String message = text(root, "msg");
                throw new BusinessException(
                        ErrorCode.MARKET_DATA_UNAVAILABLE,
                        "iTick returned code " + code + " for " + resolvedSymbol.displaySymbol() + ": " + message
                );
            }

            return root.path("data");
        } catch (BusinessException exception) {
            throw exception;
        } catch (WebClientResponseException exception) {
            throw new BusinessException(
                    ErrorCode.MARKET_DATA_UNAVAILABLE,
                    "iTick HTTP error for " + resolvedSymbol.displaySymbol() + ": "
                            + exception.getStatusCode().value() + " " + exception.getStatusText()
            );
        } catch (RuntimeException exception) {
            throw new BusinessException(
                    ErrorCode.MARKET_DATA_UNAVAILABLE,
                    "Failed to fetch iTick data for " + resolvedSymbol.displaySymbol() + ": " + exception.getMessage()
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

    private ResolvedSymbol resolveSymbol(String symbol) {
        String normalized = symbol == null ? "" : symbol.trim().toUpperCase(Locale.ROOT);
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

    private record ResolvedSymbol(String region, String code, String displaySymbol) {
    }
}
