package com.rohitsweets.product;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ProductRepositoryTest {

    @Autowired
    ProductRepository repository;

    @Test
    void seedDataIsLoaded() {
        List<Product> products = repository.findByActiveTrueOrderByIdAsc();

        assertThat(products).hasSize(23);

        Product ghewar = products.get(0);
        assertThat(ghewar.getName()).isEqualTo("Ghewar");
        assertThat(ghewar.getPrice()).isEqualByComparingTo(new BigDecimal("400"));

        // No invented prices: everything except Ghewar is null
        assertThat(products.stream().skip(1)).allMatch(p -> p.getPrice() == null);
    }
}