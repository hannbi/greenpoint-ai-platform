package com.example.spring.security;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler{

    @ExceptionHandler(HttpClientErrorException.BadRequest.class)
    public ResponseEntity<?> handleBad(HttpClientErrorException.BadRequest e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

    @ExceptionHandler(HttpClientErrorException.Conflict.class)
    public ResponseEntity<?> handleConflict(HttpClientErrorException.Conflict e) {
        return ResponseEntity.status(409).body(Map.of("message", e.getMessage()));
    }
    // Unauthorized(401)/Forbidden(403)/TooManyRequests(429) 등도 필요 시 추가 예정
}
