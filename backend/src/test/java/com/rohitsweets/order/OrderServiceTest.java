package com.rohitsweets.order;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.rohitsweets.order.dto.CreateOrderRequest;
import com.rohitsweets.order.dto.OrderItemRequest;

@SpringBootTest
class OrderServiceTest {

    @Autowired
    OrderService orderService;

    @Test
    void createsOrderWithServerCalculatedTotals() {
        // Ghewar (id=1) is seeded at Rs 400/kg with a confirmed price.
        CreateOrderRequest request = new CreateOrderRequest(
                "Test Customer",
                "9876543210",
                "123 Test Street, Test Area, Baraut",
                "Near Test Landmark",
                "Leave at the gate",
                "3-5",
                true,
                List.of(new OrderItemRequest(1L, new BigDecimal("2")))
        );

        Order order = orderService.create(request);

        assertThat(order.getOrderNumber()).startsWith("RS-");
        assertThat(order.getSubtotal()).isEqualByComparingTo("800.00");
        assertThat(order.getDeliveryCharge()).isEqualByComparingTo("50.00");
        assertThat(order.getTotal()).isEqualByComparingTo("850.00");
        assertThat(order.getStatus()).isEqualTo(OrderStatus.PENDING);
        assertThat(order.getItems()).hasSize(1);
        assertThat(order.getItems().get(0).getProductName()).isEqualTo("Ghewar");

        Order fetched = orderService.getByOrderNumberOrThrow(order.getOrderNumber());
        assertThat(fetched.getId()).isEqualTo(order.getId());
    }

    @Test
    void rejectsOrderForProductWithoutPrice() {
        // Barfi (id=3) is seeded with a NULL price.
        CreateOrderRequest request = new CreateOrderRequest(
                "Test Customer", "9876543210", "123 Test Street, Test Area, Baraut",
                "Near Test Landmark", null, "0-3", true,
                List.of(new OrderItemRequest(3L, new BigDecimal("1")))
        );

        assertThatThrownBy(() -> orderService.create(request))
                .isInstanceOf(InvalidOrderException.class)
                .hasMessageContaining("does not have a price");
    }

    @Test
    void rejectsUnknownDeliveryBand() {
        CreateOrderRequest request = new CreateOrderRequest(
                "Test Customer", "9876543210", "123 Test Street, Test Area, Baraut",
                "Near Test Landmark", null, "99-100", true,
                List.of(new OrderItemRequest(1L, new BigDecimal("1")))
        );

        assertThatThrownBy(() -> orderService.create(request))
                .isInstanceOf(InvalidOrderException.class)
                .hasMessageContaining("Unknown delivery band");
    }

    @Test
    void updatesOrderStatus() {
        CreateOrderRequest request = new CreateOrderRequest(
                "Test Customer", "9876543210", "123 Test Street, Test Area, Baraut",
                "Near Test Landmark", null, "0-3", true,
                List.of(new OrderItemRequest(1L, new BigDecimal("1")))
        );
        Order order = orderService.create(request);

        Order updated = orderService.updateStatus(order.getId(), OrderStatus.CONFIRMED);

        assertThat(updated.getStatus()).isEqualTo(OrderStatus.CONFIRMED);
    }
}