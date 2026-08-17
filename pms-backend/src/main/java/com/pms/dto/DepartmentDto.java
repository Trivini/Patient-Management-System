package com.pms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentDto {
    private Long id;
    private String departmentCode;
    private String name;
    private String description;
    private String headDoctorName;
    private String status;
    private Long doctorCount;
    private LocalDateTime createdAt;
}
