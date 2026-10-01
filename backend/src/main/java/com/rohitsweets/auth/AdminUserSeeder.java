package com.rohitsweets.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Creates the first admin account on startup, only if admin_users is empty AND
 * ADMIN_PASSWORD is set. This avoids ever shipping a hardcoded default password.
 */
@Component
public class AdminUserSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminUserSeeder.class);

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-username:admin}")
    private String defaultUsername;

    @Value("${app.admin.default-password:}")
    private String defaultPassword;

    public AdminUserSeeder(AdminUserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (repository.count() > 0) {
            return;
        }
        if (defaultPassword == null || defaultPassword.isBlank()) {
            log.warn("No admin account exists yet, and ADMIN_PASSWORD is not set. "
                    + "Set ADMIN_PASSWORD and restart the app to create the first admin login.");
            return;
        }
        repository.save(new AdminUser(defaultUsername, passwordEncoder.encode(defaultPassword)));
        log.info("Created initial admin account '{}'.", defaultUsername);
    }
}