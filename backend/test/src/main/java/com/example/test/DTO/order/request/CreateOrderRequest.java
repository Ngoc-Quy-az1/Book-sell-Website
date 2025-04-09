package com.example.test.DTO.order.request;

import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Integer userId;
    private List<Integer> bookIds;
    private String discountCode;
} 