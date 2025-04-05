package com.example.test.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.sql.Timestamp;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@NoArgsConstructor
@Entity
@Table(name = "cart")
@IdClass(CartId.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Cart {
    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Id
    @Column(name = "book_id")
    private Integer bookId;

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(name = "is_purchased", columnDefinition = "TINYINT(1)")
    private Boolean isPurchased = false;

    @Column(name = "is_love")
    private Integer isLove = 0;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;
}
