package com.example.test.DTO.order.response;

import com.example.test.Entity.Orders;
import com.example.test.Entity.User.MembershipLevel;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderResponse {
    private Integer orderId;
    private Integer userId;
    private BigDecimal totalAmount;
    private boolean membershipUpgraded;
    private String membershipMessage;
    private MembershipLevel newMembershipLevel;

    public static OrderResponse fromOrder(Orders order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setUserId(order.getUserId());
        response.setTotalAmount(order.getTotalAmount());
        response.setMembershipUpgraded(false); 
        return response;
    }

    public void setUpgradeInfo(MembershipLevel newLevel) {
        this.membershipUpgraded = true;
        this.newMembershipLevel = newLevel;
        this.membershipMessage = String.format("Chúc mừng! Bạn đã được nâng cấp lên thành viên %s", newLevel.name());
    }
} 