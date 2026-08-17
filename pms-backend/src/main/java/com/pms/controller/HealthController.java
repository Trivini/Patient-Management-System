package com.pms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "MediFlow PMS Backend API");
        status.put("timestamp", LocalDateTime.now().toString());
        status.put("environment", "Production / Live");
        return ResponseEntity.ok(status);
    }
}
