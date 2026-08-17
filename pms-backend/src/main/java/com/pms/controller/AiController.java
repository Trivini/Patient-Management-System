package com.pms.controller;

import com.pms.dto.*;
import com.pms.security.CustomUserDetails;
import com.pms.service.AIService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
public class AiController {

    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(
            @Valid @RequestBody AiChatRequest request,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(aiService.chat(request, userDetails.getEmail(), userDetails.getRole()));
    }

    @PostMapping("/patient-summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'PATIENT')")
    public ResponseEntity<Map<String, String>> generatePatientSummary(
            @RequestBody Map<String, Long> payload,
            Authentication authentication) {
        Long patientId = payload.get("patientId");
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String summary = aiService.generatePatientSummary(patientId, userDetails.getEmail(), userDetails.getRole());
        return ResponseEntity.ok(Map.of("patientSummary", summary));
    }

    @PostMapping("/appointment-assistant")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT', 'DOCTOR')")
    public ResponseEntity<AiSlotResponse> appointmentAssistant(@RequestBody AiSlotRequest request) {
        return ResponseEntity.ok(aiService.recommendAppointmentSlots(request));
    }

    @PostMapping("/doctor-copilot")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public ResponseEntity<AiClinicalNoteResponse> doctorCopilot(@RequestBody AiClinicalNoteRequest request) {
        return ResponseEntity.ok(aiService.formatClinicalNote(request));
    }
}
