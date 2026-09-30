package com.rohitsweets.order.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.rohitsweets.order.Order;
import com.rohitsweets.order.OrderStatus;

public record OrderResponse(
        Long id,
        String orderNumber,
        String customerName,
        String phone,
        String address,
        String landmark,
        String instructions,
        String deliveryBand,
        BigDecimal subtotal,
        BigDecimal deliveryCharge,
        BigDecimal total,
        String paymentMethod,
        OrderStatus status,
        Instant createdAt,
        Instant updatedAt,
        List<OrderItemResponse> items
) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(), order.getOrderNumber(), order.getCustomerName(), order.getPhone(),
                order.getAddress(), order.getLandmark(), order.getInstructions(),
                order.getDeliveryBand(), order.getSubtotal(), order.getDeliveryCharge(),
                order.getTotal(), order.getPaymentMethod(), order.getStatus(),
                order.getCreatedAt(), order.getUpdatedAt(),
                order.getItems().stream().map(OrderItemResponse::from).toList()
        );
    }
}