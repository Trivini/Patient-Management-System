package com.pms.repository;

import com.pms.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findTop50ByOrderByTimestampDesc();

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:module IS NULL OR :module = '' OR a.module = :module) AND " +
           "(:userEmail IS NULL OR :userEmail = '' OR LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :userEmail, '%'))) AND " +
           "(:query IS NULL OR :query = '' OR LOWER(a.action) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.details) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<AuditLog> searchLogs(@Param("module") String module,
                             @Param("userEmail") String userEmail,
                             @Param("query") String query,
                             Pageable pageable);
}
