package com.example.test.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.test.Entity.Notification;
import com.example.test.Repository.UserRepo.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    //Hàm trả về thông báo của người dùng có id = userId
public List<Map<String, Object>> getNotificationsByUserId(Integer userId) {
    List<Notification> notifications = notificationRepository.findByUserID(userId);

    if (notifications == null || notifications.isEmpty()) {
        return new ArrayList<>();
    }

    List<Map<String, Object>> results = new ArrayList<>();
    for (Notification notification : notifications) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", notification.getNotificationId());
        map.put("is_read", notification.isRead());
        map.put("message", notification.getMessage());
        results.add(map);
    }

    return results;
}

//Hàm chỉnh sửa thông báo của người dùng, khi đã đọc chuyển về trạng thái isRead = true
public void markNotificationAsRead(Integer notificationId) {
    Notification notification = notificationRepository.findById(notificationId).orElse(null);
    if (notification != null) {
        notification.setRead(true);
        notificationRepository.save(notification);
    } 
}

//Hàm xóa thông báo của người dùng
public void deleteNotification(Integer notificationId) {
    Notification notification = notificationRepository.findById(notificationId).orElse(null);
    if (notification != null) {
        notificationRepository.delete(notification);
    } 
}

//Hàm xóa tất cả thông báo của người dùng
public void deleteAllNotificationsByUserId(Integer userId) {
    List<Notification> notifications = notificationRepository.findByUserID(userId);
    if (notifications != null && !notifications.isEmpty()) {
        notificationRepository.deleteAll(notifications);
    } 
}

//Hàm trả về số lượng thông báo chưa đọc của người dùng có id = userId
public int getUnreadNotificationCount(Integer userId) {
    List<Notification> notifications = notificationRepository.findByUserID(userId);
    if (notifications == null || notifications.isEmpty()) {
        return 0;
    }

    int count = 0;
    for (Notification notification : notifications) {
        if (!notification.isRead()) {
            count++;
        }
    }
    return count;
}
}
