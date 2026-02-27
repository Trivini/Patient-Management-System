package com.sms.patientmanagement.repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.sms.patientmanagement.entity.Consultation;

public interface ConsultationRepo extends JpaRepository<Consultation, Long> {

    List<Consultation> findByAppointmentId(Long appointmentId);

}