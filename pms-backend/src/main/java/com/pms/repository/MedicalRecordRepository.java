package com.pms.repository;

import com.pms.entity.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    Optional<MedicalRecord> findByRecordCode(String recordCode);
    List<MedicalRecord> findByPatientIdOrderByVisitDateDesc(Long patientId);
    List<MedicalRecord> findByDoctorIdOrderByVisitDateDesc(Long doctorId);
    long countByPatientId(Long patientId);

    @Query("SELECT r FROM MedicalRecord r WHERE " +
           "(:patientId IS NULL OR r.patient.id = :patientId) AND " +
           "(:doctorId IS NULL OR r.doctor.id = :doctorId) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(r.diagnosis) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.symptoms) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.patient.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.patient.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(r.recordCode) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<MedicalRecord> searchMedicalRecords(@Param("patientId") Long patientId,
                                             @Param("doctorId") Long doctorId,
                                             @Param("query") String query,
                                             Pageable pageable);
}
