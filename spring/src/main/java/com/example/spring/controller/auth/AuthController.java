package com.example.spring.controller.auth;

import com.example.spring.dto.auth.AuthResult;
import com.example.spring.dto.auth.LoginRequest;
import com.example.spring.dto.auth.SignupRequest;
import com.example.spring.repository.MembersRepository;
import com.example.spring.security.JwtTokenProvider;
import com.example.spring.service.auth.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MembersRepository memberRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthService authservice;

    private static final long RT_TTL_SEC = Duration.ofDays(30).toSeconds();
    private static final String RT_COOKIE = "RT";
    private static final String DID_COOKIE = "deviceId";


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request, HttpServletRequest http){
        authservice.signup(request, http.getHeader("User-Agent"), http.getRemoteAddr(),"local");
        return ResponseEntity.ok(Map.of("message", "가입 완료"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req,
                                   @CookieValue(value = DID_COOKIE, required = false) String deviceIdCookie,
                                   HttpServletRequest httpReq,
                                   HttpServletResponse res) {

        String ua = httpReq.getHeader("User-Agent");
        String ip = resolveClientIp(httpReq);

        AuthResult result = authservice.login(req, deviceIdCookie, ua, ip);
        long id = jwtTokenProvider.getUserId(result.accessToken());
        memberRepository.findById(id);

        // 쿠키 세팅 (RT, deviceId)
        setHttpOnlyCookie(res, RT_COOKIE, result.refreshToken(), (int) RT_TTL_SEC);
        setHttpOnlyCookie(res, DID_COOKIE, result.deviceId(), 365 * 24 * 60 * 60);


        Map<String, String> body = new HashMap<>();
        body.put("deviceId", result.deviceId());
        body.put("message", "로그인 성공");
        body.put("userId",String.valueOf(id));

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + result.accessToken())
                .body(body);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(name = DID_COOKIE) String deviceId,
                                    @RequestHeader("Authorization") String atHeader,
                                    HttpServletResponse res) {
        String at = extractBearer(atHeader);
        authservice.logout(at, deviceId);

        setHttpOnlyCookie(res, "RT", "", 0);
        setHttpOnlyCookie(res, "deviceId", "", 0);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(value = RT_COOKIE, required = false) String rtCookie,
                                     @CookieValue(value = DID_COOKIE, required = false) String deviceId,
                                     @RequestHeader("Authorization") String atHeader,
                                     HttpServletResponse res) {
        if (rtCookie == null || deviceId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "쿠키 누락(RT/deviceId)"));
        }
        String oldAccessToken = extractBearer(atHeader);

        AuthResult result = authservice.refresh(oldAccessToken, rtCookie, deviceId);

        // RT 회전 저장 (HttpOnly)
        setHttpOnlyCookie(res, RT_COOKIE, result.refreshToken(), (int) RT_TTL_SEC);
        // deviceId는 변경 없으면 그대로 유지 (필요시 재설정)

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + result.accessToken())
                .build();
    }



    //util Only AuthController
    private static String extractBearer(String header) {
        return header != null && header.startsWith("Bearer ") ? header.substring(7) : "";
    }

    private static void setHttpOnlyCookie(HttpServletResponse res, String name, String value, int maxAgeSec) {
        Cookie c = new Cookie(name, value);
        c.setHttpOnly(true);
        c.setSecure(true);
        c.setPath("/");
        c.setMaxAge(maxAgeSec);
        res.addCookie(c);
    }

    private static void deleteCookie(HttpServletResponse res, String name) {
        Cookie c = new Cookie(name, "");
        c.setPath("/");
        c.setMaxAge(0);
        c.setHttpOnly(true);
        c.setSecure(true);
        res.addCookie(c);
    }

    private static String resolveClientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            return xff.split(",")[0].trim();
        }
        return req.getRemoteAddr();
    }

}
