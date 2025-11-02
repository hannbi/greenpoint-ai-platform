package com.example.spring.controller.auth;

import com.example.spring.dto.auth.VerifyResult;
import com.example.spring.repository.MembersRepository;
import com.example.spring.service.auth.EmailVerificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;
    private final MembersRepository membersRepository;

    @PostMapping("/check")
    public ResponseEntity<String> checkEmail(@RequestParam("email") String email) {
        if(membersRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("이미 사용중인 이메일입니다.");
        }
        return ResponseEntity.ok("사용 가능한 이메일입니다.");
    }

    @PostMapping("/send")
    public ResponseEntity<?> send(@RequestParam String email) {
        emailVerificationService.sendCode(email);
        return ResponseEntity.ok().body("인증 코드가 발송되었습니다.");
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String email, @RequestParam String code,
                                    HttpServletRequest req) {
        String ua = req.getHeader("User-Agent");
        String ip = req.getRemoteAddr();
        VerifyResult r = emailVerificationService.verify(email, code, ua, ip);
        if (!r.success()) return ResponseEntity.badRequest().body("인증 실패");
        return ResponseEntity.ok(Map.of("message","인증 성공","ticket", r.ticket()));
    }
}
