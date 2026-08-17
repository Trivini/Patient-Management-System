package com.pms.service;

import com.pms.dto.JwtResponse;
import com.pms.dto.LoginRequest;
import com.pms.dto.RegisterRequest;

public interface AuthService {
    JwtResponse login(LoginRequest loginRequest);
    JwtResponse register(RegisterRequest registerRequest);
}
