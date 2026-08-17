package com.pms.service;

import com.pms.dto.AdminDashboardDto;
import com.pms.dto.DoctorDashboardDto;
import com.pms.dto.PatientDashboardDto;
import com.pms.dto.ReceptionistDashboardDto;

public interface DashboardService {
    AdminDashboardDto getAdminDashboardData();
    DoctorDashboardDto getDoctorDashboardData(Long doctorId, String userEmail);
    ReceptionistDashboardDto getReceptionistDashboardData();
    PatientDashboardDto getPatientDashboardData(Long patientId, String userEmail);
    java.util.Map<String, Object> getAdvancedAnalyticsData();
}
