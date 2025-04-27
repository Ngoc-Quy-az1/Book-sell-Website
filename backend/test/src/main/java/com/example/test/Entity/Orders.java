package com.example.test.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@Entity
@Table(name = "orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Integer orderId;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "applied_discount_code_id")
    private Integer appliedDiscountCodeId;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount;

    @Column(name = "final_amount")
    private BigDecimal finalAmount;

    @Column(name = "original_amount")
    private BigDecimal originalAmount;




    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
}