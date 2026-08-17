package com.pms.controller;

import com.pms.dto.AdminDashboardDto;
import com.pms.dto.DoctorDashboardDto;
import com.pms.dto.PatientDashboardDto;
import com.pms.dto.ReceptionistDashboardDto;
import com.pms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardDto> getAdminDashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboardData());
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<DoctorDashboardDto> getDoctorDashboard(
            @RequestParam(required = false) Long doctorId,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(dashboardService.getDoctorDashboardData(doctorId, email));
    }

    @GetMapping("/receptionist")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public ResponseEntity<ReceptionistDashboardDto> getReceptionistDashboard() {
        return ResponseEntity.ok(dashboardService.getReceptionistDashboardData());
    }

    @GetMapping("/patient")
    @PreAuthorize("hasAnyRole('ADMIN', 'PATIENT')")
    public ResponseEntity<PatientDashboardDto> getPatientDashboard(
            @RequestParam(required = false) Long patientId,
            Authentication authentication) {
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(dashboardService.getPatientDashboardData(patientId, email));
    }

    @GetMapping("/analytics/advanced")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<java.util.Map<String, Object>> getAdvancedAnalytics() {
        return ResponseEntity.ok(dashboardService.getAdvancedAnalyticsData());
    }
}
