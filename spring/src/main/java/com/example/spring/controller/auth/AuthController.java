package com.example.spring.controller.auth;

import com.example.spring.dto.auth.AuthResult;
import com.example.spring.dto.auth.LoginRequest;
import com.example.spring.dto.auth.SignupRequest;
import com.example.spring.repository.MembersRepository;
import com.example.spring.service.auth.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final MembersRepository memberRepository;
    private final AuthService authservice;

    private static final long RT_TTL_SEC = Duration.ofDays(30).toSeconds();
    private static final String RT_COOKIE = "RT";
    private static final String DID_COOKIE = "deviceId";


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request, HttpServletRequest http){
        authservice.signup(request, http.getHeader("User-Agent"), http.getRemoteAddr());
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

        // 쿠키 세팅 (RT, deviceId)
        setHttpOnlyCookie(res, RT_COOKIE, result.refreshToken(), (int) RT_TTL_SEC);
        setHttpOnlyCookie(res, DID_COOKIE, result.deviceId(), 365 * 24 * 60 * 60);

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + result.accessToken())
                .build();
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
