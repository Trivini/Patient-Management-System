package com.pms.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDashboardDto {
    private String doctorName;
    private String specialization;
    private long todaysAppointments;
    private long upcomingAppointments;
    private long assignedPatientsCount;
    private long completedConsultations;

    private List<AppointmentDto> todaysAppointmentsList;
    private List<AppointmentDto> upcomingAppointmentsList;
    private List<PatientDto> recentAssignedPatients;
}
