package com.example.test.Entity.WishList;

import com.example.test.Entity.Book;
import com.example.test.Entity.User;
import jakarta.persistence.*;

@Entity
@Table(name = "wishlist")
public class Wishlist {

    @EmbeddedId
    private WishlistId id;

    @ManyToOne
    @MapsId("user_id")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @MapsId("book_id")
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    public WishlistId getId() {
        return id;
    }

    public void setId(WishlistId id) {
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
}
