package com.pms.repository;

import com.pms.entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByPatientCode(String patientCode);
    Optional<Patient> findByEmail(String email);
    Optional<Patient> findByUserId(Long userId);
    Boolean existsByEmail(String email);
    Boolean existsByPhone(String phone);
    Boolean existsByPatientCode(String patientCode);
    long countByStatus(String status);

    @Query("SELECT p FROM Patient p WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(p.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.email) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.phone) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.patientCode) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR :status = '' OR p.status = :status) AND " +
           "(:gender IS NULL OR :gender = '' OR p.gender = :gender)")
    Page<Patient> searchPatients(@Param("query") String query,
                                @Param("status") String status,
                                @Param("gender") String gender,
                                Pageable pageable);
}
