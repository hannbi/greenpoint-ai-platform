package com.example.spring.entity.discharge;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "discharge_item")
public class DischargeItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "type", nullable = false)
    private String type;

    @NotNull
    @Column(name = "contamination", nullable = false)
    private Float contamination;

    @Column(name = "has_label")
    private Float hasLabel;

    @Column(name = "color_type")
    private Float colorType;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "grade")
    private Character grade;

    @Column(name = "item_point")
    private Integer itemPoint;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

}