package com.pms.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDashboardDto {
    private PatientDto patientInfo;
    private AppointmentDto nextUpcomingAppointment;
    private long totalAppointments;
    private long medicalRecordCount;
    private long prescriptionCount;

    private List<AppointmentDto> upcomingAppointments;
    private List<AppointmentDto> pastAppointments;
    private List<MedicalRecordDto> recentRecords;
    private List<PrescriptionDto> activePrescriptions;
}
