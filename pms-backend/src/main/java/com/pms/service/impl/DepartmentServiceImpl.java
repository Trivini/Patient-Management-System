package com.pms.service.impl;

import com.pms.dto.DepartmentDto;
import com.pms.entity.Department;
import com.pms.exception.DuplicateResourceException;
import com.pms.exception.ResourceNotFoundException;
import com.pms.exception.ValidationException;
import com.pms.repository.DepartmentRepository;
import com.pms.repository.DoctorRepository;
import com.pms.service.DepartmentService;
import com.pms.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    @Transactional
    public DepartmentDto createDepartment(DepartmentDto dto) {
        if (departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Department with name '" + dto.getName() + "' already exists");
        }

        Department department = Department.builder()
                .departmentCode(IdGenerator.generateDepartmentCode(System.currentTimeMillis() % 1000))
                .name(dto.getName())
                .description(dto.getDescription())
                .headDoctorName(dto.getHeadDoctorName())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();

        department = departmentRepository.save(department);
        department.setDepartmentCode(IdGenerator.generateDepartmentCode(department.getId()));
        department = departmentRepository.save(department);

        return mapToDto(department);
    }

    @Override
    @Transactional
    public DepartmentDto updateDepartment(Long id, DepartmentDto dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        if (!department.getName().equalsIgnoreCase(dto.getName()) && departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Department with name '" + dto.getName() + "' already exists");
        }

        department.setName(dto.getName());
        department.setDescription(dto.getDescription());
        department.setHeadDoctorName(dto.getHeadDoctorName());
        if (dto.getStatus() != null) department.setStatus(dto.getStatus());

        return mapToDto(departmentRepository.save(department));
    }

    @Override
    public DepartmentDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return mapToDto(department);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        long doctorCount = doctorRepository.countByDepartmentId(id);
        if (doctorCount > 0) {
            throw new ValidationException("Cannot delete department '" + department.getName() + "'. It has " + doctorCount + " assigned active doctor(s).");
        }

        departmentRepository.delete(department);
    }

    private DepartmentDto mapToDto(Department dept) {
        long doctorCount = doctorRepository.countByDepartmentId(dept.getId());
        return DepartmentDto.builder()
                .id(dept.getId())
                .departmentCode(dept.getDepartmentCode())
                .name(dept.getName())
                .description(dept.getDescription())
                .headDoctorName(dept.getHeadDoctorName())
                .status(dept.getStatus())
                .doctorCount(doctorCount)
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
