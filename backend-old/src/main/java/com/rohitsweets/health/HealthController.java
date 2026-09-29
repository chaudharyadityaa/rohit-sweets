package com.rohitsweets.health;

import java.time.Instant;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    public record HealthResponse(String status, String service, String time) {}

    @GetMapping
    public HealthResponse health() {
        return new HealthResponse("UP", "rohit-sweets-backend", Instant.now().toString());
    }
}