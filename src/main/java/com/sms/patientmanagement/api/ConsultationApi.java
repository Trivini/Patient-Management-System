package com.sms.patientmanagement.api;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sms.patientmanagement.entity.Consultation;
import com.sms.patientmanagement.repo.ConsultationRepo;

@RestController
@RequestMapping("/api/consultations")
@CrossOrigin(origins = "*")
public class ConsultationApi {

    private final ConsultationRepo repo;

    public ConsultationApi(ConsultationRepo repo) {
        this.repo = repo;
    }

    // CREATE notes
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Consultation c) {
        if (c.getAppointmentId() == null) {
            return ResponseEntity.badRequest().body("appointmentId required");
        }
        c.setCreatedAt(LocalDateTime.now().toString());
        return ResponseEntity.ok(repo.save(c));
    }

    // LIST by appointment id
    @GetMapping("/by-appointment/{appointmentId}")
    public ResponseEntity<List<Consultation>> byAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(repo.findByAppointmentId(appointmentId));
    }
}