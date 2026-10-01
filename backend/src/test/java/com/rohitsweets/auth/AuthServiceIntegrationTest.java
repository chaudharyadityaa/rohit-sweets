package com.rohitsweets.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.rohitsweets.auth.dto.LoginRequest;

@SpringBootTest
class AuthServiceIntegrationTest {

    @Autowired
    AuthController authController;

    @Autowired
    AdminUserRepository adminUserRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtService jwtService;

    @Value("${app.admin.default-username:admin}")
    String seededUsername;

    @Value("${app.admin.default-password:}")
    String seededPassword;

    @Test
    void seededAdminAccountExists() {
        assertThat(adminUserRepository.findByUsername(seededUsername)).isPresent();
    }

    @Test
    void loginWithCorrectCredentialsReturnsValidToken() {
        // Only runs meaningfully if ADMIN_PASSWORD was set when the app started.
        if (seededPassword == null || seededPassword.isBlank()) return;

        var response = authController.login(new LoginRequest(seededUsername, seededPassword));

        assertThat(response.token()).isNotBlank();
        assertThat(response.username()).isEqualTo(seededUsername);
        assertThat(jwtService.isValid(response.token())).isTrue();
        assertThat(jwtService.extractUsername(response.token())).isEqualTo(seededUsername);
    }

    @Test
    void loginWithWrongPasswordThrowsBadCredentials() {
        assertThatThrownBy(() -> authController.login(new LoginRequest(seededUsername, "definitely-wrong")))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void loginWithUnknownUsernameThrowsBadCredentials() {
        assertThatThrownBy(() -> authController.login(new LoginRequest("nonexistent-user", "whatever")))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void jwtServiceRejectsTamperedToken() {
        String realToken = jwtService.generateToken(seededUsername);
        String tamperedToken = realToken.substring(0, realToken.length() - 4) + "abcd";

        assertThat(jwtService.isValid(tamperedToken)).isFalse();
    }
}