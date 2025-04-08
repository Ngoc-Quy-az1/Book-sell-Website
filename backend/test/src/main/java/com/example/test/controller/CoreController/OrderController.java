package com.example.test.controller.CoreController;

import com.example.test.DTO.order.request.CreateOrderRequest;
import com.example.test.DTO.order.response.OrderResponse;
import com.example.test.Entity.Orders;
import com.example.test.Service.CartService;
import com.example.test.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartService cartService;

    /**
     * Tạo đơn hàng mới
     * Method: POST
     * URL: http://localhost:8090/api/order/create
     * 
     * Request Body:
     * {
     *   "userId": 14,      // ID của người dùng
     *   "bookIds": [15]    // Mảng chứa ID của các sách muốn mua
     * }
     * 
     * Success Response (200 OK):
     * {
     *   "orderId": 8,          // ID của đơn hàng vừa tạo
     *   "userId": 14,          // ID của người mua
     *   "totalAmount": 12920000.00,  // Tổng tiền đơn hàng
     *   "membershipUpgraded": true,  // Đánh dấu có nâng cấp membership
     *   "membershipMessage": "Chúc mừng! Bạn đã được nâng cấp lên thành viên Platinum",
     *   "newMembershipLevel": "Platinum"
     * }
     * 
     * Error Response (400 Bad Request):
     * {
     *   "error": "Lỗi khi tạo đơn hàng: [chi tiết lỗi]"
     * }
     * 
     * Lưu ý:
     * 1. Sản phẩm phải có trong giỏ hàng trước khi đặt
     * 2. Số lượng sách sẽ được lấy từ giỏ hàng
     * 3. Tổng tiền được tính dựa trên giá đã giảm của sách
     * 4. Membership được tự động nâng cấp nếu đủ điều kiện:
     *    - Silver -> Gold: Tổng chi tiêu đạt 5,000,000 VND
     *    - Gold -> Platinum: Tổng chi tiêu đạt 10,000,000 VND
     */
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            OrderResponse response = orderService.createOrder(request);
            cartService.removeFromCart(request.getUserId(), request.getBookIds());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 
