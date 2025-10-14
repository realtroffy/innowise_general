package com.innowise.authenticatioservice.dto;

public record TokenResponse(
        String accessToken,
        String refreshToken) {
}
