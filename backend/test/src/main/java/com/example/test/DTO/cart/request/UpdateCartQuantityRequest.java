package com.example.test.DTO.cart.request;

import lombok.Data;

@Data
public class UpdateCartQuantityRequest {
    private Integer userId;
    private Integer bookId;
    private Integer quantity;
} 