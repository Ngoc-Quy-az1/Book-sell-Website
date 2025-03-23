package com.example.test.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "notifications_user")
public class NotificationsUser {

    @EmbeddedId
    private NotificationsUserId id;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @MapsId("notificationId")
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;

    public NotificationsUserId getId() {
        return id;
    }

    public void setId(NotificationsUserId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Notification getNotification() {
        return notification;
    }

    public void setNotification(Notification notification) {
        this.notification = notification;
    }
}

@Embeddable
class NotificationsUserId implements java.io.Serializable {
    private int userId;
    private int notificationId;

    public NotificationsUserId() {}

    public NotificationsUserId(int userId, int notificationId) {
        this.userId = userId;
        this.notificationId = notificationId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(int notificationId) {
        this.notificationId = notificationId;
    }
}
