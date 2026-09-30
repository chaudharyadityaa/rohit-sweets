package com.rohitsweets.order;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    /** Snapshot at order time. Changing the product later never rewrites this row. */
    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal quantity;

    @Column(name = "line_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;

    protected OrderItem() {
    }

    public OrderItem(Long productId, String productName, String unit,
                      BigDecimal unitPrice, BigDecimal quantity, BigDecimal lineTotal) {
        this.productId = productId;
        this.productName = productName;
        this.unit = unit;
        this.unitPrice = unitPrice;
        this.quantity = quantity;
        this.lineTotal = lineTotal;
    }

    void setOrder(Order order) { this.order = order; }

    public Long getId() { return id; }
    public Order getOrder() { return order; }
    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getUnit() { return unit; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getQuantity() { return quantity; }
    public BigDecimal getLineTotal() { return lineTotal; }
}