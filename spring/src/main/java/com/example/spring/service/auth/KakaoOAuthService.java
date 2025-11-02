package com.example.spring.service.auth;

import com.example.spring.dto.auth.AuthResult;
import com.example.spring.dto.auth.kakao.KakaoAuthRequest;
import com.example.spring.dto.auth.kakao.KakaoTokenResponse;
import com.example.spring.dto.auth.kakao.KakaoUser;
import com.example.spring.entity.members.Members;
import com.example.spring.entity.members.SocialAccount;
import com.example.spring.repository.MembersRepository;
import com.example.spring.repository.SocialAccountRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KakaoOAuthService {

    private final RestClient restClient; // Spring 6+ (Boot 3+) RestClient
    private final MembersRepository membersRepository;
    private final SocialAccountRepository socialAccountRepository;
    private final AuthService authService; // 기존 AT/RT 발급 재사용
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Value("${KAKAO_CLIENT_ID}") String clientId;
    @Value("${kakao.client-secret:}") String clientSecret;
    @Value("${KAKAO_TOKEN_URI}") String tokenUri;
    @Value("${KAKAO_USERINFO_URI}") String userinfoUri;

    @Transactional
    public AuthResult loginOrSignup(@Valid KakaoAuthRequest req, String userAgent, String ip) {
        // 1) 코드 → 카카오 토큰
        KakaoTokenResponse token = exchangeCodeForToken(req);

        // 2) 카카오 유저 정보
        KakaoUser ku = fetchUser(token.access_token());
        String provider = "KAKAO";
        String providerUserId = String.valueOf(ku.id());
        String email = Objects.requireNonNull(ku.emailOrNull(), "kakao email is null (check consent scope)");

        // 3) 소셜 링크 확인/매핑
        Optional<SocialAccount> existingLink = socialAccountRepository
                .findByProviderAndProviderUserId(provider, providerUserId);

        Members member;
        if (existingLink.isPresent()) {
            Long userId = existingLink.get().getUserId();
            member = membersRepository.findById(userId)
                    .orElseThrow(() -> new IllegalStateException("linked user not found: " + userId));
        } else {
            Optional<Members> byEmail = membersRepository.findByEmail(email);
            if (byEmail.isPresent()) {
                member = byEmail.get();
                socialAccountRepository.save(SocialAccount.of(member.getId(), provider, providerUserId, email));
            } else {
                // 신규 멤버 (password NOT NULL 유지 → 사용 불가 더미 해시)
                String unusableHash = passwordEncoder.encode(UUID.randomUUID() + ":" + System.nanoTime());

                member = Members.builder()
                        .email(email)                     // 네 스키마: NOT NULL + UNIQUE
                        .pwd(unusableHash)           // 실제 로그인에 쓰지 않는 랜덤 해시
                        .passwordSet(0)               // 소셜이라 미설정
                        .signupProvider("KAKAO")
                        .nickname(Optional.ofNullable(ku.nicknameOrNull()).orElse("카카오사용자"))
                        .profile(ku.profileImageOrNull())
                        .build();

                member = membersRepository.save(member);
                socialAccountRepository.save(SocialAccount.of(member.getId(), provider, providerUserId, email));
            }
        }

        // 4) 기존 AT/RT 발급 (이미 인증된 userId 진입점)
        return authService.issueTokensFor(member.getId(), req.deviceId(), userAgent, ip);
    }

    private KakaoTokenResponse exchangeCodeForToken(KakaoAuthRequest req) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "authorization_code");
        form.add("client_id", clientId);
        if (clientSecret != null && !clientSecret.isBlank()) form.add("client_secret", clientSecret);
        form.add("redirect_uri", req.redirectUri());
        form.add("code", req.code());

        return restClient.post()
                .uri(tokenUri)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(KakaoTokenResponse.class);
    }

    private KakaoUser fetchUser(String kakaoAccessToken) {
        return restClient.get()
                .uri(userinfoUri)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + kakaoAccessToken)
                .retrieve()
                .body(KakaoUser.class);
    }
}
