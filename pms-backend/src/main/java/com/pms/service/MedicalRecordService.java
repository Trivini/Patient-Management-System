package com.pms.service;

import com.pms.dto.MedicalRecordDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MedicalRecordService {
    MedicalRecordDto createMedicalRecord(MedicalRecordDto dto);
    MedicalRecordDto updateMedicalRecord(Long id, MedicalRecordDto dto);
    MedicalRecordDto getMedicalRecordById(Long id);
    List<MedicalRecordDto> getMedicalRecordsByPatientId(Long patientId);
    List<MedicalRecordDto> getMedicalRecordsByDoctorId(Long doctorId);
    Page<MedicalRecordDto> searchMedicalRecords(Long patientId, Long doctorId, String query, Pageable pageable);
}
