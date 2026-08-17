package com.pms.service;

import com.pms.dto.DepartmentDto;
import java.util.List;

public interface DepartmentService {
    DepartmentDto createDepartment(DepartmentDto dto);
    DepartmentDto updateDepartment(Long id, DepartmentDto dto);
    DepartmentDto getDepartmentById(Long id);
    List<DepartmentDto> getAllDepartments();
    void deleteDepartment(Long id);
}
