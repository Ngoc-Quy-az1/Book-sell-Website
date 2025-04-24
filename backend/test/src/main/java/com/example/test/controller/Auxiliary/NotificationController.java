package com.example.test.controller.Auxiliary;

import com.example.test.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    //Lấy danh sác thông báo người dùng
    //URL test Postman: http://localhost:8090/api/notification/show?userId=16
    @GetMapping("/show")
    public List<Map<String, Object>> getNotifications(@RequestParam Integer userId) {
        return notificationService.getNotificationsByUserId(userId);
    }

    //Chuyển đổi trạng thái thông báo về đã đọc
    // http://localhost:8090/api/notification/mark-read?notificationId=1
 
    @PutMapping("/mark-read")
    public void markAsRead(@RequestParam Integer notificationId) {
        notificationService.markNotificationAsRead(notificationId);
    }

    //Xóa thông báo của người dùng
    //http://localhost:8090/api/notification/delete?notificationId=1
    @DeleteMapping("/delete")
    public void deleteNotification(@RequestParam Integer notificationId) {
        notificationService.deleteNotification(notificationId);
    }

    //Xóa tất cả thông báo của người dùng
    //http://localhost:8090/api/notification/delete-all?userId=1
    @DeleteMapping("/delete-all")
    public void deleteAllNotifications(@RequestParam Integer userId) {
        notificationService.deleteAllNotificationsByUserId(userId);
    }

    //Lấy số lượng thông báo chưa đọc của người dùng
    //http://localhost:8090/api/notification/unread-count?userId=2
    @GetMapping("/unread-count")
    public int getUnreadNotificationCount(@RequestParam Integer userId) {
        return notificationService.getUnreadNotificationCount(userId);
    }
}
