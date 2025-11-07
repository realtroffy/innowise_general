package com.innowise.authenticatioservice.controller;

import com.innowise.authenticatioservice.dto.LoginRequest;
import com.innowise.authenticatioservice.dto.RegisterRequest;
import com.innowise.authenticatioservice.dto.TokenResponse;
import com.innowise.authenticatioservice.dto.UserNamesRequestDto;
import com.innowise.authenticatioservice.dto.UserNamesResponseDto;
import com.innowise.authenticatioservice.dto.ValidatedResponse;
import com.innowise.authenticatioservice.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    @Value("${auth.service.secret}")
    private String serviceSecret;

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/validate")
    public ResponseEntity<ValidatedResponse> validateToken(@RequestHeader("Authorization") String accessToken) {
        return ResponseEntity.ok(authService.validateAccessToken(accessToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        return ResponseEntity.ok(authService.refreshAccessToken(refreshToken));
    }

    @PostMapping("/names")
    public ResponseEntity<UserNamesResponseDto> getUserNamesByIds(@RequestHeader(value = "X-Service-Secret") String headerSecret,
                                                                  @RequestBody UserNamesRequestDto requestDto) {

        if (headerSecret == null || !headerSecret.equals(serviceSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        UserNamesResponseDto response = authService.getUserNamesByIds(requestDto.userIds());
        return ResponseEntity.ok(response);
    }
}
