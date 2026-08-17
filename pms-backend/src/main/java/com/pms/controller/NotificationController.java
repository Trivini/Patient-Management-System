package com.pms.controller;

import com.pms.entity.Notification;
import com.pms.entity.User;
import com.pms.repository.UserRepository;
import com.pms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUserNotifications() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(notificationService.getUserNotifications(user.getId()));
    }

    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(notificationService.getUnreadUserNotifications(user.getId()));
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getUnreadCount() {
        User user = getAuthenticatedUser();
        long count = notificationService.getUnreadCount(user.getId());
        Map<String, Object> resp = new HashMap<>();
        resp.put("unreadCount", count);
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Notification marked as read");
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> markAllAsRead() {
        User user = getAuthenticatedUser();
        notificationService.markAllAsRead(user.getId());
        Map<String, String> resp = new HashMap<>();
        resp.put("message", "All notifications marked as read");
        return ResponseEntity.ok(resp);
    }
}
