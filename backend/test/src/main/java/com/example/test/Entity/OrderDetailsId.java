package com.example.test.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class OrderDetailsId implements Serializable {
    private static final long serialVersionUID = 1L;

    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "book_id")
    private Integer bookId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderDetailsId that = (OrderDetailsId) o;
        return java.util.Objects.equals(orderId, that.orderId) && 
               java.util.Objects.equals(bookId, that.bookId);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(orderId, bookId);
    }
} 