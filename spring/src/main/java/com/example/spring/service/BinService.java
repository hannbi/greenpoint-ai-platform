package com.example.spring.service;

import com.example.spring.dto.BinRequest;
import com.example.spring.dto.BinResponse;
import com.example.spring.entity.Bin;
import com.example.spring.repository.BinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BinService {
    private final BinRepository binRepository;

    public List<BinResponse> findInBoundsAsDto(BinRequest request) {

        double xMin = Math.min(request.getMinX(), request.getMaxX());
        double xMax = Math.max(request.getMinX(), request.getMaxX());
        double yMin = Math.min(request.getMinY(), request.getMaxY());
        double yMax = Math.max(request.getMinY(), request.getMaxY());

        List<Bin> entities = binRepository.findWithinBounds(xMin, xMax, yMin, yMax); //추가

        return entities.stream()
                .map(this::toDto)
                .toList();
    }



    private BinResponse toDto(Bin c) {
        BinResponse dto = new BinResponse();
        dto.setName(c.getLocationName());
        dto.setLatitude(c.getLatitude());
        dto.setLongitude(c.getLongitude());
        dto.setImageUrl(c.getImageUrl());
        dto.setType(c.getType());
        dto.setOpen(c.getIsOpen());
        dto.setStatus(c.getStatus());

        return dto;
    }
}
