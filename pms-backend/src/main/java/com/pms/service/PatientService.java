package com.pms.service;

import com.pms.dto.PatientDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PatientService {
    PatientDto createPatient(PatientDto dto);
    PatientDto updatePatient(Long id, PatientDto dto);
    PatientDto getPatientById(Long id);
    PatientDto getPatientByUserId(Long userId);
    List<PatientDto> getAllPatients();
    Page<PatientDto> searchPatients(String query, String status, String gender, Pageable pageable);
    void deletePatient(Long id);
}
