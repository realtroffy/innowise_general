package com.innowise.authenticatioservice.swagger;

import com.innowise.authenticatioservice.dto.ErrorResponse;
import com.innowise.authenticatioservice.dto.LoginRequest;
import com.innowise.authenticatioservice.dto.RegisterRequest;
import com.innowise.authenticatioservice.dto.TokenResponse;
import com.innowise.authenticatioservice.dto.ValidatedResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@Tag(name = "authentication", description = "User authentication and token management")
public interface AuthControllerSwagger {

    @Operation(
            summary = "Register a new user",
            description = """
            Registers a new user in the system. The `request` parameter is required.
            You must provide a JSON object containing the user's details. Example:
            ```
            {
                "username": "user123",
                "email": "user@example.com",
                "password": "password123"
            }
            ```
            Requirements for `username`: Must not be blank, length between 3 and 50 characters.
            Requirements for `email`: Must not be blank, valid email format, maximum 100 characters.
            Requirements for `password`: Must not be blank, minimum 8 characters.
            """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data or username/email already exists",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/register")
    ResponseEntity<String> register(
            @Parameter(description = "User registration details (username, email, password)", required = true)
            @Valid @RequestBody RegisterRequest request
    );

    @Operation(
            summary = "User login",
            description = """
            Authenticates a user and returns access and refresh tokens. The `request` parameter is required.
            You must provide a JSON object with the user's credentials. Example:
            ```
            {
                "username": "user123",
                "password": "password123"
            }
            ```
            Requirements for `username`: Must not be blank, length between 3 and 50 characters.
            Requirements for `password`: Must not be blank, minimum 8 characters.
            """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful, access and refresh tokens returned",
                    content = @Content(schema = @Schema(implementation = TokenResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data or validation error",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid username or password",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @PostMapping("/login")
    ResponseEntity<TokenResponse> login(
            @Parameter(description = "User login credentials (username, password)", required = true)
            @Valid @RequestBody LoginRequest request
    );

    @Operation(
            summary = "Validate access token",
            description = """
            Validates the access token provided in the Authorization header via JWT authentication.
            Returns validation result and user ID if the token is valid.
            """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Token validation result",
                    content = @Content(schema = @Schema(implementation = ValidatedResponse.class))),
            @ApiResponse(responseCode = "400", description = "Missing or malformed token",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid, expired, unsupported, or malformed token",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @SecurityRequirement(name = "JWT")
    @PostMapping("/validate")
    ResponseEntity<ValidatedResponse> validateToken(
            @Parameter(hidden = true) @RequestHeader("Authorization") String accessToken
    );

    @Operation(
            summary = "Refresh access token",
            description = """
            Generates a new access token using a valid refresh token provided in the Authorization header
            via JWT authentication. Returns the new access token and the same refresh token.
            """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "New access token generated successfully",
                    content = @Content(schema = @Schema(implementation = TokenResponse.class))),
            @ApiResponse(responseCode = "400", description = "Missing, malformed, or invalid token type (must be refresh token)",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Invalid, expired, unsupported, or malformed refresh token",
                    content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    @SecurityRequirement(name = "JWT")
    @PostMapping("/refresh")
    ResponseEntity<TokenResponse> refreshToken(
            @Parameter(hidden = true) @RequestHeader("Authorization") String refreshToken
    );
}