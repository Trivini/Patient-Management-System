package com.pms.service.impl;

import com.pms.dto.JwtResponse;
import com.pms.dto.LoginRequest;
import com.pms.dto.RegisterRequest;
import com.pms.entity.*;
import com.pms.exception.DuplicateResourceException;
import com.pms.exception.ValidationException;
import com.pms.repository.DoctorRepository;
import com.pms.repository.PatientRepository;
import com.pms.repository.UserRepository;
import com.pms.security.CustomUserDetails;
import com.pms.security.JwtUtils;
import com.pms.service.AuditLogService;
import com.pms.service.AuthService;
import com.pms.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Long patientId = null;
        Long doctorId = null;

        if ("ROLE_PATIENT".equals(userDetails.getRole())) {
            Optional<Patient> p = patientRepository.findByUserId(userDetails.getId());
            if (p.isPresent()) patientId = p.get().getId();
        } else if ("ROLE_DOCTOR".equals(userDetails.getRole())) {
            Optional<Doctor> d = doctorRepository.findByUserId(userDetails.getId());
            if (d.isPresent()) doctorId = d.get().getId();
        }

        auditLogService.logAction(
                userDetails.getEmail(),
                userDetails.getRole(),
                "USER_LOGIN",
                "AUTH",
                "Successful user login",
                String.valueOf(userDetails.getId()),
                "127.0.0.1"
        );

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .email(userDetails.getEmail())
                .fullName(userDetails.getFullName())
                .role(userDetails.getRole())
                .patientId(patientId)
                .doctorId(doctorId)
                .build();
    }

    @Override
    @Transactional
    public JwtResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email is already in use: " + registerRequest.getEmail());
        }

        Role userRole = Role.ROLE_PATIENT;
        if (registerRequest.getRole() != null) {
            try {
                String reqRole = registerRequest.getRole().toUpperCase();
                if (!reqRole.startsWith("ROLE_")) {
                    reqRole = "ROLE_" + reqRole;
                }
                userRole = Role.valueOf(reqRole);
            } catch (IllegalArgumentException e) {
                throw new ValidationException("Invalid role specified: " + registerRequest.getRole());
            }
        }

        User user = User.builder()
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .role(userRole)
                .phone(registerRequest.getPhone())
                .status("ACTIVE")
                .build();

        user = userRepository.save(user);

        Long patientId = null;
        Long doctorId = null;

        // If PATIENT, create Patient record linked to user
        if (userRole == Role.ROLE_PATIENT) {
            String[] nameParts = registerRequest.getFullName().trim().split("\\s+", 2);
            String firstName = nameParts[0];
            String lastName = nameParts.length > 1 ? nameParts[1] : "";

            Patient patient = Patient.builder()
                    .user(user)
                    .patientCode(IdGenerator.generatePatientCode(user.getId()))
                    .firstName(firstName)
                    .lastName(lastName)
                    .email(user.getEmail())
                    .phone(user.getPhone() != null ? user.getPhone() : "N/A")
                    .gender(registerRequest.getGender() != null ? registerRequest.getGender() : "Other")
                    .bloodGroup(registerRequest.getBloodGroup() != null ? registerRequest.getBloodGroup() : "Unknown")
                    .address(registerRequest.getAddress())
                    .city(registerRequest.getCity())
                    .state(registerRequest.getState())
                    .pincode(registerRequest.getPincode())
                    .emergencyContactName(registerRequest.getEmergencyContactName())
                    .emergencyContactPhone(registerRequest.getEmergencyContactPhone())
                    .allergies(registerRequest.getAllergies())
                    .existingConditions(registerRequest.getExistingConditions())
                    .registrationDate(LocalDate.now())
                    .status("ACTIVE")
                    .build();

            if (registerRequest.getDateOfBirth() != null && !registerRequest.getDateOfBirth().isBlank()) {
                patient.setDateOfBirth(LocalDate.parse(registerRequest.getDateOfBirth()));
            }

            patient = patientRepository.save(patient);
            patientId = patient.getId();
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registerRequest.getEmail(), registerRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        auditLogService.logAction(
                user.getEmail(),
                user.getRole().name(),
                "USER_REGISTER",
                "AUTH",
                "New user registered: " + user.getEmail(),
                String.valueOf(user.getId()),
                "127.0.0.1"
        );

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .patientId(patientId)
                .doctorId(doctorId)
                .build();
    }
}
