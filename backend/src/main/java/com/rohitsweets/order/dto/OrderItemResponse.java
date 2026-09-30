package com.rohitsweets.order.dto;

import java.math.BigDecimal;

import com.rohitsweets.order.OrderItem;

public record OrderItemResponse(
        Long productId,
        String name,
        String unit,
        BigDecimal quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {
    public static OrderItemResponse from(OrderItem item) {
        return new OrderItemResponse(
                item.getProductId(), item.getProductName(), item.getUnit(),
                item.getQuantity(), item.getUnitPrice(), item.getLineTotal()
        );
    }
}