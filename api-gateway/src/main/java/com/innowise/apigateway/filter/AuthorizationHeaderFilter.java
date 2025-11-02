package com.innowise.apigateway.filter;

import com.innowise.apigateway.dto.ValidatedResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Slf4j
@Component
public class AuthorizationHeaderFilter extends AbstractGatewayFilterFactory<AuthorizationHeaderFilter.Config> {

    public static final String AUTHORIZATION_TOKEN_PREFIX = "Bearer ";
    public static final String AUTHENTICATION_SERVICE_UNREACHABLE_MESSAGE = "Authentication service is unreachable";
    public static final String LOG_MISSING_OR_INVALID_HEADER = "Missing or invalid Authorization header";
    public static final String LOG_VALIDATION_CLIENT_ERROR = "Validation endpoint returned client error: status={}, body={}";
    public static final String LOG_VALIDATION_SERVER_ERROR = "Validation endpoint returned server error: status={}, body={}";
    public static final String LOG_VALIDATION_UNREACHABLE = "Validation service is unreachable: {}";

    private final WebClient webClient;

    @Value("${gateway.auth.validate-url}")
    private String validateUrl;

    public AuthorizationHeaderFilter(WebClient webClient) {
        super(Config.class);
        this.webClient = webClient;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith(AUTHORIZATION_TOKEN_PREFIX)) {
                log.warn(LOG_MISSING_OR_INVALID_HEADER);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            return webClient.post()
                    .uri(validateUrl)
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .exchangeToMono(response -> {
                        HttpStatusCode status = response.statusCode();
                        if (status.is2xxSuccessful()) {
                            return response.bodyToMono(ValidatedResponse.class)
                                    .flatMap(validatedResponse -> {
                                        String userId = String.valueOf(validatedResponse.userId());
                                        String userName = validatedResponse.userName();

                                        ServerHttpRequest mutatedRequest = exchange.getRequest()
                                                .mutate()
                                                .header("X-User-Id", userId)
                                                .header("X-User-Name", userName)
                                                .build();

                                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                                    });
                        } else {
                            return response.bodyToMono(String.class)
                                    .flatMap(errorBody -> {
                                        if (status.is4xxClientError()) {
                                            log.warn(LOG_VALIDATION_CLIENT_ERROR, status, errorBody);
                                            exchange.getResponse().setStatusCode(status);
                                            return exchange.getResponse().writeWith(
                                                    Mono.just(exchange.getResponse().bufferFactory().wrap(errorBody.getBytes())));
                                        } else {
                                            log.error(LOG_VALIDATION_SERVER_ERROR, status, errorBody);
                                            exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
                                            byte[] message = AUTHENTICATION_SERVICE_UNREACHABLE_MESSAGE.getBytes();
                                            return exchange.getResponse().writeWith(
                                                    Mono.just(exchange.getResponse().bufferFactory().wrap(message))
                                            );
                                        }
                                    });
                        }
                    })
                    .onErrorResume(e -> {
                        log.error(LOG_VALIDATION_UNREACHABLE, e.getMessage());
                        exchange.getResponse().setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR);
                        byte[] message = AUTHENTICATION_SERVICE_UNREACHABLE_MESSAGE.getBytes();
                        return exchange.getResponse().writeWith(
                                Mono.just(exchange.getResponse().bufferFactory().wrap(message))
                        );
                    });
        };
    }

    public static class Config {
    }
}