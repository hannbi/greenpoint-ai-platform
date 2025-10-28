package com.example.spring.dto.auth.kakao;

/** 카카오 사용자 조회 응답 DTO (record) */
public record KakaoUser(
        long id,
        KakaoAccount kakao_account,
        Properties properties
) {
    /** email (정책상 제공된다고 했지만, 안전하게 null 방지 보조 메서드 유지) */
    public String emailOrNull() {
        return kakao_account != null ? kakao_account.email() : null;
    }
    public String nicknameOrNull() {
        if (kakao_account != null && kakao_account.profile() != null) return kakao_account.profile().nickname();
        return properties != null ? properties.nickname() : null;
    }
    public String profileImageOrNull() {
        if (kakao_account != null && kakao_account.profile() != null) return kakao_account.profile().profile_image_url();
        return properties != null ? properties.profile_image() : null;
    }

    public record KakaoAccount(
            Boolean has_email,
            String email,
            Profile profile
    ) {
        public record Profile(
                String nickname,
                String profile_image_url
        ) {}
    }

    public record Properties(
            String nickname,
            String profile_image
    ) {}
}

