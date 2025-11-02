package com.example.spring.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class OpenAIConfig {

    @Value("${OPENAI_API_KEY}")
    private String openaiApiKey;

    @Bean
    public RestTemplate openaiRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.getInterceptors().add((request, body, execution) -> {
            request.getHeaders().add("Authorization", "Bearer " + openaiApiKey);
            request.getHeaders().add("Content-Type", "application/json");
            return execution.execute(request, body);
        });
        return restTemplate;
    }
}
