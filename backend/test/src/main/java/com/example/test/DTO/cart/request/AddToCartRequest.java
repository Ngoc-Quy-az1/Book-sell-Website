package com.example.test.DTO.cart.request;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Integer userId;
    private Integer bookId;
} 