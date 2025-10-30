package com.example.spring.repository;

import com.example.spring.dto.BinRequest;
import com.example.spring.dto.BinResponse;
import com.example.spring.entity.Bin;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BinRepository extends JpaRepository <Bin, Long> {

    @Query("""
        SELECT b FROM Bin b
        WHERE b.latitude IS NOT NULL
          AND b.longitude IS NOT NULL
          AND b.latitude BETWEEN :minY AND :maxY
          AND b.longitude BETWEEN :minX AND :maxX
    """)
    List<Bin> findWithinBounds(@Param("minX") Double minX,
                               @Param("maxX") Double maxX,
                               @Param("minY") Double minY,
                               @Param("maxY") Double maxY);

}
