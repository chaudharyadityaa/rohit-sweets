package com.rohitsweets.product;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.rohitsweets.product.dto.ProductRequest;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Product> findVisible(String category, String search) {
        boolean hasCategory = category != null && !category.isBlank();
        boolean hasSearch = search != null && !search.isBlank();

        if (hasCategory && hasSearch) {
            return repository.findByActiveTrueAndCategoryIgnoreCaseAndNameContainingIgnoreCaseOrderByIdAsc(
                    category, search);
        }
        if (hasCategory) {
            return repository.findByActiveTrueAndCategoryIgnoreCaseOrderByIdAsc(category);
        }
        if (hasSearch) {
            return repository.findByActiveTrueAndNameContainingIgnoreCaseOrderByIdAsc(search);
        }
        return repository.findByActiveTrueOrderByIdAsc();
    }

    @Transactional(readOnly = true)
    public Product getVisibleOrThrow(Long id) {
        Product product = repository.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return product;
    }
    
    @Transactional(readOnly = true)
    public List<Product> findAllForAdmin() {
        return repository.findAllByOrderByIdAsc();
    }

    @Transactional
    public Product create(ProductRequest request) {
        Product product = new Product(
                request.name().trim(),
                request.description(),
                request.price(),
                request.unit(),
                request.imageUrl(),
                request.category().trim(),
                request.featured()
        );
        return repository.save(product);
    }

    @Transactional
    public Product update(Long id, ProductRequest request) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        product.setName(request.name().trim());
        product.setDescription(request.description());
        product.setPrice(request.price());
        if (request.unit() != null && !request.unit().isBlank()) {
            product.setUnit(request.unit());
        }
        product.setImageUrl(request.imageUrl());
        product.setCategory(request.category().trim());
        product.setFeatured(request.featured());

        return repository.save(product);
    }

    @Transactional
    public Product setAvailability(Long id, boolean available) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        product.setAvailable(available);
        return repository.save(product);
    }

    /** Soft delete: keeps the row (and history in past orders) but hides it everywhere. */
    @Transactional
    public void softDelete(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        product.setActive(false);
        repository.save(product);
    }
    
    @Transactional
    public Product reactivate(Long id) {
        Product product = repository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        product.setActive(true);
        return repository.save(product);
    }
}