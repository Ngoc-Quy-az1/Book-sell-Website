package com.example.test.controller.CoreController;

import com.example.test.DTO.cart.request.AddToCartRequest;
import com.example.test.DTO.cart.request.UpdateCartQuantityRequest;
import com.example.test.Entity.Cart;
import com.example.test.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * Thêm sản phẩm vào giỏ hàng
     * Method: POST
     * URL: http://localhost:8090/api/cart/add
     * 
     * Request Body:
        * {
        *   "userId": 14,    // ID của người dùng
        *   "bookId": 15,    // ID của sách muốn thêm
        *   "quantity": 1    // Số lượng muốn thêm
        * }
     * 
     * Success Response (200 OK):
     * {
     *   "cartId": 1,
     *   "userId": 14,
     *   "bookId": 15,
     *   "quantity": 1,
     *   "isPurchased": false
     * }
     * 
     */
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> request) {
        try {
            Integer userId = (Integer) request.get("userId");
            Integer bookId = (Integer) request.get("bookId");
            Integer quantity = (Integer) request.get("quantity");
            Cart cart = cartService.addToCart(userId, bookId, quantity);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Lấy giỏ hàng của người dùng
     * Method: GET
     * URL: http://localhost:8090/api/cart/user/{userId}
     * 
     * Path Variable:
     * - userId: ID của người dùng
     * 
     * Success Response (200 OK):
     * [
     *   {
     *     "cartId": 1,
     *     "userId": 14,
     *     "bookId": 15,
     *     "book": {
     *       "id": 15,
     *       "title": "Sách A",
     *       "price": 100000,
     *       "price_discounted": 90000
     *     },
     *     "quantity": 1,
     *     "isPurchased": false
     *   }
     * ]
     * 
     * Error Response (400 Bad Request):
     * {
     *   "error": "Không tìm thấy giỏ hàng của người dùng"
     * }
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCartByUserId(@PathVariable Integer userId) {
        try {
            List<Cart> carts = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(carts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     * Method: PUT
     * URL: http://localhost:8090/api/cart/update-quantity
     * 
     * Request Body:
     * {
     *   "userId": 14,    // ID của người dùng
     *   "bookId": 15,    // ID của sách
     *   "quantity": 2    // Số lượng mới
     * }
     * 
     * Success Response (200 OK):
     * {
     *   "cartId": 1,
     *   "userId": 14,
     *   "bookId": 15,
     *   "quantity": 2,
     *   "isPurchased": false
     * }
     * 
     * Error Response (400 Bad Request):
     * {
     *   "error": "Lỗi khi cập nhật số lượng: [chi tiết lỗi]"
     * }
     */
    @PutMapping("/update-quantity")
    public ResponseEntity<?> updateQuantity(@RequestBody Map<String, Object> request) {
        try {
            Integer userId = (Integer) request.get("userId");
            Integer bookId = (Integer) request.get("bookId");
            Integer quantity = (Integer) request.get("quantity");
            Cart cart = cartService.updateCartQuantity(userId, bookId, quantity);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     * Method: DELETE
     * URL: http://localhost:8090/api/cart/{userId}/{bookId}
     * 
     * Path Variables:
     * - userId: ID của người dùng
     * - bookId: ID của sách muốn xóa
     * 
     * Success Response (200 OK):
     * {
     *   "message": "Đã xóa sản phẩm khỏi giỏ hàng"
     * }
     * 
     * Error Response (400 Bad Request):
     * {
     *   "error": "Lỗi khi xóa sản phẩm: [chi tiết lỗi]"
     * }
     */
    @DeleteMapping("/{userId}/{bookId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Integer userId, @PathVariable Integer bookId) {
        try {
            cartService.removeFromCart(userId, bookId);
            return ResponseEntity.ok().body("Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 