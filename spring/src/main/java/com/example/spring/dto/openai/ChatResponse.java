package com.example.spring.dto.openai;


import lombok.Getter;

import java.awt.*;
import java.util.List;

@Getter
public class ChatResponse {
    private List<Choice> choices;

    @Getter
    public static class Choice {
        // 생성된 메세지 정보
        private Message message;
    }
}
