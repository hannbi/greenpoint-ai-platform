package com.example.spring.dto.recycle;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class RecyclableItem {
    @JsonProperty("item_name")
    private String itemName;
    
    @JsonProperty("material_type")
    private String materialType;
    
    @JsonProperty("visual_analysis")
    private VisualAnalysis visualAnalysis;
    
    @JsonProperty("calculation")
    private Calculation calculation;
    
    @JsonProperty("quality_grade")
    private String qualityGrade;
    
    @JsonProperty("grade_description")
    private String gradeDescription;
    
    @JsonProperty("recommendations")
    private List<String> recommendations;
}
