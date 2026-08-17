package com.pms.service;

import com.pms.dto.DoctorDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DoctorService {
    DoctorDto createDoctor(DoctorDto dto);
    DoctorDto updateDoctor(Long id, DoctorDto dto);
    DoctorDto getDoctorById(Long id);
    DoctorDto getDoctorByUserId(Long userId);
    List<DoctorDto> getAllDoctors();
    Page<DoctorDto> searchDoctors(String query, Long departmentId, String status, Pageable pageable);
    void deleteDoctor(Long id);
}
