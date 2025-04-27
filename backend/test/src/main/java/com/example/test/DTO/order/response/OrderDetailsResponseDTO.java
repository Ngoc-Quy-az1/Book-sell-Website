package com.example.test.DTO.order.response;

import com.example.test.Entity.OrderDetails;
import com.example.test.Entity.Orders;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderDetailsResponseDTO {
    private Integer orderId;
    private BigDecimal originalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private int PercentDiscount;
    private String bookName;
    private int quantity;
    private BigDecimal price;


    public static OrderDetailsResponseDTO build(Orders order, OrderDetails orderDetails) {
        OrderDetailsResponseDTO dto = new OrderDetailsResponseDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOriginalAmount(order.getOriginalAmount());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setFinalAmount(order.getFinalAmount());
        
        // Calculate discount percentage
        if (order.getOriginalAmount() != null && order.getOriginalAmount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountPercent = order.getDiscountAmount()
                .multiply(BigDecimal.valueOf(100))
                .divide(order.getOriginalAmount(), 0, BigDecimal.ROUND_HALF_UP);
            dto.setPercentDiscount(discountPercent.intValue());
        } else {
            dto.setPercentDiscount(0);
        }
        
        // Set book details
        if (orderDetails.getBook() != null) {
            dto.setBookName(orderDetails.getBook().getTitle());
        }
        dto.setQuantity(orderDetails.getQuantity());
        dto.setPrice(orderDetails.getPrice());
        
        return dto;
    }
}