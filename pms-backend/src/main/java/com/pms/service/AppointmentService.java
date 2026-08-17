package com.pms.service;

import com.pms.dto.AppointmentDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {
    AppointmentDto createAppointment(AppointmentDto dto);
    AppointmentDto updateAppointment(Long id, AppointmentDto dto);
    AppointmentDto updateAppointmentStatus(Long id, String status);
    AppointmentDto getAppointmentById(Long id);
    List<AppointmentDto> getAppointmentsByPatientId(Long patientId);
    List<AppointmentDto> getAppointmentsByDoctorId(Long doctorId);
    Page<AppointmentDto> searchAppointments(Long patientId, Long doctorId, Long departmentId, String status, LocalDate fromDate, LocalDate toDate, String query, Pageable pageable);
    void cancelAppointment(Long id);
    List<LocalTime> getAvailableDoctorSlots(Long doctorId, LocalDate date);
}
