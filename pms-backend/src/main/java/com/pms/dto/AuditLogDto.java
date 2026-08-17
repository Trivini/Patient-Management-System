package com.pms.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogDto {
    private Long id;
    private String userEmail;
    private String userRole;
    private String action;
    private String module;
    private String details;
    private String referenceId;
    private String ipAddress;
    private LocalDateTime timestamp;
}
