package com.pms;

import com.pms.dto.JwtResponse;
import com.pms.dto.LoginRequest;
import com.pms.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Test
    public void testAdminLoginSuccess() {
        LoginRequest request = new LoginRequest("admin@pms.com", "Admin@123");
        JwtResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("admin@pms.com", response.getEmail());
        assertEquals("ROLE_ADMIN", response.getRole());
    }

    @Test
    public void testDoctorLoginSuccess() {
        LoginRequest request = new LoginRequest("doctor@pms.com", "Doctor@123");
        JwtResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("doctor@pms.com", response.getEmail());
        assertEquals("ROLE_DOCTOR", response.getRole());
    }
}
