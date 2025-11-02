package com.example.spring.service;

import com.example.spring.dto.recycle.FastAPIResponse;
import com.example.spring.dto.recycle.RecyclableItem;
import com.example.spring.dto.recycle.RecycleAnalysisResponse;
import com.example.spring.entity.discharge.DischargeItem;
import com.example.spring.entity.discharge.DischargeRecord;
import com.example.spring.entity.members.Members;
import com.example.spring.repository.MembersRepository;
import com.example.spring.repository.discharge.DischargeItemRepository;
import com.example.spring.repository.discharge.DischargeRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DischargeService {
    
    private final DischargeRecordRepository dischargeRecordRepository;
    private final DischargeItemRepository dischargeItemRepository;
    private final MembersRepository membersRepository;
    
    /**
     * FastAPI 응답을 가공하고 DB에 저장한 후 프론트에 반환할 응답 생성
     * @param fastAPIResponse FastAPI로부터 받은 분석 결과
     * @param memberId 사용자 ID
     * @param filename 이미지 파일명
     * @return 프론트엔드로 반환할 응답
     */
    @Transactional
    public RecycleAnalysisResponse processAndSaveAnalysis(FastAPIResponse fastAPIResponse, Long memberId, String filename) {
        log.info("Processing FastAPI response for member: {}, filename: {}", memberId, filename);
        
        // 1. 사용자 조회
        Members member = membersRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + memberId));
        
        // 2. DischargeRecord 생성 및 저장
        DischargeRecord dischargeRecord = new DischargeRecord();
        dischargeRecord.setMember(member);
        dischargeRecord.setTotalPoint(0);
        dischargeRecord.setCreatedAt(Instant.now());
        dischargeRecord.setUpdatedAt(Instant.now());
        
        // 3. 각 재활용품 항목을 DischargeItem으로 저장하고 포인트 계산
        int totalPoints = 0;
        double totalCo2Reduction = 0.0;
        List<RecycleAnalysisResponse.RecyclableItemDetail> itemDetails = new ArrayList<>();
        
        if (fastAPIResponse.getRecyclables() != null) {
            for (RecyclableItem recyclable : fastAPIResponse.getRecyclables()) {
                // DischargeItem 엔티티 생성
                DischargeItem item = createDischargeItem(recyclable);
                DischargeItem savedItem = dischargeItemRepository.save(item);
                
                // 포인트 및 CO2 감축량 누적
                int itemPoints = recyclable.getCalculation().getPoints();
                double itemCo2 = recyclable.getCalculation().getFinalCo2Reduction();
                
                totalPoints += itemPoints;
                totalCo2Reduction += itemCo2;
                
                // 응답용 DTO 생성
                RecycleAnalysisResponse.RecyclableItemDetail detail = RecycleAnalysisResponse.RecyclableItemDetail.builder()
                        .itemId(savedItem.getId())
                        .itemName(recyclable.getItemName())
                        .materialType(recyclable.getMaterialType())
                        .qualityGrade(recyclable.getQualityGrade())
                        .gradeDescription(recyclable.getGradeDescription())
                        .points(itemPoints)
                        .co2Reduction(itemCo2)
                        .visualAnalysis(recyclable.getVisualAnalysis())
                        .recommendations(recyclable.getRecommendations())
                        .build();
                
                itemDetails.add(detail);
            }
        }
        
        // 4. DischargeRecord 업데이트 및 저장
        dischargeRecord.setTotalPoint(totalPoints);
        DischargeRecord savedRecord = dischargeRecordRepository.save(dischargeRecord);
        
        // 5. 사용자 포인트 및 CO2 감축량 업데이트
        member.setPoints(member.getPoints() + totalPoints);
        member.setTotal_co2_saved(member.getTotal_co2_saved() + (float) totalCo2Reduction);
        membersRepository.save(member);
        
        log.info("Saved discharge record. Record ID: {}, Total Points: {}, Total CO2: {}", 
                savedRecord.getId(), totalPoints, totalCo2Reduction);
        
        // 6. 이미지 URL 생성 (파일명 기반)
        String imageUrl = "/api/discharge/image/" + filename;
        
        // 7. 최종 응답 생성
        return RecycleAnalysisResponse.builder()
                .dischargeRecordId(savedRecord.getId())
                .totalPoints(totalPoints)
                .totalCo2Reduction(totalCo2Reduction)
                .imageUrl(imageUrl)
                .items(itemDetails)
                .build();
    }
    
    /**
     * RecyclableItem을 DischargeItem 엔티티로 변환
     */
    private DischargeItem createDischargeItem(RecyclableItem recyclable) {
        DischargeItem item = new DischargeItem();
        
        item.setType(recyclable.getMaterialType());
        
        // Visual Analysis 정보를 float로 변환 (0.0 ~ 1.0 스케일로 가정)
        // cleanliness: "깨끗함" = 1.0, "오염됨" = 0.0
        float cleanliness = "깨끗함".equals(recyclable.getVisualAnalysis().getCleanliness()) ? 1.0f : 0.0f;
        item.setContamination(cleanliness);
        
        // label_status: "제거됨" = 1.0, "미제거" = 0.0
        float hasLabel = "제거됨".equals(recyclable.getVisualAnalysis().getLabelStatus()) ? 1.0f : 0.0f;
        item.setHasLabel(hasLabel);
        
        // color: "투명" = 1.0, "유색" = 0.5
        float colorType = "투명".equals(recyclable.getVisualAnalysis().getColor()) ? 1.0f : 0.5f;
        item.setColorType(colorType);
        
        // Grade (A, B, C, D -> Character)
        if (recyclable.getQualityGrade() != null && !recyclable.getQualityGrade().isEmpty()) {
            item.setGrade(recyclable.getQualityGrade().charAt(0));
        }
        
        // Points
        item.setItemPoint(recyclable.getCalculation().getPoints());
        
        item.setCreatedAt(Instant.now());
        
        return item;
    }
}
