package com.rohitsweets.config;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Simple in-memory, per-IP rate limiting on the two public endpoints most
 * exposed to abuse: login attempts and order creation. Not a substitute for
 * a CDN/WAF at real scale, but enough to deter casual scripted abuse here.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> loginBuckets = new ConcurrentHashMap<>();
    private final Map<String, Bucket> orderBuckets = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String method = request.getMethod();
        String clientIp = resolveClientIp(request);

        Bucket bucket = null;
        if ("POST".equals(method) && path.equals("/api/auth/login")) {
            bucket = loginBuckets.computeIfAbsent(clientIp, ip -> newBucket(5, Duration.ofMinutes(1)));
        } else if ("POST".equals(method) && path.equals("/api/orders")) {
            bucket = orderBuckets.computeIfAbsent(clientIp, ip -> newBucket(20, Duration.ofMinutes(1)));
        }

        if (bucket != null && !bucket.tryConsume(1)) {
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write(
                "{\"status\":429,\"error\":\"Too Many Requests\","
                    + "\"message\":\"Too many attempts. Please wait a moment and try again.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private Bucket newBucket(int capacity, Duration period) {
        Bandwidth limit = Bandwidth.classic(capacity, Refill.greedy(capacity, period));
        return Bucket.builder().addLimit(limit).build();
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}