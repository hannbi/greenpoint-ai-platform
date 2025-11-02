package com.example.spring.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "organization")
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 50)
    @NotNull
    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Size(max = 100)
    @Column(name = "region", length = 100)
    private String region;

    @Size(max = 120)
    @Column(name = "access_code", length = 120)
    private String accessCode;

    @Size(max = 255)
    @Column(name = "contact_email")
    private String contactEmail;

    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "last_download_at")
    private Instant lastDownloadAt;

    @Size(max = 20)
    @Column(name = "last_download_report_period", length = 20)
    private String lastDownloadReportPeriod;

}
