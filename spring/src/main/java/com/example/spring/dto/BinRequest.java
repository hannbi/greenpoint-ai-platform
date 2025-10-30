package com.example.spring.dto;

import lombok.Data;

@Data
public class BinRequest {
    private float minX;
    private float minY;
    private float maxX;
    private float maxY;
}
