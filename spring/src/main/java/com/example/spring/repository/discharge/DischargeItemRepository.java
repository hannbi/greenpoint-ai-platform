package com.example.spring.repository.discharge;

import com.example.spring.entity.discharge.DischargeItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DischargeItemRepository extends JpaRepository<DischargeItem, Long> {

}
