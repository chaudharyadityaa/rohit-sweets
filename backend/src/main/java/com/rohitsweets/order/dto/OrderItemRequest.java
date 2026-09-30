package com.rohitsweets.order.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotNull(message = "productId is required")
        Long productId,

        @NotNull(message = "quantity is required")
        @DecimalMin(value = "0.01", message = "quantity must be greater than 0")
        BigDecimal quantity
) {}