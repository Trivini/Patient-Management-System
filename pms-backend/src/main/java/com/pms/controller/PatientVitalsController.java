package com.pms.controller;

import com.pms.entity.Patient;
import com.pms.entity.PatientVitals;
import com.pms.repository.PatientRepository;
import com.pms.repository.PatientVitalsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vitals")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
@RequiredArgsConstructor
public class PatientVitalsController {

    private final PatientVitalsRepository patientVitalsRepository;
    private final PatientRepository patientRepository;

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<List<PatientVitals>> getPatientVitals(@PathVariable Long patientId) {
        return ResponseEntity.ok(patientVitalsRepository.findByPatientIdOrderByRecordedAtDesc(patientId));
    }

    @PostMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<PatientVitals> addPatientVitals(@PathVariable Long patientId, @RequestBody PatientVitals vitals) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id " + patientId));
        vitals.setPatient(patient);
        PatientVitals saved = patientVitalsRepository.save(vitals);
        return ResponseEntity.ok(saved);
    }
}
