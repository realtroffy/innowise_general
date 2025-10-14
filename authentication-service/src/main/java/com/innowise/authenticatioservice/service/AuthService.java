package com.innowise.authenticatioservice.service;

import com.innowise.authenticatioservice.dto.LoginRequest;
import com.innowise.authenticatioservice.dto.RegisterRequest;
import com.innowise.authenticatioservice.dto.TokenResponse;
import com.innowise.authenticatioservice.dto.ValidatedResponse;

public interface AuthService {

    void register(RegisterRequest request);

    TokenResponse login(LoginRequest request);

    TokenResponse refreshAccessToken(String refreshToken);

    ValidatedResponse validateAccessToken(String token);
}
