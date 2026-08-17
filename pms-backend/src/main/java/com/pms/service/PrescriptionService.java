package com.pms.service;

import com.pms.dto.PrescriptionDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PrescriptionService {
    PrescriptionDto createPrescription(PrescriptionDto dto);
    PrescriptionDto updatePrescription(Long id, PrescriptionDto dto);
    PrescriptionDto getPrescriptionById(Long id);
    List<PrescriptionDto> getPrescriptionsByPatientId(Long patientId);
    List<PrescriptionDto> getPrescriptionsByDoctorId(Long doctorId);
    Page<PrescriptionDto> searchPrescriptions(Long patientId, Long doctorId, String query, Pageable pageable);
}
