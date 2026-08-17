package com.pms.controller;

import com.pms.entity.LabReport;
import com.pms.entity.Patient;
import com.pms.repository.LabReportRepository;
import com.pms.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lab-reports")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
@RequiredArgsConstructor
public class LabReportController {

    private final LabReportRepository labReportRepository;
    private final PatientRepository patientRepository;

    private static final String UPLOAD_DIR = "uploads/lab-reports/";

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<List<LabReport>> getLabReportsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(labReportRepository.findByPatientIdOrderByUploadedAtDesc(patientId));
    }

    @PostMapping("/upload/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<LabReport> uploadLabReport(
            @PathVariable Long patientId,
            @RequestParam("title") String title,
            @RequestParam(value = "testCategory", required = false, defaultValue = "General") String testCategory,
            @RequestParam(value = "summary", required = false) String summary,
            @RequestParam("file") MultipartFile file) throws IOException {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id " + patientId));

        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID().toString() + fileExtension;
        Path targetPath = Paths.get(UPLOAD_DIR + storedFileName);

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        LabReport labReport = LabReport.builder()
                .patient(patient)
                .title(title)
                .testCategory(testCategory)
                .fileName(originalFilename != null ? originalFilename : storedFileName)
                .fileType(file.getContentType())
                .filePath(targetPath.toString())
                .fileSize(file.getSize())
                .summary(summary)
                .build();

        LabReport saved = labReportRepository.save(labReport);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/download/{reportId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<Resource> downloadLabReport(@PathVariable Long reportId) throws IOException {
        LabReport report = labReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Lab report not found with id " + reportId));

        Path path = Paths.get(report.getFilePath());
        Resource resource = new UrlResource(path.toUri());

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = report.getFileType() != null ? report.getFileType() : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + report.getFileName() + "\"")
                .body(resource);
    }
}
