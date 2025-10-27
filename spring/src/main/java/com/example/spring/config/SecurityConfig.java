package com.example.spring.config;

import com.example.spring.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String[] PUBLIC_APIS = {
            "/auth/email/check", "/auth/email/send", "/auth/email/verify", "/auth/signup",
            "/auth/login", "/auth/refresh", "/auth/logout"
    };
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                // CORS/CSRF
                .cors(c -> c.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                // 세션 미사용 (JWT)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 예외 응답(401/403) 커스터마이즈 (선택)
                .exceptionHandling(ex -> ex
                        // 인증 안됨 → 401
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(401);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Unauthorized\"}");
                        })
                        // 인가 실패 → 403
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(403);
                            res.setContentType("application/json;charset=UTF-8");
                            res.getWriter().write("{\"message\":\"Forbidden\"}");
                        })
                )

                // 인가 규칙
                .authorizeHttpRequests(auth -> auth
                        // 🔑 프리플라이트는 무조건 허용 (이거 막히면 401처럼 보일 수 있음)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // 🔓 공개 API 허용
                        .requestMatchers(PUBLIC_APIS).permitAll()
                        // 정적 리소스(선택)
                        .requestMatchers(
                                "/", "/index.html", "/static/**", "/assets/**", "/css/**", "/js/**", "/images/**"
                        ).permitAll()
                        // 그 외 전부 인증 필요
                        .anyRequest().authenticated()
                )

                // 폼로그인/기본인증 끔 (JWT만 사용)
                .httpBasic(b -> b.disable())
                .formLogin(f -> f.disable())

                // JWT 필터 등록: UsernamePasswordAuthenticationFilter 전에
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 프론트 도메인에 맞춰 CORS 허용 (초기세팅)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        // TODO: 프론트 URL로 교체 (개발 중이라면 * 임시 허용 가능)
        cfg.setAllowedOrigins(List.of("http://localhost:5173"));
        cfg.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization","Content-Type","X-Requested-With"));
        cfg.setExposedHeaders(List.of("Authorization")); // 필요 시
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }

    // 패스워드 인코더
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // AuthenticationManager (로그인 시 사용)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

}

