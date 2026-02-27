package com.sms.patientmanagement.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.sms.patientmanagement.entity.Patient;
import com.sms.patientmanagement.repo.PatientRepo;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientApi {

    private final PatientRepo repo;

    public PatientApi(PatientRepo repo) {
        this.repo = repo;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Patient> create(@Valid @RequestBody Patient patient) {
        return ResponseEntity.ok(repo.save(patient));
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Patient>> all() {
        return ResponseEntity.ok(repo.findAll());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> one(@PathVariable Long id) {
        return repo.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().body("Patient not found"));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody Patient body) {

        return repo.findById(id).map(p -> {

            p.setFullName(body.getFullName());
            p.setGender(body.getGender());
            p.setDob(body.getDob());
            p.setPhone(body.getPhone());
            p.setAddress(body.getAddress());

            return ResponseEntity.ok(repo.save(p));

        }).orElse(ResponseEntity.badRequest().build());
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.badRequest().body("Patient not found");
        repo.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }
}