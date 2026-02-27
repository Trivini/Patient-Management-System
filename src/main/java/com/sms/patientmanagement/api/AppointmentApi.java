package com.sms.patientmanagement.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sms.patientmanagement.entity.Appointment;
import com.sms.patientmanagement.repo.AppointmentRepo;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentApi {

    private final AppointmentRepo repo;

    public AppointmentApi(AppointmentRepo repo) {
        this.repo = repo;
    }

    // CREATE appointment
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Appointment a) {
        if (a.getStatus() == null || a.getStatus().isBlank()) {
            a.setStatus("BOOKED");
        }
        return ResponseEntity.ok(repo.save(a));
    }

    // LIST all
    @GetMapping
    public ResponseEntity<List<Appointment>> all() {
        return ResponseEntity.ok(repo.findAll());
    }

    // UPDATE status only
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return repo.findById(id).map(ap -> {
            ap.setStatus(status);
            return ResponseEntity.ok(repo.save(ap));
        }).orElse(ResponseEntity.badRequest().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.badRequest().body("Appointment not found");
        repo.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }
}