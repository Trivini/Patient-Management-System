package com.pms.repository;

import com.pms.entity.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Optional<Prescription> findByPrescriptionCode(String prescriptionCode);
    List<Prescription> findByPatientIdOrderByPrescriptionDateDesc(Long patientId);
    List<Prescription> findByDoctorIdOrderByPrescriptionDateDesc(Long doctorId);
    long countByPatientId(Long patientId);

    @Query("SELECT p FROM Prescription p WHERE " +
           "(:patientId IS NULL OR p.patient.id = :patientId) AND " +
           "(:doctorId IS NULL OR p.doctor.id = :doctorId) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(p.medicineName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.patient.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.patient.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.prescriptionCode) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Prescription> searchPrescriptions(@Param("patientId") Long patientId,
                                           @Param("doctorId") Long doctorId,
                                           @Param("query") String query,
                                           Pageable pageable);
}
