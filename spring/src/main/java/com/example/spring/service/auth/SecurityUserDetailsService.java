package com.example.spring.service.auth;

import com.example.spring.entity.members.Members;
import com.example.spring.repository.MembersRepository;
import com.example.spring.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SecurityUserDetailsService implements UserDetailsService {

    private final MembersRepository memberRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Members member = memberRepository.findByEmail(email)
                .orElseThrow (()-> new UsernameNotFoundException("user no found"));

        return new CustomUserDetails(member);
    }
}
