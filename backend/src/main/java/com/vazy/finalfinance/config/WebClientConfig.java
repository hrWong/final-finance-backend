package com.vazy.finalfinance.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;
import reactor.netty.transport.ProxyProvider;

import java.net.URI;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Configuration
@Slf4j
public class WebClientConfig {

    @Bean
    public WebClient itickWebClient(
            WebClient.Builder builder,
            @Value("${market.itick.base-url}") String baseUrl,
            @Value("${market.itick.token:}") String token,
            @Value("${market.itick.proxy-uri:}") String configuredProxyUri,
            @Value("${market.itick.connect-timeout-millis:5000}") int connectTimeoutMillis,
            @Value("${market.itick.response-timeout-seconds:10}") int responseTimeoutSeconds,
            @Value("${market.itick.user-agent:Mozilla/5.0}") String userAgent,
            Environment environment
    ) {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, connectTimeoutMillis)
                .responseTimeout(Duration.ofSeconds(responseTimeoutSeconds))
                .doOnConnected(connection -> connection.addHandlerLast(
                        new ReadTimeoutHandler(responseTimeoutSeconds, TimeUnit.SECONDS)
                ));

        ProxySettings proxySettings = resolveProxySettings(configuredProxyUri, environment);
        if (proxySettings != null) {
            httpClient = httpClient.proxy(proxy -> {
                ProxyProvider.Builder proxyBuilder = proxy.type(proxySettings.type())
                        .host(proxySettings.host())
                        .port(proxySettings.port());

                if (proxySettings.username() != null && !proxySettings.username().isBlank()) {
                    proxyBuilder.username(proxySettings.username());
                }
                if (proxySettings.password() != null && !proxySettings.password().isBlank()) {
                    proxyBuilder.password(ignored -> proxySettings.password());
                }
            });

            log.info("iTick WebClient is using {} proxy {}:{}",
                    proxySettings.type(), proxySettings.host(), proxySettings.port());
        }

        WebClient.Builder webClientBuilder = builder
                .baseUrl(trimTrailingSlash(baseUrl))
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.USER_AGENT, userAgent)
                .clientConnector(new ReactorClientHttpConnector(httpClient));

        if (token != null && !token.isBlank()) {
            webClientBuilder.defaultHeader("token", token);
        } else {
            log.warn("iTick token is not configured. Market data requests will fail until market.itick.token is set.");
        }

        return webClientBuilder.build();
    }

    private ProxySettings resolveProxySettings(String configuredProxyUri, Environment environment) {
        String proxyUri = firstNonBlank(
                configuredProxyUri,
                environment.getProperty("HTTPS_PROXY"),
                environment.getProperty("https_proxy"),
                environment.getProperty("HTTP_PROXY"),
                environment.getProperty("http_proxy"),
                environment.getProperty("ALL_PROXY"),
                environment.getProperty("all_proxy")
        );

        if (proxyUri == null) {
            return null;
        }

        URI uri = URI.create(proxyUri.contains("://") ? proxyUri : "http://" + proxyUri);
        String host = uri.getHost();
        if (host == null || host.isBlank()) {
            throw new IllegalArgumentException("Invalid iTick proxy URI: host is missing");
        }

        ProxyProvider.Proxy proxyType = resolveProxyType(uri.getScheme());
        int port = uri.getPort() > 0 ? uri.getPort() : defaultPort(proxyType);
        String username = null;
        String password = null;
        if (uri.getUserInfo() != null && !uri.getUserInfo().isBlank()) {
            String[] parts = uri.getUserInfo().split(":", 2);
            username = parts[0];
            password = parts.length > 1 ? parts[1] : null;
        }

        return new ProxySettings(proxyType, host, port, username, password);
    }

    private ProxyProvider.Proxy resolveProxyType(String scheme) {
        if (scheme == null || scheme.isBlank() || "http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme)) {
            return ProxyProvider.Proxy.HTTP;
        }
        if ("socks5".equalsIgnoreCase(scheme)) {
            return ProxyProvider.Proxy.SOCKS5;
        }
        if ("socks4".equalsIgnoreCase(scheme)) {
            return ProxyProvider.Proxy.SOCKS4;
        }
        throw new IllegalArgumentException("Unsupported iTick proxy scheme: " + scheme);
    }

    private int defaultPort(ProxyProvider.Proxy proxyType) {
        if (proxyType == ProxyProvider.Proxy.HTTP) {
            return 80;
        }
        return 1080;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    private String trimTrailingSlash(String value) {
        if (value == null || value.isBlank()) {
            return value;
        }
        return value.endsWith("/") ? value.substring(0, value.length() - 1) : value;
    }

    private record ProxySettings(
            ProxyProvider.Proxy type,
            String host,
            int port,
            String username,
            String password
    ) {
    }
}
