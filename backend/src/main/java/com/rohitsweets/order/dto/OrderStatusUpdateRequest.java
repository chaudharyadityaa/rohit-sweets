package com.rohitsweets.order.dto;

import jakarta.validation.constraints.NotNull;

import com.rohitsweets.order.OrderStatus;

public record OrderStatusUpdateRequest(
        @NotNull(message = "status is required")
        OrderStatus status
) {}