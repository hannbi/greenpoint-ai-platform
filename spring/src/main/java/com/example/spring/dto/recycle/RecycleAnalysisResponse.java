package com.example.spring.dto.recycle;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecycleAnalysisResponse {
    private Long dischargeRecordId;
    private Integer totalPoints;
    private Double totalCo2Reduction;
    private String imageUrl;  // 이미지 URL 추가
    private List<RecyclableItemDetail> items;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecyclableItemDetail {
        private Long itemId;
        private String itemName;
        private String materialType;
        private String qualityGrade;
        private String gradeDescription;
        private Integer points;
        private Double co2Reduction;
        private VisualAnalysis visualAnalysis;
        private List<String> recommendations;
    }
}
