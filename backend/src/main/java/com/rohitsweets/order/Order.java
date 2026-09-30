package com.rohitsweets.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, unique = true, length = 20)
    private String orderNumber;

    @Column(name = "customer_name", nullable = false, length = 60)
    private String customerName;

    @Column(nullable = false, length = 10)
    private String phone;

    @Column(nullable = false, length = 300)
    private String address;

    @Column(nullable = false, length = 100)
    private String landmark;

    @Column(length = 200)
    private String instructions;

    @Column(name = "delivery_band", nullable = false, length = 30)
    private String deliveryBand;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "delivery_charge", nullable = false, precision = 10, scale = 2)
    private BigDecimal deliveryCharge;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "payment_method", nullable = false, length = 30)
    private String paymentMethod = "CASH_ON_DELIVERY";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<OrderItem> items = new ArrayList<>();
    protected Order() {
    }

    public Order(String orderNumber, String customerName, String phone, String address,
                 String landmark, String instructions, String deliveryBand,
                 BigDecimal subtotal, BigDecimal deliveryCharge, BigDecimal total) {
        this.orderNumber = orderNumber;
        this.customerName = customerName;
        this.phone = phone;
        this.address = address;
        this.landmark = landmark;
        this.instructions = instructions;
        this.deliveryBand = deliveryBand;
        this.subtotal = subtotal;
        this.deliveryCharge = deliveryCharge;
        this.total = total;
    }

    public void addItem(OrderItem item) {
        item.setOrder(this);
        items.add(item);
    }

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getOrderNumber() { return orderNumber; }
    public String getCustomerName() { return customerName; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getLandmark() { return landmark; }
    public String getInstructions() { return instructions; }
    public String getDeliveryBand() { return deliveryBand; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getDeliveryCharge() { return deliveryCharge; }
    public BigDecimal getTotal() { return total; }
    public String getPaymentMethod() { return paymentMethod; }
    public OrderStatus getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<OrderItem> getItems() { return items; }

    public void setStatus(OrderStatus status) { this.status = status; }
}