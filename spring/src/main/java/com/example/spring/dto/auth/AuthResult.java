package com.example.spring.dto.auth;

import java.util.List;

public record AuthResult(
        Long userId,
        String deviceId,
        String accessToken,
        String refreshToken,
        String refreshJti,
        List<String> roles
) {}
