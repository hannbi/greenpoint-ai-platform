package com.example.spring.controller;

import com.example.spring.service.OpenAIService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIController {

    private final OpenAIService openAIService;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody Map<String, String> request) throws JsonProcessingException {
        String prompt = request.get("prompt");
        String answer = openAIService.ask(prompt);
        return ResponseEntity.ok(answer);
    }
}
