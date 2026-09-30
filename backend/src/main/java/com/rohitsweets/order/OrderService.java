package com.rohitsweets.order;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rohitsweets.order.dto.CreateOrderRequest;
import com.rohitsweets.order.dto.OrderItemRequest;
import com.rohitsweets.product.Product;
import com.rohitsweets.product.ProductRepository;
import com.rohitsweets.settings.DeliveryBand;
import com.rohitsweets.settings.DeliveryBandRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final DeliveryBandRepository deliveryBandRepository;
    private final OrderNumberGenerator orderNumberGenerator;

    public OrderService(OrderRepository orderRepository,
                         ProductRepository productRepository,
                         DeliveryBandRepository deliveryBandRepository,
                         OrderNumberGenerator orderNumberGenerator) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.deliveryBandRepository = deliveryBandRepository;
        this.orderNumberGenerator = orderNumberGenerator;
    }

    @Transactional
    public Order create(CreateOrderRequest request) {
        DeliveryBand band = findBand(request.deliveryBandId());

        Map<Long, Product> productsById = productRepository
                .findAllById(request.items().stream().map(OrderItemRequest::productId).toList())
                .stream()
                .collect(java.util.stream.Collectors.toMap(Product::getId, Function.identity()));

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new java.util.ArrayList<>();

        for (OrderItemRequest itemRequest : request.items()) {
            Product product = productsById.get(itemRequest.productId());
            if (product == null) {
                throw new InvalidOrderException(
                        "Product " + itemRequest.productId() + " no longer exists. Please update your cart.");
            }
            if (!product.isActive() || !product.isAvailable()) {
                throw new InvalidOrderException(
                        "\"" + product.getName() + "\" is no longer available. Please remove it from your cart.");
            }
            if (product.getPrice() == null) {
                throw new InvalidOrderException(
                        "\"" + product.getName() + "\" does not have a price yet and cannot be ordered.");
            }

            BigDecimal lineTotal = product.getPrice()
                    .multiply(itemRequest.quantity())
                    .setScale(2, java.math.RoundingMode.HALF_UP);

            items.add(new OrderItem(
                    product.getId(), product.getName(), product.getUnit(),
                    product.getPrice(), itemRequest.quantity(), lineTotal
            ));
            subtotal = subtotal.add(lineTotal);
        }

        BigDecimal total = subtotal.add(band.getCharge());

        Order order = new Order(
                orderNumberGenerator.next(),
                request.customerName().trim(),
                request.phone(),
                request.address().trim(),
                request.landmark().trim(),
                blankToNull(request.instructions()),
                band.getFromKm().stripTrailingZeros().toPlainString() + "\u2013"
                        + band.getToKm().stripTrailingZeros().toPlainString() + " km",
                subtotal,
                band.getCharge(),
                total
        );
        items.forEach(order::addItem);

        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public Order getByOrderNumberOrThrow(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new OrderNotFoundException(orderNumber));
    }

    @Transactional(readOnly = true)
    public List<Order> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException("id " + id));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    private DeliveryBand findBand(String clientId) {
        return deliveryBandRepository.findAllByOrderByFromKmAsc().stream()
                .filter(b -> b.getClientId().equals(clientId))
                .findFirst()
                .orElseThrow(() -> new InvalidOrderException(
                        "Unknown delivery band. Please choose your distance again."));
    }

    private static String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}