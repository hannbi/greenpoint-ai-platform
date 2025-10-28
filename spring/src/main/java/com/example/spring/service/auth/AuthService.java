package com.example.spring.service.auth;

import com.example.spring.repository.MembersRepository;
import com.example.spring.security.JwtTokenProvider;
import com.fasterxml.jackson.core.type.TypeReference;
import com.example.spring.dto.auth.AuthResult;
import com.example.spring.dto.auth.LoginRequest;
import com.example.spring.dto.auth.SignupRequest;
import com.example.spring.entity.members.Members;
import com.example.spring.repository.MembersRepository;
import com.example.spring.security.CustomUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.client.HttpClientErrorException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.spring.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.time.Duration;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@ResponseStatus(HttpStatus.BAD_REQUEST)
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final StringRedisTemplate redis;
    private final MembersRepository membersRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final PasswordEncoder pe;
    private final JwtTokenProvider jwt;
    private final RefreshTokenService refreshTokenService;

    private static final long RT_TTL_SEC = Duration.ofDays(30).toSeconds();
    private final JwtTokenProvider jwtTokenProvider;


    @Transactional
    public void signup(SignupRequest request, String uaNow, String ipNow) {
        final String email = request.email().trim().toLowerCase(Locale.ROOT); //<- Locale.ROOT 뭔지 찾아봐야함
        final String key = "email:verify:ok:" + request.ticket();

        String json = redis.opsForValue().get(key);
        if (json == null) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "인증 티켓 없음/만료");
        }

        Map<String, Object> payload;
        try {
            payload = objectMapper.readValue(json, new TypeReference<>() {});
        } catch (Exception e) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "티켓 형식 오류");
        }


        String emailFromTicket = (String) payload.get("email");
        String purpose = (String) payload.get("purpose");

        if (!"signup".equals(purpose)) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "잘못된 티켓 목적");
        }
        if (!email.equalsIgnoreCase(emailFromTicket)) {
            throw new HttpClientErrorException(HttpStatus.BAD_REQUEST, "티켓 이메일 불일치");
        }

        if (membersRepository.existsByEmail(email)) {
            throw new HttpClientErrorException(HttpStatus.CONFLICT, "이미 가입된 이메일");
        }

        Members m = Members.builder()
                .email(email)
                .pwd(pe.encode(request.password()))
                .name(request.name())
                .nickname(request.nickname())
                .profile("default.png")
                .role("ROLE_USER")
                .org(request.org())
                .tier_id(1)
                .build();

        redis.delete(key);

        membersRepository.save(m);

    }

    public AuthResult login(LoginRequest req, String deviceIdCookie, String userAgent, String ip) {
        // 로그인 인증
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email(), req.password())
        );

        Object principal = auth.getPrincipal();
        // userId/roles 조회
        Long userId;
        String nickname;
        List<String> roles;
        int points;
        int user_tier;
        if (principal instanceof CustomUserDetails cud) {
            userId = cud.getId();
            nickname = cud.getNickname();
            roles = cud.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            points = cud.getPoints();
            user_tier = cud.getTier_id();
        } else {
            userId = Long.valueOf(auth.getName());
            nickname = membersRepository.findNicknameById(userId).orElse("퍼즐이");
            roles = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            points = 0;
            user_tier = 1;
        }

        // AT 생성
        String accessToken = jwt.createAccessToken(userId, nickname, roles,points, user_tier);

        // RT 생성 & Redis 저장 (원문은 클라로, 서버에는 해시)
        String deviceId = deviceIdCookie != null ? deviceIdCookie : UUID.randomUUID().toString();
        String refreshToken = UUID.randomUUID() + "." + UUID.randomUUID();
        String rtJti = refreshTokenService.issue(userId, deviceId, refreshToken, RT_TTL_SEC, userAgent, ip);

        return new AuthResult(userId, deviceId, accessToken, refreshToken, rtJti, roles);
    }

    public AuthResult refresh(String oldAccessToken, String rtCookie, String deviceId) {
        // userId는 만료 직전 AT에서 추출
        Long userId = jwt.getUserId(oldAccessToken);

        // 새 RT 생성
        String newRefreshToken = UUID.randomUUID() + "." + UUID.randomUUID();

        boolean ok = refreshTokenService.verifyAndRotate(
                userId, deviceId, newRefreshToken, rtCookie, RT_TTL_SEC
        );
        if (!ok) {
            // 재사용 감지 → 전체 로그아웃 이미 처리됨
            throw new RefreshReuseDetectedException("Refresh token reuse detected");
        }

        // 새 AT
        var roles = jwt.getRoles(oldAccessToken);
        Members member = membersRepository.findById(userId).orElse(null); //닉네임 변경을 대비한 데이터베이스 조회
        String newAccessToken = jwt.createAccessToken(userId, member.getNickname(), roles, member.getPoints(), member.getTier_id());

        return new AuthResult(userId, deviceId, newAccessToken, newRefreshToken, null, roles);
    }

    public void logout(String accessToken, String deviceId) {
        Long userId = jwt.getUserId(accessToken);
        refreshTokenService.logoutOne(userId, deviceId);
    }

    @Transactional
    public AuthResult issueTokensFor(Long userId, String deviceId, String userAgent, String ip) {
        Members m = membersRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("user not found: " + userId));

        List<String> roles = List.of(m.getRole().split(" "));

        String accessToken = jwt.createAccessToken(
                m.getId(),
                m.getNickname(),
                roles,
                m.getPoints(),
                m.getTier_id()
        );

        String finalDeviceId = (deviceId != null && !deviceId.isBlank())
                ? deviceId
                : UUID.randomUUID().toString();

        String refreshToken = UUID.randomUUID() + "." + UUID.randomUUID();
        String rtJti = refreshTokenService.issue(
                userId,              // 대상 사용자
                finalDeviceId,       // 디바이스 ID
                refreshToken,        // 원문 RT
                RT_TTL_SEC,          // TTL (네 상수 그대로)
                userAgent,           // UA
                ip                   // IP
        );


        return new AuthResult(
                userId,
                finalDeviceId,
                accessToken,
                refreshToken,
                rtJti,
                roles
        );
    }

    // 전체 로그아웃
    public void logoutAll(String accessToken) {
        Long userId = jwt.getUserId(accessToken);
        refreshTokenService.logoutAll(userId);
    }
    
    //오류처리
    public static class RefreshReuseDetectedException extends RuntimeException {
        public RefreshReuseDetectedException(String msg) { super(msg); }
    }
}
