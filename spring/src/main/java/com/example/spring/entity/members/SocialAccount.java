package com.example.spring.entity.members;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "social_accounts",
        uniqueConstraints = @UniqueConstraint(name = "uk_provider_user",
                columnNames = {"provider", "provider_user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SocialAccount {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;  // members.id FK (연관관계 매핑 대신 FK 숫자 보유 방식)

    @Column(nullable = false, length = 20)
    private String provider; // "KAKAO"

    @Column(name = "provider_user_id", nullable = false, length = 64)
    private String providerUserId;

    @Column
    private String email; // 정책상 항상 제공된다면 not null로 바꿔도 OK

    @Column(name = "connected_at", nullable = false)
    private LocalDateTime connectedAt;

    public static SocialAccount of(Long userId, String provider, String providerUserId, String email) {
        return SocialAccount.builder()
                .userId(userId)
                .provider(provider)
                .providerUserId(providerUserId)
                .email(email)
                .connectedAt(LocalDateTime.now())
                .build();
    }
}

