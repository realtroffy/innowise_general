package com.innowise.authenticatioservice.service;

import com.innowise.authenticatioservice.exception.TokenIsMissingException;
import org.springframework.stereotype.Component;

@Component
public class TokenExtractor {

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String MISSING_TOKEN_EXCEPTION_MESSAGE = "Token is missing";

    public static String extractToken(String token) {
        if (token != null && token.startsWith(TOKEN_PREFIX)) {
            return token.substring(TOKEN_PREFIX.length());
        } else {
            throw new TokenIsMissingException(MISSING_TOKEN_EXCEPTION_MESSAGE);
        }
    }
}
