package com.example.spring.controller;

import com.example.spring.security.JwtTokenProvider;
import com.example.spring.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/info")
    public ResponseEntity<?> getInfo(@RequestParam Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }
}