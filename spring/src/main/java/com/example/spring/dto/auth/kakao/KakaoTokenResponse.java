package com.example.spring.dto.auth.kakao;

public record KakaoTokenResponse(
        String token_type,
        String access_token,
        String refresh_token,
        Integer expires_in,
        Integer refresh_token_expires_in,
        String id_token
) {}
