package com.example.spring.repository;

import com.example.spring.entity.members.Members;
import com.example.spring.security.CustomUserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface MembersRepository extends JpaRepository<Members, Long> {
    Optional<Members> findByEmail(String email);

    @Query("select m.nickname from Members m where m.id = :id")
    Optional<String> findNicknameById(Long id);

    Boolean existsByEmail(String email);


}
