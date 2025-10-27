package com.example.spring.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @Email @NotBlank String email,
        @Size(min=8, max=64) String password,
        @Size(max=30) String name,
        @NotBlank String ticket
) {}

