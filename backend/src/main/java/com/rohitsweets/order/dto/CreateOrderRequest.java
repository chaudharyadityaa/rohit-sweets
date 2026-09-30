package com.rohitsweets.order.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 60, message = "Name must be 60 characters or fewer")
        String customerName,

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number")
        String phone,

        @NotBlank(message = "Address is required")
        @Size(min = 10, max = 300, message = "Address must be between 10 and 300 characters")
        String address,

        @NotBlank(message = "Landmark is required")
        @Size(min = 3, max = 100, message = "Landmark must be between 3 and 100 characters")
        String landmark,

        @Size(max = 200, message = "Instructions must be 200 characters or fewer")
        String instructions,

        @NotBlank(message = "Delivery band is required")
        String deliveryBandId,

        @AssertTrue(message = "You must confirm your address is within the delivery area")
        boolean inServiceArea,

        @NotEmpty(message = "Cart cannot be empty")
        @Valid
        List<OrderItemRequest> items
) {}