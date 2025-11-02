package com.example.spring.dto.auth.kakao;

import jakarta.validation.constraints.NotBlank;

/** RN → 서버로 넘어오는 본문 DTO (record) */
public record KakaoAuthRequest(
        @NotBlank String code,
        String codeVerifier,          // PKCE 사용 시 전달, 아니면 null 허용
        @NotBlank String redirectUri,
        @NotBlank String deviceId     // RN 단말 식별자
) {}
