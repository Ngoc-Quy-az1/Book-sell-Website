package com.example.test.controller.CoreController;

import com.example.test.DTO.cart.request.AddToCartRequest;
import com.example.test.DTO.cart.request.UpdateCartQuantityRequest;
import com.example.test.Entity.Cart;
import com.example.test.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public String addToCart(@RequestBody AddToCartRequest request) {
        try {
            Cart cart = cartService.addToCart(request.getUserId(), request.getBookId(), 1);
            return "Thêm vào giỏ hàng thành công!";
        } catch (Exception e) {
            return  e.getMessage();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getCartByUserId(@PathVariable Integer userId) {
        try {
            List<Cart> cartItems = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cartItems);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-quantity")
    public ResponseEntity<?> updateCartQuantity(@RequestBody UpdateCartQuantityRequest request) {
        try {
            Cart cart = cartService.updateCartQuantity(
                request.getUserId(), 
                request.getBookId(), 
                request.getQuantity()
            );
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/{bookId}")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Integer userId,
            @PathVariable Integer bookId) {
        try {
            cartService.removeFromCart(userId, bookId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 