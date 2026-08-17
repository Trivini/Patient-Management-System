package com.pms.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDto {
    private Long id;
    private String doctorCode;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String gender;
    private LocalDate dateOfBirth;
    private String specialization;
    private Long departmentId;
    private String departmentName;
    private String qualification;
    private Integer experienceYears;
    private BigDecimal consultationFee;
    private String availabilityHours;
    private String status;
    private LocalDateTime createdAt;
}
