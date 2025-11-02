package com.example.spring.service.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final StringRedisTemplate redis; // 이미 Bean 준비됨 :contentReference[oaicite:13]{index=13}

    private String key(long userId, String deviceId) {
        return "rt:%d:%s".formatted(userId, deviceId);
    }

    public static String sha256Hex(String s) {
        try {
            var md = java.security.MessageDigest.getInstance("SHA-256");
            byte[] bytes = md.digest(s.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    public String issue(long userId, String deviceId, String refreshToken, long ttlSeconds,
                        String ua, String ip) {

        String k = key(userId, deviceId);
        String jti = UUID.randomUUID().toString();
        long exp = Instant.now().getEpochSecond() + ttlSeconds;

        redis.opsForHash().putAll(k, Map.of(
                "hash", sha256Hex(refreshToken),
                "jti", jti,
                "exp", String.valueOf(exp),
                "ua", ua == null ? "" : ua,
                "ip", ip == null ? "" : ip
        ));
        redis.expire(k, ttlSeconds, TimeUnit.SECONDS);

        // 인덱스(선택): rt:index:{userId} 집합에 deviceId 추가
        redis.opsForSet().add("rt:index:%d".formatted(userId), deviceId);

        return jti;
    }

    public boolean verifyAndRotate(long userId, String deviceId, String refreshTokenNew,
                                   String refreshTokenOld, long ttlSeconds) {
        String k = key(userId, deviceId);
        String storedHash = (String) redis.opsForHash().get(k, "hash");

        // 재사용 감지: 저장된 해시와 방금 보낸 old RT가 다르면 → 세션 전부 종료
        if (storedHash == null || !storedHash.equals(sha256Hex(refreshTokenOld))) {
            // 전체 로그아웃
            var setKey = "rt:index:%d".formatted(userId);
            var deviceIds = redis.opsForSet().members(setKey);
            if (deviceIds != null) {
                for (String d : deviceIds) redis.delete(key(userId, d));
            }
            redis.delete(setKey);
            return false;
        }

        // 회전: 새 RT로 교체
        issue(userId, deviceId, refreshTokenNew, ttlSeconds, null, null);
        return true;
    }

    //로그아웃
    public void logoutOne(long userId, String deviceId) {
        redis.delete(key(userId, deviceId));
        redis.opsForSet().remove("rt:index:%d".formatted(userId), deviceId);
    }

    //전체 로그아웃
    public void logoutAll(long userId) {
        var setKey = "rt:index:%d".formatted(userId);
        var deviceIds = redis.opsForSet().members(setKey);
        if (deviceIds != null) {
            for (String d : deviceIds) redis.delete(key(userId, d));
        }
        redis.delete(setKey);
    }
}
