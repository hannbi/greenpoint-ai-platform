package com.example.spring.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "bin")
public class Bin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "location_name", nullable = false)
    private String locationName;

    @Column(name = "latitude", precision = 10, scale = 6)
    private BigDecimal latitude;

    @Column(name = "longitude", precision = 10, scale = 6)
    private BigDecimal longitude;

    @Size(max = 30)
    @ColumnDefault("'normal'")
    @Column(name = "status", length = 30)
    private String status;

    @Column(name = "last_collected_at")
    private Instant lastCollectedAt;

    @Size(max = 255)
    @Column(name = "type")
    private String type;

    @Column(name = "isOpen")
    private Boolean isOpen;

    @Size(max = 255)
    @Column(name = "location")
    private String location;

    @Size(max = 255)
    @Column(name = "imageUrl")
    private String imageUrl;

}