package com.sms.patientmanagement.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sms.patientmanagement.entity.Patient;

public interface PatientRepo extends JpaRepository<Patient, Long> {
}
