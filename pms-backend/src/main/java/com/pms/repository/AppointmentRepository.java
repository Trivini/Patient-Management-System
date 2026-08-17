package com.pms.repository;

import com.pms.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    Optional<Appointment> findByAppointmentCode(String appointmentCode);
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);

    // Double-booking check: exists for same doctor, date, time where status is NOT CANCELLED
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long doctorId, LocalDate appointmentDate, LocalTime appointmentTime, String status);

    long countByStatus(String status);
    long countByAppointmentDate(LocalDate appointmentDate);
    long countByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);
    long countByDoctorIdAndStatus(Long doctorId, String status);
    long countByPatientIdAndStatus(Long patientId, String status);
    long countByPatientId(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE " +
           "(:patientId IS NULL OR a.patient.id = :patientId) AND " +
           "(:doctorId IS NULL OR a.doctor.id = :doctorId) AND " +
           "(:departmentId IS NULL OR a.department.id = :departmentId) AND " +
           "(:status IS NULL OR :status = '' OR a.status = :status) AND " +
           "(:fromDate IS NULL OR a.appointmentDate >= :fromDate) AND " +
           "(:toDate IS NULL OR a.appointmentDate <= :toDate) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(a.appointmentCode) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.patient.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.patient.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.doctor.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.doctor.lastName) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Appointment> searchAppointments(@Param("patientId") Long patientId,
                                         @Param("doctorId") Long doctorId,
                                         @Param("departmentId") Long departmentId,
                                         @Param("status") String status,
                                         @Param("fromDate") LocalDate fromDate,
                                         @Param("toDate") LocalDate toDate,
                                         @Param("query") String query,
                                         Pageable pageable);

    @Query("SELECT a.status as status, COUNT(a) as count FROM Appointment a GROUP BY a.status")
    List<Object[]> countAppointmentsByStatusGroup();

    @Query("SELECT MONTH(a.appointmentDate) as month, COUNT(a) as count FROM Appointment a WHERE YEAR(a.appointmentDate) = YEAR(CURRENT_DATE) GROUP BY MONTH(a.appointmentDate) ORDER BY month")
    List<Object[]> countMonthlyAppointmentsCurrentYear();
}
