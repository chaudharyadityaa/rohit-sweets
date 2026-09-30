package com.rohitsweets.order;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.stereotype.Component;

@Component
public class OrderNumberGenerator {

    @PersistenceContext
    private EntityManager entityManager;

    /** Pulls the next value from the DB sequence created in V1__create_schema.sql. */
    public String next() {
        Number nextValue = (Number) entityManager
                .createNativeQuery("SELECT nextval('order_number_seq')")
                .getSingleResult();
        return "RS-" + nextValue.longValue();
    }
}