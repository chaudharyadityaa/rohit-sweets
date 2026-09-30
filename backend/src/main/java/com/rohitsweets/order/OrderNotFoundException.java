package com.rohitsweets.order;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(String reference) {
        super("No order found for " + reference);
    }
}