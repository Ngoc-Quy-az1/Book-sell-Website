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
     * Tạo đơn hàng mới, có thể áp dụng mã giảm giá.
     * 
     * **URL:** `http://localhost:8090/api/order/create`
     * 
     * **Headers:**
     *   - `Content-Type`: `application/json`
     *   - `Authorization`: `Bearer {your_jwt_token}`
     * 
     * **Request Body (Không có mã giảm giá):**
     * ```json
     * {
     *   "userId": 14,
     *   "bookIds": [15, 16]
     * }
     * ```
     * 
     * **Request Body (Có mã giảm giá):**
     * ```json
     * {
     *   "userId": 14,
     *   "bookIds": [15, 16],
     *   "discountCode": "OFFC5Y2R" 
     * }
     * ```
     * 
     * **Success Response (200 OK - Không có giảm giá, không nâng cấp):**
     * ```json
     * {
     *   "orderId": 9,
     *   "userId": 14,
     *   "originalAmount": 500000.00,
     *   "discountAmount": 0.00,
     *   "finalAmount": 500000.00,
     *   "appliedDiscountCode": null,
     *   "membershipUpgraded": false,
     *   "membershipMessage": null,
     *   "newMembershipLevel": null
     * }
     * ```
     * 
     * **Success Response (200 OK - Có giảm giá, có nâng cấp):**
     * ```json
     * {
     *   "orderId": 10,
     *   "userId": 14,
     *   "originalAmount": 12000000.00,
     *   "discountAmount": 3600000.00,
     *   "finalAmount": 8400000.00,
     *   "appliedDiscountCode": "OFFC5Y2R",
     *   "membershipUpgraded": true,
     *   "membershipMessage": "Chúc mừng! Bạn đã được nâng cấp lên thành viên Platinum",
     *   "newMembershipLevel": "Platinum"
     * }
     * ```
     * 
     * **Error Response (400 Bad Request):**
     * ```json
     * {
     *   "error": "Lỗi khi tạo đơn hàng: Mã giảm giá 'INVALIDCODE' không hợp lệ hoặc không thuộc về bạn."
     * }
     * ```
     * hoặc
     * ```json
     * {
     *   "error": "Lỗi khi tạo đơn hàng: Không tìm thấy sản phẩm trong giỏ hàng với bookId: 99"
     * }
     * ```
     * 
     * **Lưu ý:**
     * 1. Sản phẩm phải có trong giỏ hàng trước khi đặt.
     * 2. Mã giảm giá phải hợp lệ, còn hạn và thuộc về người dùng.
     * 3. `total_amount` trong DB sẽ lưu `finalAmount` (sau khi giảm giá).
     * 4. Membership được nâng cấp dựa trên `finalAmount`.
     */
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            OrderResponse response = orderService.createOrder(request);
            // Xóa khỏi giỏ hàng sau khi đặt thành công
            cartService.removeFromCart(request.getUserId(), request.getBookIds()); 
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Trả về lỗi dưới dạng text đơn giản
            return ResponseEntity.badRequest().body("Lỗi khi tạo đơn hàng: " + e.getMessage()); 
        }
    }
} 
