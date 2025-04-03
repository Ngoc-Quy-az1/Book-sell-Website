package com.example.test.Entity.WishList;

import java.io.Serializable;    
import jakarta.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class WishlistId implements Serializable {

    private int user_id;
    private int book_id;

    public WishlistId() {}

    public WishlistId(int user_id, int book_id) {
        this.user_id = user_id;
        this.book_id = book_id;
    }

    public int getUser_id() {
        return user_id;
    }

    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }

    public int getBook_id() {
        return book_id;
    }

    public void setBook_id(int book_id) {
        this.book_id = book_id;
    }

    // Cần override equals() và hashCode() để so sánh đúng các khóa chính kết hợp
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        WishlistId that = (WishlistId) o;
        return user_id == that.user_id && book_id == that.book_id;
    }

    @Override
    public int hashCode() {
        return 31 * user_id + book_id;
    }
}
