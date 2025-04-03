package com.example.test.Entity;

import jakarta.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "cart")
public class Cart {

    @EmbeddedId
    private CartId id;

    @ManyToOne
    @MapsId("userId") 
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("bookId") 
    @JoinColumn(name = "book_id")
    private Book book;

    @Column(name = "is_purchased", nullable = false, columnDefinition = "TINYINT(1) DEFAULT 0")
    private boolean isPurchased;

    @Column(name = "quantity", nullable = false, columnDefinition = "INT DEFAULT 1")
    private int quantity;

    @Column(name = "is_love", nullable = false, columnDefinition = "INT DEFAULT 0")
    private int isLove;

    @Column(name = "created_at", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private java.sql.Timestamp createdAt;


    public CartId getId() {
        return id;
    }

    public void setId(CartId id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public boolean isPurchased() {
        return isPurchased;
    }

    public void setPurchased(boolean purchased) {
        isPurchased = purchased;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getIsLove() {
        return isLove;
    }

    public void setIsLove(int isLove) {
        this.isLove = isLove;
    }

    public java.sql.Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.sql.Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}

@Embeddable
class CartId implements Serializable {
    private int userId;
    private int bookId;

    public CartId() {}

    public CartId(int userId, int bookId) {
        this.userId = userId;
        this.bookId = bookId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getBookId() {
        return bookId;
    }

    public void setBookId(int bookId) {
        this.bookId = bookId;
    }
}
