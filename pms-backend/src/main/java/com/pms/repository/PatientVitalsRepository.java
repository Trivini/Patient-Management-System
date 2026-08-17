package com.pms.repository;

import com.pms.entity.PatientVitals;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientVitalsRepository extends JpaRepository<PatientVitals, Long> {
    List<PatientVitals> findByPatientIdOrderByRecordedAtDesc(Long patientId);
}
