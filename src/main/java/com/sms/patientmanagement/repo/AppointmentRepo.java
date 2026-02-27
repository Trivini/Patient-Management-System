package com.sms.patientmanagement.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sms.patientmanagement.entity.Appointment;

public interface AppointmentRepo extends JpaRepository<Appointment, Long> {
}