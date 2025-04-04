package com.example.test.controller.CoreController;

import com.example.test.DTO.order.request.CreateOrderRequest;
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

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            Orders order = orderService.createOrder(request);
            cartService.removeFromCart(request.getUserId(), request.getBookIds());
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 