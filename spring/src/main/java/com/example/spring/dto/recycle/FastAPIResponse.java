package com.example.spring.dto.recycle;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class FastAPIResponse {
    @JsonProperty("recyclables")
    private List<RecyclableItem> recyclables;
}
