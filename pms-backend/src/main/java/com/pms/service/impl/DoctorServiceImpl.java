package com.pms.service.impl;

import com.pms.dto.DoctorDto;
import com.pms.entity.Department;
import com.pms.entity.Doctor;
import com.pms.entity.Role;
import com.pms.entity.User;
import com.pms.exception.DuplicateResourceException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.DepartmentRepository;
import com.pms.repository.DoctorRepository;
import com.pms.repository.UserRepository;
import com.pms.service.DoctorService;
import com.pms.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public DoctorDto createDoctor(DoctorDto dto) {
        if (doctorRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Doctor with email " + dto.getEmail() + " already exists");
        }

        Department department = null;
        if (dto.getDepartmentId() != null) {
            department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));
        }

        // Check if user account exists or create a new user account for the doctor
        User user = userRepository.findByEmail(dto.getEmail()).orElse(null);
        if (user == null) {
            user = User.builder()
                    .email(dto.getEmail())
                    .password(passwordEncoder.encode("Doctor@123"))
                    .fullName(dto.getFirstName() + " " + dto.getLastName())
                    .role(Role.ROLE_DOCTOR)
                    .phone(dto.getPhone())
                    .status("ACTIVE")
                    .build();
            user = userRepository.save(user);
        }

        Doctor doctor = Doctor.builder()
                .doctorCode(IdGenerator.generateDoctorCode(System.currentTimeMillis() % 1000))
                .user(user)
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .gender(dto.getGender())
                .dateOfBirth(dto.getDateOfBirth())
                .specialization(dto.getSpecialization())
                .department(department)
                .qualification(dto.getQualification())
                .experienceYears(dto.getExperienceYears())
                .consultationFee(dto.getConsultationFee())
                .availabilityHours(dto.getAvailabilityHours() != null ? dto.getAvailabilityHours() : "Mon-Fri 09:00 AM - 05:00 PM")
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();

        doctor = doctorRepository.save(doctor);
        doctor.setDoctorCode(IdGenerator.generateDoctorCode(doctor.getId()));
        doctor = doctorRepository.save(doctor);

        return mapToDto(doctor);
    }

    @Override
    @Transactional
    public DoctorDto updateDoctor(Long id, DoctorDto dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        if (!doctor.getEmail().equalsIgnoreCase(dto.getEmail()) && doctorRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Doctor with email " + dto.getEmail() + " already exists");
        }

        if (dto.getDepartmentId() != null) {
            Department department = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));
            doctor.setDepartment(department);
        }

        doctor.setFirstName(dto.getFirstName());
        doctor.setLastName(dto.getLastName());
        doctor.setEmail(dto.getEmail());
        doctor.setPhone(dto.getPhone());
        doctor.setGender(dto.getGender());
        doctor.setDateOfBirth(dto.getDateOfBirth());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setQualification(dto.getQualification());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setConsultationFee(dto.getConsultationFee());
        if (dto.getAvailabilityHours() != null) doctor.setAvailabilityHours(dto.getAvailabilityHours());
        if (dto.getStatus() != null) doctor.setStatus(dto.getStatus());

        return mapToDto(doctorRepository.save(doctor));
    }

    @Override
    public DoctorDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapToDto(doctor);
    }

    @Override
    public DoctorDto getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found for user id: " + userId));
        return mapToDto(doctor);
    }

    @Override
    public List<DoctorDto> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<DoctorDto> searchDoctors(String query, Long departmentId, String status, Pageable pageable) {
        return doctorRepository.searchDoctors(query, departmentId, status, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        doctorRepository.delete(doctor);
    }

    private DoctorDto mapToDto(Doctor doc) {
        return DoctorDto.builder()
                .id(doc.getId())
                .doctorCode(doc.getDoctorCode())
                .userId(doc.getUser() != null ? doc.getUser().getId() : null)
                .firstName(doc.getFirstName())
                .lastName(doc.getLastName())
                .email(doc.getEmail())
                .phone(doc.getPhone())
                .gender(doc.getGender())
                .dateOfBirth(doc.getDateOfBirth())
                .specialization(doc.getSpecialization())
                .departmentId(doc.getDepartment() != null ? doc.getDepartment().getId() : null)
                .departmentName(doc.getDepartment() != null ? doc.getDepartment().getName() : null)
                .qualification(doc.getQualification())
                .experienceYears(doc.getExperienceYears())
                .consultationFee(doc.getConsultationFee())
                .availabilityHours(doc.getAvailabilityHours())
                .status(doc.getStatus())
                .createdAt(doc.getCreatedAt())
                .build();
    }
}
