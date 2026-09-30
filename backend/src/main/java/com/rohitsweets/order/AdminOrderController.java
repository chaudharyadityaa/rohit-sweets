package com.rohitsweets.order;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rohitsweets.order.dto.OrderResponse;
import com.rohitsweets.order.dto.OrderStatusUpdateRequest;

/**
 * ADMIN endpoints. NOT protected yet — Checkpoint 13 adds JWT auth.
 * Do not deploy publicly before then.
 */
@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService service;

    public AdminOrderController(OrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<OrderResponse> list() {
        return service.findAll().stream().map(OrderResponse::from).toList();
    }

    @PatchMapping("/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id,
                                       @Valid @RequestBody OrderStatusUpdateRequest request) {
        return OrderResponse.from(service.updateStatus(id, request.status()));
    }
}