package com.pms.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PrescriptionDto {
    private Long id;
    private String prescriptionCode;

    private Long patientId;
    private String patientName;
    private String patientCode;
    private String patientAge;
    private String patientGender;

    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;

    private Long medicalRecordId;
    private String medicineName;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;
    private LocalDate prescriptionDate;
    private LocalDateTime createdAt;
}
