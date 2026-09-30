package com.rohitsweets.settings;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DeliveryBandRepository extends JpaRepository<DeliveryBand, Long> {
    List<DeliveryBand> findAllByOrderByFromKmAsc();
}