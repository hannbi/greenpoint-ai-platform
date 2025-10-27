package com.example.spring.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Component
public class JwtTokenProvider {

    private static final long EXPIRATION_TIME = 1000 * 60 * 60;
    private static final long ACCESS_TOKEN_TTL_MS = 15 * 60 * 1000;

    private final Key key;

    public JwtTokenProvider(@Value("${JWT_SECRET_KEY}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String createAccessToken(Long userId, String nickname, List<String> roles) {
        Instant now = Instant.now();
        return Jwts.builder()
                .setId(UUID.randomUUID().toString())                  // jti
                .setSubject(String.valueOf(userId))
                .claim("roles", roles)
                .claim("nickname", nickname)
                .setIssuedAt(Date.from(now))
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_TTL_MS))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }

    public boolean validate(String token) {
        try { parse(token); return true; } catch (Exception e) { return false; }
    }

    public Long getUserId(String token) {
        return Long.valueOf(parse(token).getBody().getSubject());
    }

    @SuppressWarnings("unchecked")
    public List<String> getRoles(String token) {
        Object v = parse(token).getBody().get("roles");
        return v instanceof List ? (List<String>) v : List.of();
    }

    public String getJti(String token) {
        return parse(token).getBody().getId();
    }
}
