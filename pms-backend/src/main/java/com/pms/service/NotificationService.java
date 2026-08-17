package com.pms.service;

import com.pms.entity.Notification;
import com.pms.entity.User;
import java.util.List;

public interface NotificationService {
    Notification createNotification(User user, String title, String message, String type, String linkUrl);
    List<Notification> getUserNotifications(Long userId);
    List<Notification> getUnreadUserNotifications(Long userId);
    long getUnreadCount(Long userId);
    void markAsRead(Long notificationId);
    void markAllAsRead(Long userId);
}
