package com.example.spring.entity.members;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="members")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Members {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String pwd;

    private String name;
    private String nickname;
    private String profile;
    private String org;
    private int points;
    private float total_co2_saved;
    private int tier_id;

    private String role;


}
