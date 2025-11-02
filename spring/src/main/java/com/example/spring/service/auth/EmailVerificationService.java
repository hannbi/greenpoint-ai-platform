package com.example.spring.service.auth;

import com.example.spring.dto.auth.VerifyResult;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.thymeleaf.TemplateEngine;

import org.thymeleaf.context.Context;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private final StringRedisTemplate redis;
    private final JavaMailSender mailSender;
    private final ObjectMapper objectMapper;
    private final TemplateEngine templateEngine;

    // .env → 환경변수로 올라온 값을 바로 사용 (기본값도 함께)
    @Value("${EMAIL_CODE_TTL_MINUTES:5}")
    private int codeTtlMinutes;

    @Value("${EMAIL_SEND_COOLDOWN_SECONDS:60}")
    private int cooldownSeconds;

    @Value("${EMAIL_MAX_ATTEMPTS:5}")
    private int maxAttempts;

    @Value("${EMAIL_FROM:no-reply@itda.app}")
    private String from;

    private static final String KEY_CODE_PREFIX  = "email:verify:code:";
    private static final String KEY_SENT_PREFIX  = "email:verify:sent:";
    private static final String KEY_TRIES_PREFIX = "email:verify:tries:";

    // SecureRandom 선택
    private final SecureRandom random = new SecureRandom();

    private String codeKey(String email)  { return KEY_CODE_PREFIX + email; }
    private String sentKey(String email)  { return KEY_SENT_PREFIX + email; }
    private String triesKey(String email) { return KEY_TRIES_PREFIX + email; }

    public void sendCode(String email) {
        // 재발송 쿨다운
        if (redis.hasKey(sentKey(email))) {
            throw new IllegalStateException("재발송은 잠시 후에 가능합니다.");
        }

        // 6자리 코드 생성 (000000 ~ 999999)
        String code = String.format("%06d", random.nextInt(1_000_000));

        // 코드 TTL 저장
        redis.opsForValue().set(codeKey(email), code, Duration.ofMinutes(codeTtlMinutes));
        // 쿨다운 키
        redis.opsForValue().set(sentKey(email), "1", Duration.ofSeconds(cooldownSeconds));
        // 실패횟수 초기화
        redis.delete(triesKey(email));

        Context ctx = new Context();
        ctx.setVariable("code", code);
        ctx.setVariable("ttl", codeTtlMinutes);

        String html = templateEngine.process("email", ctx);

        // 메일 발송 (필요 시 HTML 템플릿로 교체 가능)
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, true, "UTF-8");
            helper.setFrom(from);         // Gmail이면 로그인 계정과 동일 권장
            helper.setTo(email);
            helper.setSubject("[GreenPoint] 이메일 인증 코드");
            helper.setText(html, true);   // ← HTML on

            // (선택) 인라인 이미지
            // helper.addInline("logo", new ClassPathResource("static/IT-DA-logo.png"), "image/png");
            // 템플릿에서: <img src="cid:logo"/>

            mailSender.send(mime);
        } catch (Exception e) {
            throw new RuntimeException("메일 전송 실패", e);
        }
    }

    @SneakyThrows
    public VerifyResult verify(String email, String inputCode, String userAgent, String clientIp) {
        String key = codeKey(email);
        String real = redis.opsForValue().get(key);
        if (real == null) return new VerifyResult(false,"");

        if (!real.equals(inputCode)) {
            Long tries = redis.opsForValue().increment(triesKey(email));
            if (tries != null && tries == 1L) {
                redis.expire(triesKey(email), Duration.ofMinutes(codeTtlMinutes));
            }
            if (tries != null && tries >= maxAttempts) {
                redis.delete(key);
                redis.delete(triesKey(email));
            }
            return new VerifyResult(false,"");
        }

        String ticket = UUID.randomUUID().toString();

        // "email|purpose|ua|ip -> json"
        Map<String, Object> payload = Map.of(
                "email", email,
                "purpose", "signup",
                "ua", userAgent,
                "ip", clientIp,
                "createdAt", System.currentTimeMillis()
        );

        // JSON 직렬화
        String json = objectMapper.writeValueAsString(payload);

        redis.opsForValue().set("email:verify:ok:" + ticket, json, Duration.ofMinutes(20));

        // 성공 시 정리
        redis.delete(key);
        redis.delete(triesKey(email));
        return new VerifyResult(true, ticket);
    }
}
