package com.example.spring.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class BinResponse {
    private String name;
    private String location;
    private String imageUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private boolean isOpen;
    private String status;
    private String type;
}
