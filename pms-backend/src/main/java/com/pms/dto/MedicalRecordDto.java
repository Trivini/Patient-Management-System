package com.pms.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecordDto {
    private Long id;
    private String recordCode;

    private Long patientId;
    private String patientName;
    private String patientCode;

    private Long doctorId;
    private String doctorName;

    private Long appointmentId;
    private LocalDate visitDate;
    private String symptoms;
    private String diagnosis;
    private String treatment;
    private String notes;
    private LocalDate followUpDate;
    private LocalDateTime createdAt;
}
