package com.pms.service.impl;

import com.pms.dto.PatientDto;
import com.pms.entity.Patient;
import com.pms.entity.Role;
import com.pms.entity.User;
import com.pms.exception.DuplicateResourceException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.PatientRepository;
import com.pms.repository.UserRepository;
import com.pms.service.PatientService;
import com.pms.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public PatientDto createPatient(PatientDto dto) {
        if (patientRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Patient with email " + dto.getEmail() + " already exists");
        }

        // Calculate age if date of birth provided
        Integer age = dto.getAge();
        if (dto.getDateOfBirth() != null) {
            age = Period.between(dto.getDateOfBirth(), LocalDate.now()).getYears();
        }

        // Check or create associated User account for login
        User user = userRepository.findByEmail(dto.getEmail()).orElse(null);
        if (user == null) {
            user = User.builder()
                    .email(dto.getEmail())
                    .password(passwordEncoder.encode("Patient@123"))
                    .fullName(dto.getFirstName() + " " + dto.getLastName())
                    .role(Role.ROLE_PATIENT)
                    .phone(dto.getPhone())
                    .status("ACTIVE")
                    .build();
            user = userRepository.save(user);
        }

        Patient patient = Patient.builder()
                .patientCode(IdGenerator.generatePatientCode(System.currentTimeMillis() % 1000))
                .user(user)
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .gender(dto.getGender() != null ? dto.getGender() : "Male")
                .dateOfBirth(dto.getDateOfBirth())
                .age(age)
                .bloodGroup(dto.getBloodGroup())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .address(dto.getAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .pincode(dto.getPincode())
                .emergencyContactName(dto.getEmergencyContactName())
                .emergencyContactPhone(dto.getEmergencyContactPhone())
                .allergies(dto.getAllergies())
                .existingConditions(dto.getExistingConditions())
                .registrationDate(dto.getRegistrationDate() != null ? dto.getRegistrationDate() : LocalDate.now())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();

        patient = patientRepository.save(patient);
        patient.setPatientCode(IdGenerator.generatePatientCode(patient.getId()));
        patient = patientRepository.save(patient);

        return mapToDto(patient);
    }

    @Override
    @Transactional
    public PatientDto updatePatient(Long id, PatientDto dto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        if (!patient.getEmail().equalsIgnoreCase(dto.getEmail()) && patientRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Patient with email " + dto.getEmail() + " already exists");
        }

        Integer age = dto.getAge();
        if (dto.getDateOfBirth() != null) {
            age = Period.between(dto.getDateOfBirth(), LocalDate.now()).getYears();
        }

        patient.setFirstName(dto.getFirstName());
        patient.setLastName(dto.getLastName());
        patient.setGender(dto.getGender());
        patient.setDateOfBirth(dto.getDateOfBirth());
        patient.setAge(age);
        patient.setBloodGroup(dto.getBloodGroup());
        patient.setPhone(dto.getPhone());
        patient.setEmail(dto.getEmail());
        patient.setAddress(dto.getAddress());
        patient.setCity(dto.getCity());
        patient.setState(dto.getState());
        patient.setPincode(dto.getPincode());
        patient.setEmergencyContactName(dto.getEmergencyContactName());
        patient.setEmergencyContactPhone(dto.getEmergencyContactPhone());
        patient.setAllergies(dto.getAllergies());
        patient.setExistingConditions(dto.getExistingConditions());
        if (dto.getStatus() != null) patient.setStatus(dto.getStatus());

        return mapToDto(patientRepository.save(patient));
    }

    @Override
    public PatientDto getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return mapToDto(patient);
    }

    @Override
    public PatientDto getPatientByUserId(Long userId) {
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient record not found for user id: " + userId));
        return mapToDto(patient);
    }

    @Override
    public List<PatientDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PatientDto> searchPatients(String query, String status, String gender, Pageable pageable) {
        return patientRepository.searchPatients(query, status, gender, pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        patientRepository.delete(patient);
    }

    private PatientDto mapToDto(Patient p) {
        return PatientDto.builder()
                .id(p.getId())
                .patientCode(p.getPatientCode())
                .userId(p.getUser() != null ? p.getUser().getId() : null)
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .gender(p.getGender())
                .dateOfBirth(p.getDateOfBirth())
                .age(p.getAge())
                .bloodGroup(p.getBloodGroup())
                .phone(p.getPhone())
                .email(p.getEmail())
                .address(p.getAddress())
                .city(p.getCity())
                .state(p.getState())
                .pincode(p.getPincode())
                .emergencyContactName(p.getEmergencyContactName())
                .emergencyContactPhone(p.getEmergencyContactPhone())
                .allergies(p.getAllergies())
                .existingConditions(p.getExistingConditions())
                .registrationDate(p.getRegistrationDate())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
