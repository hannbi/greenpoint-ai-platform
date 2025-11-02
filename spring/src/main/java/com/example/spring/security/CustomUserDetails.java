package com.example.spring.security;

import com.example.spring.entity.members.Members;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Getter
public class CustomUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final String nickname;
    private final int points;
    private final int tier_id;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserDetails(Members members) {
        this.id = members.getId();
        this.email = members.getEmail();
        this.password = members.getPwd();
        this.nickname = Optional.ofNullable(members.getNickname()).orElse("");
        this.authorities = List.of(new SimpleGrantedAuthority(Optional.ofNullable(members.getRole()).orElse("ROLE_USER")));
        this.points = members.getPoints();
        this.tier_id = members.getTier_id();
    }

    @Override
    public String getUsername() {
        return String.valueOf(id); // username = userId
    }
    
    public Long getMemberId() {
        return id;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
