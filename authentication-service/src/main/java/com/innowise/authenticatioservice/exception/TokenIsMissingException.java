package com.innowise.authenticatioservice.exception;

public class TokenIsMissingException extends RuntimeException {

    public TokenIsMissingException(String message) {
        super(message);
    }
}