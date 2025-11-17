package com.innowise.authenticatioservice.dto;

import java.util.Map;

public record UserNamesResponseDto(Map<Long, String> names) {
}
