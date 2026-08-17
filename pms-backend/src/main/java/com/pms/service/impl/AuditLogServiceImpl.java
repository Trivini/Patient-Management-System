package com.pms.service.impl;

import com.pms.dto.AuditLogDto;
import com.pms.entity.AuditLog;
import com.pms.repository.AuditLogRepository;
import com.pms.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Override
    public void logAction(String userEmail, String userRole, String action, String module, String details, String referenceId, String ipAddress) {
        AuditLog log = AuditLog.builder()
                .userEmail(userEmail != null ? userEmail : "SYSTEM")
                .userRole(userRole != null ? userRole : "SYSTEM")
                .action(action)
                .module(module)
                .details(details)
                .referenceId(referenceId)
                .ipAddress(ipAddress != null ? ipAddress : "127.0.0.1")
                .build();
        auditLogRepository.save(log);
    }

    @Override
    public List<AuditLogDto> getRecentLogs() {
        return auditLogRepository.findTop50ByOrderByTimestampDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<AuditLogDto> searchLogs(String module, String userEmail, String query, Pageable pageable) {
        return auditLogRepository.searchLogs(module, userEmail, query, pageable)
                .map(this::mapToDto);
    }

    private AuditLogDto mapToDto(AuditLog log) {
        return AuditLogDto.builder()
                .id(log.getId())
                .userEmail(log.getUserEmail())
                .userRole(log.getUserRole())
                .action(log.getAction())
                .module(log.getModule())
                .details(log.getDetails())
                .referenceId(log.getReferenceId())
                .ipAddress(log.getIpAddress())
                .timestamp(log.getTimestamp())
                .build();
    }
}
