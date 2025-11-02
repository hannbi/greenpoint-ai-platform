package com.example.spring.service;

import com.example.spring.dto.recycle.FastAPIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecycleAnalysisService {
    
    @Value("${fastapi.url}")
    private String fastApiUrl;
    
    private final RestClient restClient;
    
    /**
     * 프론트에서 직접 업로드한 이미지 파일을 FastAPI로 전송
     * @param imageFile 업로드된 이미지 파일
     * @return FastAPI의 분석 결과
     */
    public FastAPIResponse analyzeRecyclablesDirect(MultipartFile imageFile) {
        try {
            String filename = imageFile.getOriginalFilename();
            log.info("Sending uploaded image to FastAPI. File: {}, Size: {} bytes", 
                    filename, imageFile.getSize());
            
            // MultipartFile을 ByteArrayResource로 변환
            ByteArrayResource resource = new ByteArrayResource(imageFile.getBytes()) {
                @Override
                public String getFilename() {
                    return filename;
                }
            };
            
            // Multipart 요청 바디 구성
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", resource);
            
            // FastAPI로 POST 요청
            FastAPIResponse response = restClient.post()
                    .uri(fastApiUrl + "/analyze")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(FastAPIResponse.class);
            
            log.info("Received response from FastAPI. Items count: {}", 
                    response != null && response.getRecyclables() != null 
                            ? response.getRecyclables().size() 
                            : 0);
            
            return response;
            
        } catch (IOException e) {
            log.error("Error reading uploaded file: {}", e.getMessage(), e);
            throw new RuntimeException("업로드된 파일 읽기 오류: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error while calling FastAPI: {}", e.getMessage(), e);
            throw new RuntimeException("FastAPI 호출 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
    
    /**
     * FastAPI로 이미지를 전송하고 재활용품 분석 결과를 받아옴
     * @param filename resources/image/ 폴더에 있는 파일명 (확장자 포함 또는 미포함)
     * @return FastAPI의 분석 결과
     */
    public FastAPIResponse analyzeRecyclablesByFilename(String filename) {
        try {
            log.info("Processing filename: {}", filename);
            
            // 확장자가 없으면 여러 확장자를 시도
            String[] extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"};
            Resource imageResource = null;
            String actualFilename = filename;
            
            // 먼저 원본 파일명으로 시도
            imageResource = new ClassPathResource("image/" + filename);
            
            // 파일이 없고 확장자가 없으면 여러 확장자 시도
            if (!imageResource.exists() && !filename.contains(".")) {
                log.info("File not found with original name. Trying with extensions...");
                for (String ext : extensions) {
                    String filenameWithExt = filename + ext;
                    imageResource = new ClassPathResource("image/" + filenameWithExt);
                    if (imageResource.exists()) {
                        actualFilename = filenameWithExt;
                        log.info("Found file with extension: {}", actualFilename);
                        break;
                    }
                }
            }
            
            if (!imageResource.exists()) {
                log.error("Image file not found in resources/image/: {}", filename);
                throw new RuntimeException("이미지 파일을 찾을 수 없습니다: " + filename);
            }
            
            log.info("Found image in resources/image/. Sending to FastAPI: {}", actualFilename);
            
            // Resource를 ByteArrayResource로 변환
            byte[] imageBytes = Files.readAllBytes(imageResource.getFile().toPath());
            String finalActualFilename = actualFilename;
            ByteArrayResource resource = new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return finalActualFilename;
                }
            };
            
            // Multipart 요청 바디 구성
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", resource);
            
            // FastAPI로 POST 요청
            FastAPIResponse response = restClient.post()
                    .uri(fastApiUrl + "/analyze")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(FastAPIResponse.class);
            
            log.info("Received response from FastAPI. Items count: {}", 
                    response != null && response.getRecyclables() != null 
                            ? response.getRecyclables().size() 
                            : 0);
            
            return response;
            
        } catch (IOException e) {
            log.error("Error reading image file: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 파일 읽기 오류: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error while calling FastAPI: {}", e.getMessage(), e);
            throw new RuntimeException("FastAPI 호출 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
    
    /**
     * FastAPI로 이미지를 전송하고 재활용품 분석 결과를 받아옴 (MultipartFile 사용)
     * @param imageFile 프론트엔드에서 받은 이미지 파일 (파일명만 사용)
     * @return FastAPI의 분석 결과
     */
    public FastAPIResponse analyzeRecyclables(MultipartFile imageFile) {
        try {
            String filename = imageFile.getOriginalFilename();
            log.info("Received filename from frontend: {}", filename);
            
            // resources/image/ 폴더에서 같은 이름의 파일 찾기
            Resource imageResource = new ClassPathResource("image/" + filename);
            
            if (!imageResource.exists()) {
                log.error("Image file not found in resources/image/: {}", filename);
                throw new RuntimeException("이미지 파일을 찾을 수 없습니다: " + filename);
            }
            
            log.info("Found image in resources/image/. Sending to FastAPI: {}", filename);
            
            // Resource를 ByteArrayResource로 변환
            byte[] imageBytes = Files.readAllBytes(imageResource.getFile().toPath());
            ByteArrayResource resource = new ByteArrayResource(imageBytes) {
                @Override
                public String getFilename() {
                    return filename;
                }
            };
            
            // Multipart 요청 바디 구성
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", resource);
            
            // FastAPI로 POST 요청
            FastAPIResponse response = restClient.post()
                    .uri(fastApiUrl + "/analyze")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(FastAPIResponse.class);
            
            log.info("Received response from FastAPI. Items count: {}", 
                    response != null && response.getRecyclables() != null 
                            ? response.getRecyclables().size() 
                            : 0);
            
            return response;
            
        } catch (IOException e) {
            log.error("Error reading image file: {}", e.getMessage(), e);
            throw new RuntimeException("이미지 파일 읽기 오류: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("Error while calling FastAPI: {}", e.getMessage(), e);
            throw new RuntimeException("FastAPI 호출 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }
    
    /**
     * resources/image/ 폴더에서 이미지 파일을 읽어 byte[]로 반환
     * @param filename 파일명
     * @return 이미지 바이트 배열
     */
    public byte[] getImageBytes(String filename) {
        try {
            Resource imageResource = new ClassPathResource("image/" + filename);
            if (!imageResource.exists()) {
                log.warn("Image file not found: {}", filename);
                return null;
            }
            return Files.readAllBytes(imageResource.getFile().toPath());
        } catch (IOException e) {
            log.error("Error reading image file: {}", e.getMessage(), e);
            return null;
        }
    }
}
