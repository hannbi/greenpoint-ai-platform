package com.example.spring.controller;

import com.example.spring.dto.recycle.FastAPIResponse;
import com.example.spring.dto.recycle.RecycleAnalysisResponse;
import com.example.spring.security.CustomUserDetails;
import com.example.spring.service.DischargeService;
import com.example.spring.service.RecycleAnalysisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/discharge")
@RequiredArgsConstructor
public class DischargeController {
    
    private final RecycleAnalysisService recycleAnalysisService;
    private final DischargeService dischargeService;
    
    /**
     * 재활용품 사진 파일을 직접 받아 FastAPI로 분석을 요청하고 결과를 저장 후 반환
     * @param request filename과 id를 포함한 요청 (파일명 기반)
     * @return 분석 결과 및 포인트 정보
     */
    @PostMapping("/analyze")
    public ResponseEntity<RecycleAnalysisResponse> analyzeRecyclables(
            @RequestBody Map<String, Object> request) {

        String filename = (String) request.get("filename");
        Long id = Long.valueOf(request.get("id").toString());
        
        try {
            log.info("Received recycle analysis request from user: {}, filename: {}", id, filename);
            
            // 1. 파일명 유효성 검사
            if (filename == null || filename.isEmpty()) {
                throw new IllegalArgumentException("파일명이 비어있습니다.");
            }
            
            // 2. FastAPI로 이미지 전송 및 분석 결과 수신
            FastAPIResponse fastAPIResponse = recycleAnalysisService.analyzeRecyclablesByFilename(filename);
            
            // 3. 분석 결과를 가공하고 DB에 저장
            RecycleAnalysisResponse response = dischargeService.processAndSaveAnalysis(
                    fastAPIResponse, id, filename);
            
            log.info("Successfully processed recycle analysis. Record ID: {}, Total Points: {}", 
                    response.getDischargeRecordId(), response.getTotalPoints());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error processing recycle analysis: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 재활용품 사진 파일을 직접 업로드하여 FastAPI로 분석 요청
     * @param image 업로드된 이미지 파일
     * @param id 사용자 ID
     * @return 분석 결과 및 포인트 정보
     */
    @PostMapping(value = "/analyze-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecycleAnalysisResponse> analyzeRecyclablesUpload(
            @RequestPart("image") MultipartFile image,
            @RequestParam("id") Long id) {

        try {
            String filename = image.getOriginalFilename();
            log.info("Received recycle analysis upload request from user: {}, file: {}", id, filename);

            // 1. 이미지 유효성 검사
            if (image.isEmpty() || filename == null || filename.isEmpty()) {
                throw new IllegalArgumentException("이미지 파일이 비어있습니다.");
            }

            // 2. FastAPI로 이미지 전송 및 분석 결과 수신 (실제 파일 사용)
            FastAPIResponse fastAPIResponse = recycleAnalysisService.analyzeRecyclablesDirect(image);
            
            // 3. 분석 결과를 가공하고 DB에 저장
            RecycleAnalysisResponse response = dischargeService.processAndSaveAnalysis(
                    fastAPIResponse, id, filename);
            
            log.info("Successfully processed recycle analysis. Record ID: {}, Total Points: {}", 
                    response.getDischargeRecordId(), response.getTotalPoints());
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error processing recycle analysis: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 테스트용 엔드포인트 (인증 없이 사용 가능하도록 별도 구성 필요)
     */
    @PostMapping(value = "/analyze-test", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RecycleAnalysisResponse> analyzeRecyclablesTest(
            @RequestPart("image") MultipartFile image,
            @RequestParam(defaultValue = "1") Long memberId) {
        
        try {
            String filename = image.getOriginalFilename();
            log.info("Received test recycle analysis request for member: {}, file: {}", 
                    memberId, filename);
            
            if (image.isEmpty() || filename == null || filename.isEmpty()) {
                throw new IllegalArgumentException("이미지 파일이 비어있습니다.");
            }
            
            // FastAPI로 이미지 전송 및 분석
            FastAPIResponse fastAPIResponse = recycleAnalysisService.analyzeRecyclables(image);
            
            // 분석 결과 가공 및 저장
            RecycleAnalysisResponse response = dischargeService.processAndSaveAnalysis(
                    fastAPIResponse, memberId, filename);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error in test analysis: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    /**
     * 이미지 파일을 반환하는 엔드포인트
     * @param filename resources/image/ 폴더에 있는 파일명
     * @return 이미지 바이트 배열
     */
    @GetMapping("/image/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            log.info("Requesting image: {}", filename);
            
            byte[] imageBytes = recycleAnalysisService.getImageBytes(filename);
            
            if (imageBytes == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Content-Type 설정 (파일 확장자에 따라)
            HttpHeaders headers = new HttpHeaders();
            if (filename.toLowerCase().endsWith(".png")) {
                headers.setContentType(MediaType.IMAGE_PNG);
            } else if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
                headers.setContentType(MediaType.IMAGE_JPEG);
            } else if (filename.toLowerCase().endsWith(".gif")) {
                headers.setContentType(MediaType.IMAGE_GIF);
            } else {
                headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            }
            
            return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
            
        } catch (Exception e) {
            log.error("Error retrieving image: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
