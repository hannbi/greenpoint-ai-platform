package com.example.spring.dto.recycle;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class VisualAnalysis {
    @JsonProperty("cleanliness")
    private String cleanliness;
    
    @JsonProperty("label_status")
    private String labelStatus;
    
    @JsonProperty("color")
    private String color;
    
    @JsonProperty("quality_score")
    private Double qualityScore;
}
