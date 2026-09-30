package com.rohitsweets.product.dto;

import java.math.BigDecimal;
import java.time.Instant;

import com.rohitsweets.product.Product;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String unit,
        String imageUrl,
        String category,
        boolean available,
        boolean featured,
        Instant createdAt,
        Instant updatedAt
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getUnit(),
                p.getImageUrl(), p.getCategory(), p.isAvailable(), p.isFeatured(),
                p.getCreatedAt(), p.getUpdatedAt()
        );
    }
}