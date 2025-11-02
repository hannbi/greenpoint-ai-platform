package com.example.spring.service;

import com.example.spring.dto.CustomUser;
import com.example.spring.entity.members.Members;
import com.example.spring.repository.MembersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final MembersRepository memberRepository;

    public CustomUser getUser(Long id) {
        Members m = memberRepository.findById(id).orElse(null);
        CustomUser cu = new CustomUser();
        if(m != null) {
            cu.setId(m.getId());
            cu.setNickname(m.getNickname());
            cu.setPoints(m.getPoints());
        }
        return cu;
    }

    public Void updateUser(int id, int point) {
        Members m = memberRepository.findById(Integer.toUnsignedLong(id)).orElse(null);

        if(m != null) {
            m.setPoints(m.getPoints() + point);
            memberRepository.save(m);
        }
        return null;
    }
}
