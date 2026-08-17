package com.pms.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceptionistDashboardDto {
    private long todaysAppointments;
    private long newPatientsToday;
    private long pendingAppointments;
    private long completedAppointments;

    private List<AppointmentDto> todaysSchedule;
    private List<DoctorDto> availableDoctors;
}
