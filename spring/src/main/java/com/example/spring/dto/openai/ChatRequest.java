package com.example.spring.dto.openai;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatRequest {
    private String model;
    private List<Message> messages;
    private Integer n;
    private Double temperature;

    public <E> ChatRequest(String s, List<E> user, int i, double v) {
    }

    public ChatRequest() {

    }
}
