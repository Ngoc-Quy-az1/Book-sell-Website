package com.example.test.Entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class CartId implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private Integer userId;
    private Integer bookId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartId that = (CartId) o;
        return java.util.Objects.equals(userId, that.userId) && 
               java.util.Objects.equals(bookId, that.bookId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(userId, bookId);
    }
} 