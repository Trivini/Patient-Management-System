package com.pms.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDto {
    private Long id;
    private String patientCode;
    private Long userId;
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dateOfBirth;
    private Integer age;
    private String bloodGroup;
    private String phone;
    private String email;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String emergencyContactName;
    private String emergencyContactPhone;
    private String allergies;
    private String existingConditions;
    private LocalDate registrationDate;
    private String status;
    private LocalDateTime createdAt;
}
