package com.innowise.apigateway.dto;

public record ValidatedResponse(boolean valid, Long userId, String userName) {
}
