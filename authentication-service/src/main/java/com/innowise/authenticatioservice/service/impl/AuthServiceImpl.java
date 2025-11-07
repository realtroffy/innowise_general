package com.innowise.authenticatioservice.service.impl;

import com.innowise.authenticatioservice.dto.LoginRequest;
import com.innowise.authenticatioservice.dto.RegisterRequest;
import com.innowise.authenticatioservice.dto.TokenResponse;
import com.innowise.authenticatioservice.dto.UserNameDto;
import com.innowise.authenticatioservice.dto.UserNamesResponseDto;
import com.innowise.authenticatioservice.dto.ValidatedResponse;
import com.innowise.authenticatioservice.exception.InvalidCredentialsException;
import com.innowise.authenticatioservice.exception.InvalidRefreshTokenException;
import com.innowise.authenticatioservice.exception.UserAlreadyExistException;
import com.innowise.authenticatioservice.model.User;
import com.innowise.authenticatioservice.repository.UserRepository;
import com.innowise.authenticatioservice.service.AuthService;
import com.innowise.authenticatioservice.service.JwtService;
import com.innowise.authenticatioservice.service.TokenExtractor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public void register(RegisterRequest request) {
        checkUniquenessUserData(request);
        String salt = BCrypt.gensalt(12);
        String hashedPassword = BCrypt.hashpw(request.password(), salt);

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(hashedPassword)
                .salt(salt).build();

        userRepository.save(user);
    }

    private void checkUniquenessUserData(RegisterRequest request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new UserAlreadyExistException("Username already exists");
        }
        if(userRepository.findByEmail(request.email()).isPresent()) {
            throw new UserAlreadyExistException("Email already exists");
        }
    }

    @Override
    public TokenResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
        } catch (AuthenticationException e) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        User user = (User) userDetailsService.loadUserByUsername(request.username());

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return new TokenResponse(accessToken, refreshToken);
    }

    @Override
    public ValidatedResponse validateAccessToken(String token) {
        String extractedToken = TokenExtractor.extractToken(token);
        String usernameFromToken = jwtService.extractUsername(extractedToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(usernameFromToken);
        User user = (User) userDetails;
        if (isAccessTokenValid(extractedToken, userDetails)){
            return new ValidatedResponse(true, user.getId(), user.getUsername());
        } else {
            return new ValidatedResponse(false, null, null);
        }
    }

    @Override
    public TokenResponse refreshAccessToken(String refreshToken) {
        String extractedToken = TokenExtractor.extractToken(refreshToken);
        String tokenType = jwtService.extractTokenType(extractedToken);
        if (!"refresh".equals(tokenType)) {
            throw new InvalidRefreshTokenException("Invalid token type: must be a refresh token");
        }

        String usernameFromToken = jwtService.extractUsername(extractedToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(usernameFromToken);
        if (!isTokenValid(extractedToken, userDetails)) {
            throw new InvalidRefreshTokenException("Invalid or expired refresh token");
        }

        User user = (User) userDetailsService.loadUserByUsername(usernameFromToken);

        String newAccessToken = jwtService.generateAccessToken(user);
        return new TokenResponse(newAccessToken, extractedToken);
    }

    private boolean isTokenValid(String token, UserDetails userDetails) {
        String usernameFromToken = jwtService.extractUsername(token);
        return usernameFromToken.equals(userDetails.getUsername()) && !jwtService.isTokenExpired(token);
    }

    private boolean isAccessTokenValid(String token, UserDetails userDetails) {
        String tokenType = jwtService.extractTokenType(token);
        if (!"access".equals(tokenType)) {
            return false;
        }
        return isTokenValid(token, userDetails);
    }

    @Override
    public UserNamesResponseDto getUserNamesByIds(List<Long> userIds) {
        List<UserNameDto> userNames = userRepository.findByIdIn(userIds);

        Map<Long, String> namesMap = userNames.stream()
                .collect(Collectors.toMap(UserNameDto::id, UserNameDto::username));

        return new UserNamesResponseDto(namesMap);
    }
}