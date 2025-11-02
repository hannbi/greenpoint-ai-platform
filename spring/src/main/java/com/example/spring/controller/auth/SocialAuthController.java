package com.example.spring.controller.auth;

import com.example.spring.dto.auth.AuthResult;
import com.example.spring.dto.auth.kakao.KakaoAuthRequest;
import com.example.spring.service.auth.KakaoOAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/social")
@RequiredArgsConstructor
public class SocialAuthController {

    private final KakaoOAuthService kakaoOAuthService;

    @PostMapping("/kakao")
    public ResponseEntity<AuthResult> kakao(@Valid @RequestBody KakaoAuthRequest req,
                                            HttpServletRequest httpReq) {
        String ua = httpReq.getHeader("User-Agent");
        String ip = httpReq.getRemoteAddr();
        AuthResult result = kakaoOAuthService.loginOrSignup(req, ua, ip);
        return ResponseEntity.ok(result);
    }
}