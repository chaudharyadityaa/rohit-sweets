package com.rohitsweets.product;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rohitsweets.product.dto.AvailabilityRequest;
import com.rohitsweets.product.dto.ProductRequest;
import com.rohitsweets.product.dto.ProductResponse;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // ---- Public (storefront) ----

    @GetMapping
    public List<ProductResponse> list(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "false") boolean includeInactive,
            org.springframework.security.core.Authentication authentication
    ) {
        boolean isAdmin = authentication != null && authentication.isAuthenticated();
        if (includeInactive && isAdmin) {
            return service.findAllForAdmin().stream().map(ProductResponse::from).toList();
        }
        return service.findVisible(category, q).stream()
                .map(ProductResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ProductResponse getOne(@PathVariable Long id) {
        return ProductResponse.from(service.getVisibleOrThrow(id));
    }

    // ---- Admin (NOT protected yet — Checkpoint 13 adds auth) ----

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        Product created = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ProductResponse.from(created));
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return ProductResponse.from(service.update(id, request));
    }

    @PatchMapping("/{id}/availability")
    public ProductResponse setAvailability(
            @PathVariable Long id,
            @Valid @RequestBody AvailabilityRequest request
    ) {
        return ProductResponse.from(service.setAvailability(id, request.available()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.softDelete(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/{id}/reactivate")
    public ProductResponse reactivate(@PathVariable Long id) {
        return ProductResponse.from(service.reactivate(id));
    }
}