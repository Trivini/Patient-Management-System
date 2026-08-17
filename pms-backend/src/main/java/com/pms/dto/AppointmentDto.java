package com.pms.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDto {
    private Long id;
    private String appointmentCode;
    
    private Long patientId;
    private String patientName;
    private String patientCode;
    private String patientPhone;
    private String patientEmail;

    private Long doctorId;
    private String doctorName;
    private String doctorCode;
    private String specialization;

    private Long departmentId;
    private String departmentName;

    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String reason;
    private String notes;
    private String status;
    private LocalDateTime createdAt;
}
