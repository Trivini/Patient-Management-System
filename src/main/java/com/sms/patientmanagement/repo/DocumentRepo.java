package com.sms.patientmanagement.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sms.patientmanagement.entity.DocumentFile;

public interface DocumentRepo extends JpaRepository<DocumentFile, Long> {
}