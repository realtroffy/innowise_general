package com.innowise.authenticatioservice.dto;

import java.util.List;

public record UserNamesRequestDto(List<Long> userIds) {
}
