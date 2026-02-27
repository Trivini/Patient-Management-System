package com.sms.patientmanagement.api;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sms.patientmanagement.entity.DocumentFile;
import com.sms.patientmanagement.repo.DocumentRepo;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentApi {

    private final DocumentRepo repo;
    private final String uploadDir = "uploads";

    public DocumentApi(DocumentRepo repo) {
        this.repo = repo;
        new File(uploadDir).mkdirs(); // create folder if not exist
    }

    // UPLOAD
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(
            @RequestParam(required = false) String patientName,
            @RequestParam(required = false) Long appointmentId,
            @RequestPart("file") MultipartFile file) {

        try {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("file required");
            }

            String original = file.getOriginalFilename();
            String stored = UUID.randomUUID() + "_" + (original == null ? "file" : original);
            Path target = Path.of(uploadDir, stored);
            Files.copy(file.getInputStream(), target);

            DocumentFile d = new DocumentFile();
            d.setPatientName(patientName);
            d.setAppointmentId(appointmentId);
            d.setOriginalFileName(original);
            d.setStoredFileName(stored);
            d.setStoredPath(target.toString());
            d.setUploadedAt(LocalDateTime.now().toString());

            return ResponseEntity.ok(repo.save(d));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }

    // LIST
    @GetMapping
    public ResponseEntity<List<DocumentFile>> all() {
        return ResponseEntity.ok(repo.findAll());
    }

    // DOWNLOAD (simple)
    @GetMapping("/{id}/download")
    public ResponseEntity<?> download(@PathVariable Long id) {

        return repo.findById(id).map(doc -> {

            FileSystemResource resource = new FileSystemResource(doc.getStoredPath());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                                    (doc.getOriginalFileName() == null ? "file" : doc.getOriginalFileName()) +
                                    "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body((Resource) resource);

        }).orElseGet(() -> ResponseEntity.notFound().build());
    }
}