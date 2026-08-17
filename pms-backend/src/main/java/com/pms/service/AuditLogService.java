package com.pms.service;

import com.pms.dto.AuditLogDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AuditLogService {
    void logAction(String userEmail, String userRole, String action, String module, String details, String referenceId, String ipAddress);
    List<AuditLogDto> getRecentLogs();
    Page<AuditLogDto> searchLogs(String module, String userEmail, String query, Pageable pageable);
}
