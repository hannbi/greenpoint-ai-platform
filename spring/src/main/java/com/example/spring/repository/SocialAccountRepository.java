package com.example.spring.repository;

import com.example.spring.entity.members.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, Long> {
    Optional<SocialAccount> findByProviderAndProviderUserId(String provider, String providerUserId);
    List<SocialAccount> findAllByUserId(Long userId);
}
