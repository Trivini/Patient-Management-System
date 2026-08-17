package com.pms.service.impl;

import com.pms.dto.AppointmentDto;
import com.pms.entity.Appointment;
import com.pms.entity.Department;
import com.pms.entity.Doctor;
import com.pms.entity.Patient;
import com.pms.exception.InvalidAppointmentException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.AppointmentRepository;
import com.pms.repository.DepartmentRepository;
import com.pms.repository.DoctorRepository;
import com.pms.repository.PatientRepository;
import com.pms.service.AppointmentService;
import com.pms.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public AppointmentDto createAppointment(AppointmentDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        Department department = doctor.getDepartment();
        if (dto.getDepartmentId() != null) {
            department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));
        } else if (department == null) {
            throw new InvalidAppointmentException("Doctor is not assigned to any department. Please select a department.");
        }

        // Validate date
        if (dto.getAppointmentDate() == null || dto.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new InvalidAppointmentException("Appointment date must be today or in the future");
        }

        // Validate time
        if (dto.getAppointmentTime() == null) {
            throw new InvalidAppointmentException("Appointment time is required");
        }

        // Double-booking check: verify doctor does not already have an active appointment at same date & time
        boolean doubleBooked = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                doctor.getId(), dto.getAppointmentDate(), dto.getAppointmentTime(), "CANCELLED");

        if (doubleBooked) {
            throw new InvalidAppointmentException("Doctor " + doctor.getFirstName() + " " + doctor.getLastName() + 
                    " is already booked at " + dto.getAppointmentTime() + " on " + dto.getAppointmentDate());
        }

        Appointment appointment = Appointment.builder()
                .appointmentCode(IdGenerator.generateAppointmentCode(System.currentTimeMillis() % 1000))
                .patient(patient)
                .doctor(doctor)
                .department(department)
                .appointmentDate(dto.getAppointmentDate())
                .appointmentTime(dto.getAppointmentTime())
                .reason(dto.getReason() != null ? dto.getReason() : "General Consultation")
                .notes(dto.getNotes())
                .status("BOOKED")
                .build();

        appointment = appointmentRepository.save(appointment);
        appointment.setAppointmentCode(IdGenerator.generateAppointmentCode(appointment.getId()));
        appointment = appointmentRepository.save(appointment);

        return mapToDto(appointment);
    }

    @Override
    @Transactional
    public AppointmentDto updateAppointment(Long id, AppointmentDto dto) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        if (dto.getDoctorId() != null && !dto.getDoctorId().equals(appointment.getDoctor().getId())) {
            Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));
            appointment.setDoctor(doctor);
        }

        if (dto.getAppointmentDate() != null) appointment.setAppointmentDate(dto.getAppointmentDate());
        if (dto.getAppointmentTime() != null) appointment.setAppointmentTime(dto.getAppointmentTime());
        if (dto.getReason() != null) appointment.setReason(dto.getReason());
        if (dto.getNotes() != null) appointment.setNotes(dto.getNotes());
        if (dto.getStatus() != null) appointment.setStatus(dto.getStatus());

        return mapToDto(appointmentRepository.save(appointment));
    }

    @Override
    @Transactional
    public AppointmentDto updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appointment.setStatus(status.toUpperCase());
        return mapToDto(appointmentRepository.save(appointment));
    }

    @Override
    public AppointmentDto getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return mapToDto(appointment);
    }

    @Override
    public List<AppointmentDto> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<AppointmentDto> searchAppointments(Long patientId, Long doctorId, Long departmentId, String status, LocalDate fromDate, LocalDate toDate, String query, Pageable pageable) {
        return appointmentRepository.searchAppointments(patientId, doctorId, departmentId, status, fromDate, toDate, query, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
    }

    @Override
    public List<LocalTime> getAvailableDoctorSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + doctorId));

        // Standard clinic slots: 09:00 AM to 04:30 PM (30 min intervals)
        List<LocalTime> allSlots = new ArrayList<>();
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(17, 0);

        while (start.isBefore(end)) {
            allSlots.add(start);
            start = start.plusMinutes(30);
        }

        // Fetch already booked slots for this doctor & date
        List<Appointment> existingAppointments = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);
        List<LocalTime> bookedTimes = existingAppointments.stream()
                .filter(a -> !"CANCELLED".equals(a.getStatus()))
                .map(Appointment::getAppointmentTime)
                .collect(Collectors.toList());

        // Return remaining unbooked slots
        return allSlots.stream()
                .filter(slot -> !bookedTimes.contains(slot))
                .collect(Collectors.toList());
    }

    private AppointmentDto mapToDto(Appointment a) {
        return AppointmentDto.builder()
                .id(a.getId())
                .appointmentCode(a.getAppointmentCode())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getFirstName() + " " + a.getPatient().getLastName())
                .patientCode(a.getPatient().getPatientCode())
                .patientPhone(a.getPatient().getPhone())
                .patientEmail(a.getPatient().getEmail())
                .doctorId(a.getDoctor().getId())
                .doctorName("Dr. " + a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName())
                .doctorCode(a.getDoctor().getDoctorCode())
                .specialization(a.getDoctor().getSpecialization())
                .departmentId(a.getDepartment().getId())
                .departmentName(a.getDepartment().getName())
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .reason(a.getReason())
                .notes(a.getNotes())
                .status(a.getStatus())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
