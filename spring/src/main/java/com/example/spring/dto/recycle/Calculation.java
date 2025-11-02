package com.example.spring.dto.recycle;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class Calculation {
    @JsonProperty("avg_weight_kg")
    private Double avgWeightKg;
    
    @JsonProperty("delta_ef")
    private Double deltaEf;
    
    @JsonProperty("ef_type")
    private String efType;
    
    @JsonProperty("base_co2_reduction")
    private Double baseCo2Reduction;
    
    @JsonProperty("cleanliness_factor")
    private Double cleanlinessFactor;
    
    @JsonProperty("label_factor")
    private Double labelFactor;
    
    @JsonProperty("color_factor")
    private Double colorFactor;
    
    @JsonProperty("adj_coefficient")
    private Double adjCoefficient;
    
    @JsonProperty("quality_factor")
    private Double qualityFactor;
    
    @JsonProperty("final_co2_reduction")
    private Double finalCo2Reduction;
    
    @JsonProperty("points")
    private Integer points;
}
