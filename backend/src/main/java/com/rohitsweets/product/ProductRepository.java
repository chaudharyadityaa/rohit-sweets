package com.rohitsweets.product;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByActiveTrueOrderByIdAsc();

    List<Product> findByActiveTrueAndCategoryIgnoreCaseOrderByIdAsc(String category);

    List<Product> findByActiveTrueAndNameContainingIgnoreCaseOrderByIdAsc(String namePart);

    List<Product> findByActiveTrueAndCategoryIgnoreCaseAndNameContainingIgnoreCaseOrderByIdAsc(
            String category, String namePart);
    
    List<Product> findAllByOrderByIdAsc();
}