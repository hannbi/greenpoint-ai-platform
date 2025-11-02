package com.example.spring.controller;

import com.example.spring.entity.Organization;
import com.example.spring.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/organization")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationRepository organizationRepository;

    @GetMapping("/name")
    public ResponseEntity<List<String>> getOrganizationName() {
        List<String> names = organizationRepository.findAll()
                .stream()
                .map(Organization::getName)
                .toList();
        return ResponseEntity.ok(names);
    }
}
