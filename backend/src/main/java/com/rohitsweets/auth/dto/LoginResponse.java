package com.rohitsweets.auth.dto;

public record LoginResponse(String token, String username, long expiresInMinutes) {}