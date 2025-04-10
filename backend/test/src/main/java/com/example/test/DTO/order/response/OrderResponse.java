package com.example.test.DTO.order.response;

import com.example.test.Entity.Orders;
import com.example.test.Entity.User.MembershipLevel;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderResponse {
    private Integer orderId;
    private Integer userId;
    private BigDecimal originalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String appliedDiscountCode;
    private boolean membershipUpgraded = false;
    private String membershipMessage;
    private String newMembershipLevel;

    public static OrderResponse build(Orders order, BigDecimal originalAmount, BigDecimal discountAmount, String appliedCode) {
        OrderResponse dto = new OrderResponse();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUserId());
        dto.setOriginalAmount(originalAmount);
        dto.setDiscountAmount(discountAmount);
        dto.setFinalAmount(order.getTotalAmount());
        dto.setAppliedDiscountCode(appliedCode);
        return dto;
    }

    public void setUpgradeInfo(MembershipLevel newLevel) {
        this.membershipUpgraded = true;
        this.newMembershipLevel = newLevel.name();
        this.membershipMessage = "Chúc mừng! Bạn đã được nâng cấp lên thành viên " + newLevel.name();
    }
} 