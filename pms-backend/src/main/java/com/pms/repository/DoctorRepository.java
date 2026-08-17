package com.pms.repository;

import com.pms.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByDoctorCode(String doctorCode);
    Optional<Doctor> findByEmail(String email);
    Optional<Doctor> findByUserId(Long userId);
    Boolean existsByEmail(String email);
    Boolean existsByDoctorCode(String doctorCode);
    List<Doctor> findByDepartmentId(Long departmentId);
    long countByDepartmentId(Long departmentId);
    long countByStatus(String status);

    @Query("SELECT d FROM Doctor d WHERE " +
           "(:query IS NULL OR :query = '' OR LOWER(d.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.doctorCode) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:departmentId IS NULL OR d.department.id = :departmentId) AND " +
           "(:status IS NULL OR :status = '' OR d.status = :status)")
    Page<Doctor> searchDoctors(@Param("query") String query,
                              @Param("departmentId") Long departmentId,
                              @Param("status") String status,
                              Pageable pageable);
}
