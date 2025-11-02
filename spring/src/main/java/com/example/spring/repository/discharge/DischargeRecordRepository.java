package com.example.spring.repository.discharge;

import com.example.spring.entity.discharge.DischargeRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DischargeRecordRepository extends JpaRepository<DischargeRecord, Long> {

}
