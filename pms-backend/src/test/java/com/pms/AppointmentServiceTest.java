package com.pms;

import com.pms.dto.AppointmentDto;
import com.pms.exception.InvalidAppointmentException;
import com.pms.service.AppointmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
public class AppointmentServiceTest {

    @Autowired
    private AppointmentService appointmentService;

    @Test
    public void testCreateAppointmentAndPreventDoubleBooking() {
        LocalDate testDate = LocalDate.now().plusDays(5);
        LocalTime testTime = LocalTime.of(14, 0);

        AppointmentDto dto1 = AppointmentDto.builder()
                .patientId(1L)
                .doctorId(1L)
                .departmentId(1L)
                .appointmentDate(testDate)
                .appointmentTime(testTime)
                .reason("Test Consultation")
                .build();

        AppointmentDto created = appointmentService.createAppointment(dto1);
        assertNotNull(created);
        assertNotNull(created.getAppointmentCode());

        // Attempt second booking for same doctor, date & time
        AppointmentDto dto2 = AppointmentDto.builder()
                .patientId(2L)
                .doctorId(1L)
                .departmentId(1L)
                .appointmentDate(testDate)
                .appointmentTime(testTime)
                .reason("Conflict Consultation")
                .build();

        assertThrows(InvalidAppointmentException.class, () -> {
            appointmentService.createAppointment(dto2);
        });
    }
}
