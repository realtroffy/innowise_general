package com.innowise.authenticatioservice.dto;

public record ValidatedResponse(boolean valid, Long userId, String userName) {
}
