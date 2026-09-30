package com.rohitsweets.product;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(Long id) {
        super("No product found with id " + id);
    }
}