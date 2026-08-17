package com.pms.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDto {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private long todaysAppointments;
    private long activePatients;
    private long pendingAppointments;
    private long completedAppointments;
    private long cancelledAppointments;

    private List<Map<String, Object>> monthlyAppointments;
    private List<Map<String, Object>> appointmentStatusBreakdown;
    private List<Map<String, Object>> doctorWorkload;
    private List<AppointmentDto> recentAppointments;
    private List<AuditLogDto> recentAuditLogs;
}
