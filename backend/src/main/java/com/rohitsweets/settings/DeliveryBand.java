package com.rohitsweets.settings;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "delivery_bands")
public class DeliveryBand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_km", nullable = false, precision = 4, scale = 1)
    private BigDecimal fromKm;

    @Column(name = "to_km", nullable = false, precision = 4, scale = 1)
    private BigDecimal toKm;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal charge;

    protected DeliveryBand() {
    }

    public Long getId() { return id; }
    public BigDecimal getFromKm() { return fromKm; }
    public BigDecimal getToKm() { return toKm; }
    public BigDecimal getCharge() { return charge; }

    /** Matches the frontend's band id format, e.g. "0-3", "3-5". */
    public String getClientId() {
        return stripTrailingZero(fromKm) + "-" + stripTrailingZero(toKm);
    }

    private static String stripTrailingZero(BigDecimal value) {
        return value.stripTrailingZeros().toPlainString();
    }
}