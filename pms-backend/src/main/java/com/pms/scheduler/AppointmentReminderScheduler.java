package com.pms.scheduler;

import com.pms.entity.Appointment;
import com.pms.repository.AppointmentRepository;
import com.pms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class AppointmentReminderScheduler {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    // Run every hour to check for upcoming appointments for today or tomorrow
    @Scheduled(cron = "0 0 * * * *")
    public void sendUpcomingAppointmentReminders() {
        log.info("Running automated appointment reminder check...");
        LocalDate today = LocalDate.now();
        List<Appointment> todayAppointments = appointmentRepository.findAll().stream()
                .filter(a -> today.equals(a.getAppointmentDate()) && "CONFIRMED".equalsIgnoreCase(a.getStatus()))
                .toList();

        for (Appointment appt : todayAppointments) {
            if (appt.getPatient() != null && appt.getPatient().getUser() != null) {
                notificationService.createNotification(
                        appt.getPatient().getUser(),
                        "Appointment Reminder Today",
                        "You have an upcoming consultation with Dr. " + appt.getDoctor().getFirstName() + " " + appt.getDoctor().getLastName() + " at " + appt.getAppointmentTime() + ".",
                        "APPOINTMENT_REMINDER",
                        "/patient/appointments"
                );
            }
        }
    }
}
