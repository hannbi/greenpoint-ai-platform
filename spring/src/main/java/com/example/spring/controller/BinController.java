package com.example.spring.controller;

import com.example.spring.dto.BinRequest;
import com.example.spring.dto.BinResponse;
import com.example.spring.service.BinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bin")
@RequiredArgsConstructor
public class BinController {

    private final BinService binService;

    @GetMapping("/get")
    public ResponseEntity<List<BinResponse>> bin(@ModelAttribute BinRequest req) {
        return ResponseEntity.of(Optional.ofNullable(binService.findInBoundsAsDto(req)));
    }
}
