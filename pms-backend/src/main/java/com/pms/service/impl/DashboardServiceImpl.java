package com.pms.service.impl;

import com.pms.dto.*;
import com.pms.entity.Doctor;
import com.pms.entity.Patient;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.*;
import com.pms.service.AppointmentService;
import com.pms.service.AuditLogService;
import com.pms.service.DashboardService;
import com.pms.service.DoctorService;
import com.pms.service.MedicalRecordService;
import com.pms.service.PatientService;
import com.pms.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private MedicalRecordService medicalRecordService;

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private AuditLogService auditLogService;

    @Override
    public AdminDashboardDto getAdminDashboardData() {
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();
        long todaysAppointments = appointmentRepository.countByAppointmentDate(LocalDate.now());
        long activePatients = patientRepository.countByStatus("ACTIVE");
        long pendingAppointments = appointmentRepository.countByStatus("BOOKED");
        long completedAppointments = appointmentRepository.countByStatus("COMPLETED");
        long cancelledAppointments = appointmentRepository.countByStatus("CANCELLED");

        // Monthly appointments breakdown (Jan - Dec)
        List<Map<String, Object>> monthlyAppointments = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"};
        List<Object[]> monthlyCounts = appointmentRepository.countMonthlyAppointmentsCurrentYear();
        Map<Integer, Long> countMap = new HashMap<>();
        for (Object[] row : monthlyCounts) {
            if (row[0] != null) {
                countMap.put(((Number) row[0]).intValue(), ((Number) row[1]).longValue());
            }
        }
        for (int i = 1; i <= 12; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("month", months[i - 1]);
            item.put("count", countMap.getOrDefault(i, 0L));
            monthlyAppointments.add(item);
        }

        // Status breakdown
        List<Map<String, Object>> statusBreakdown = new ArrayList<>();
        List<Object[]> statusGroups = appointmentRepository.countAppointmentsByStatusGroup();
        for (Object[] row : statusGroups) {
            Map<String, Object> item = new HashMap<>();
            item.put("status", row[0]);
            item.put("count", row[1]);
            statusBreakdown.add(item);
        }

        // Doctor workload
        List<Map<String, Object>> doctorWorkload = new ArrayList<>();
        List<Doctor> doctors = doctorRepository.findAll();
        for (Doctor d : doctors) {
            long count = appointmentRepository.countByDoctorIdAndStatus(d.getId(), "COMPLETED") + 
                         appointmentRepository.countByDoctorIdAndStatus(d.getId(), "BOOKED") +
                         appointmentRepository.countByDoctorIdAndStatus(d.getId(), "CONFIRMED");
            Map<String, Object> item = new HashMap<>();
            item.put("doctorName", "Dr. " + d.getFirstName() + " " + d.getLastName());
            item.put("specialization", d.getSpecialization());
            item.put("appointmentCount", count);
            doctorWorkload.add(item);
        }

        // Recent appointments
        PageRequest pageRequest = PageRequest.of(0, 5, Sort.by("id").descending());
        List<AppointmentDto> recentAppointments = appointmentService.searchAppointments(null, null, null, null, null, null, null, pageRequest).getContent();

        // Audit logs
        List<AuditLogDto> recentLogs = auditLogService.getRecentLogs().stream().limit(5).toList();

        return AdminDashboardDto.builder()
                .totalPatients(totalPatients)
                .totalDoctors(totalDoctors)
                .totalAppointments(totalAppointments)
                .todaysAppointments(todaysAppointments)
                .activePatients(activePatients)
                .pendingAppointments(pendingAppointments)
                .completedAppointments(completedAppointments)
                .cancelledAppointments(cancelledAppointments)
                .monthlyAppointments(monthlyAppointments)
                .appointmentStatusBreakdown(statusBreakdown)
                .doctorWorkload(doctorWorkload)
                .recentAppointments(recentAppointments)
                .recentAuditLogs(recentLogs)
                .build();
    }

    @Override
    public DoctorDashboardDto getDoctorDashboardData(Long doctorId, String userEmail) {
        Doctor doc = null;
        if (doctorId != null) {
            doc = doctorRepository.findById(doctorId).orElse(null);
        }
        if (doc == null && userEmail != null) {
            doc = doctorRepository.findByEmail(userEmail).orElse(null);
        }
        if (doc == null) {
            throw new ResourceNotFoundException("Doctor record not found for user: " + userEmail);
        }

        long todaysCount = appointmentRepository.countByDoctorIdAndAppointmentDate(doc.getId(), LocalDate.now());
        long upcomingCount = appointmentRepository.countByDoctorIdAndStatus(doc.getId(), "BOOKED") + 
                              appointmentRepository.countByDoctorIdAndStatus(doc.getId(), "CONFIRMED");
        long completedCount = appointmentRepository.countByDoctorIdAndStatus(doc.getId(), "COMPLETED");

        PageRequest pageReq = PageRequest.of(0, 10, Sort.by("appointmentDate").ascending());
        List<AppointmentDto> todaysList = appointmentService.searchAppointments(null, doc.getId(), null, null, LocalDate.now(), LocalDate.now(), null, pageReq).getContent();
        List<AppointmentDto> upcomingList = appointmentService.searchAppointments(null, doc.getId(), null, "BOOKED", LocalDate.now(), null, null, pageReq).getContent();

        List<PatientDto> assignedPatients = patientRepository.findAll().stream().limit(5).map(p -> 
            PatientDto.builder()
                    .id(p.getId())
                    .patientCode(p.getPatientCode())
                    .firstName(p.getFirstName())
                    .lastName(p.getLastName())
                    .age(p.getAge())
                    .gender(p.getGender())
                    .phone(p.getPhone())
                    .email(p.getEmail())
                    .bloodGroup(p.getBloodGroup())
                    .status(p.getStatus())
                    .build()
        ).toList();

        return DoctorDashboardDto.builder()
                .doctorName("Dr. " + doc.getFirstName() + " " + doc.getLastName())
                .specialization(doc.getSpecialization())
                .todaysAppointments(todaysCount)
                .upcomingAppointments(upcomingCount)
                .assignedPatientsCount(assignedPatients.size())
                .completedConsultations(completedCount)
                .todaysAppointmentsList(todaysList)
                .upcomingAppointmentsList(upcomingList)
                .recentAssignedPatients(assignedPatients)
                .build();
    }

    @Override
    public ReceptionistDashboardDto getReceptionistDashboardData() {
        long todaysCount = appointmentRepository.countByAppointmentDate(LocalDate.now());
        long newPatientsCount = patientRepository.countByStatus("ACTIVE");
        long pendingCount = appointmentRepository.countByStatus("BOOKED");
        long completedCount = appointmentRepository.countByStatus("COMPLETED");

        PageRequest pageReq = PageRequest.of(0, 10, Sort.by("appointmentTime").ascending());
        List<AppointmentDto> todaysSchedule = appointmentService.searchAppointments(null, null, null, null, LocalDate.now(), LocalDate.now(), null, pageReq).getContent();
        List<DoctorDto> availableDoctors = doctorService.getAllDoctors();

        return ReceptionistDashboardDto.builder()
                .todaysAppointments(todaysCount)
                .newPatientsToday(newPatientsCount)
                .pendingAppointments(pendingCount)
                .completedAppointments(completedCount)
                .todaysSchedule(todaysSchedule)
                .availableDoctors(availableDoctors)
                .build();
    }

    @Override
    public PatientDashboardDto getPatientDashboardData(Long patientId, String userEmail) {
        Patient p = null;
        if (patientId != null) {
            p = patientRepository.findById(patientId).orElse(null);
        }
        if (p == null && userEmail != null) {
            p = patientRepository.findByEmail(userEmail).orElse(null);
        }
        if (p == null) {
            throw new ResourceNotFoundException("Patient record not found for user: " + userEmail);
        }

        PatientDto patientDto = patientService.getPatientById(p.getId());
        List<AppointmentDto> appointments = appointmentService.getAppointmentsByPatientId(p.getId());
        List<MedicalRecordDto> records = medicalRecordService.getMedicalRecordsByPatientId(p.getId());
        List<PrescriptionDto> prescriptions = prescriptionService.getPrescriptionsByPatientId(p.getId());

        AppointmentDto nextAppointment = appointments.stream()
                .filter(a -> "BOOKED".equals(a.getStatus()) || "CONFIRMED".equals(a.getStatus()))
                .filter(a -> !a.getAppointmentDate().isBefore(LocalDate.now()))
                .sorted(Comparator.comparing(AppointmentDto::getAppointmentDate).thenComparing(AppointmentDto::getAppointmentTime))
                .findFirst().orElse(null);

        List<AppointmentDto> upcoming = appointments.stream()
                .filter(a -> "BOOKED".equals(a.getStatus()) || "CONFIRMED".equals(a.getStatus()))
                .toList();

        List<AppointmentDto> past = appointments.stream()
                .filter(a -> "COMPLETED".equals(a.getStatus()) || "CANCELLED".equals(a.getStatus()) || a.getAppointmentDate().isBefore(LocalDate.now()))
                .toList();

        return PatientDashboardDto.builder()
                .patientInfo(patientDto)
                .nextUpcomingAppointment(nextAppointment)
                .totalAppointments(appointments.size())
                .medicalRecordCount(records.size())
                .prescriptionCount(prescriptions.size())
                .upcomingAppointments(upcoming)
                .pastAppointments(past)
                .recentRecords(records)
                .activePrescriptions(prescriptions)
                .build();
    }

    @Override
    public Map<String, Object> getAdvancedAnalyticsData() {
        Map<String, Object> analytics = new HashMap<>();

        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();
        long completedAppointments = appointmentRepository.countByStatus("COMPLETED");
        long cancelledAppointments = appointmentRepository.countByStatus("CANCELLED");
        long bookedAppointments = appointmentRepository.countByStatus("BOOKED");
        long confirmedAppointments = appointmentRepository.countByStatus("CONFIRMED");

        analytics.put("totalPatients", totalPatients);
        analytics.put("totalDoctors", totalDoctors);
        analytics.put("totalAppointments", totalAppointments);
        analytics.put("completedAppointments", completedAppointments);
        analytics.put("cancelledAppointments", cancelledAppointments);
        analytics.put("bookedAppointments", bookedAppointments);
        analytics.put("confirmedAppointments", confirmedAppointments);

        // Calculate appointment status distribution for charts
        List<Map<String, Object>> statusDistribution = List.of(
                Map.of("name", "Completed", "value", completedAppointments, "color", "#10B981"),
                Map.of("name", "Confirmed", "value", confirmedAppointments, "color", "#3B82F6"),
                Map.of("name", "Booked", "value", bookedAppointments, "color", "#F59E0B"),
                Map.of("name", "Cancelled", "value", cancelledAppointments, "color", "#EF4444")
        );
        analytics.put("statusDistribution", statusDistribution);

        return analytics;
    }
}
