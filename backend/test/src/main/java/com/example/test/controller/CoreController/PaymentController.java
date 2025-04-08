package com.example.test.controller.CoreController;

import com.example.test.Entity.Orders;
import com.example.test.Entity.PurchaseHistory;
import com.example.test.Entity.PurchaseStatus;
import com.example.test.Service.PaymentService;
import com.example.test.Repository.PurchaseHistoryRepo.PurchaseHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.Base64;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    // Lấy danh sách đơn hàng chờ thanh toán của người dùng
    // @GetMapping("/pending-orders/{userId}")
    // public ResponseEntity<?> getPendingOrders(@PathVariable Integer userId) {
    //     try {
    //         List<PurchaseHistory> pendingOrders = paymentService.getPendingOrders(userId);
    //         return ResponseEntity.ok(pendingOrders);
    //     } catch (Exception e) {
    //         Map<String, String> response = new HashMap<>();
    //         response.put("error", e.getMessage());
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    //     }
    // }

    // Lấy chi tiết đơn hàng
    // @GetMapping("/order-details/{orderId}")
    // public ResponseEntity<?> getOrderDetails(@PathVariable Integer orderId) {
    //     try {
    //         Orders order = paymentService.getOrderDetails(orderId);
    //         return ResponseEntity.ok(order);
    //     } catch (Exception e) {
    //         Map<String, String> response = new HashMap<>();
    //         response.put("error", e.getMessage());
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    //     }
    // }

    // Tạo yêu cầu thanh toán và sinh QR code
    @PostMapping("/create-payment/{orderId}")
    public ResponseEntity<?> createPayment(@PathVariable Integer orderId) {
        try {
            PurchaseHistory purchaseHistory = purchaseHistoryRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

            // In ra log để debug
            System.out.println("Order status: " + purchaseHistory.getStatus());
            System.out.println("Order amount: " + purchaseHistory.getTotalAmount());

            if (purchaseHistory.getStatus() != PurchaseStatus.Pending) {
                throw new RuntimeException("Đơn hàng không ở trạng thái chờ thanh toán");
            }

            // Tạo URL thanh toán VNPay
            String paymentUrl = paymentService.createPaymentUrl(purchaseHistory);
            
            // Tạo QR code từ URL thanh toán
            byte[] qrCodeImage = paymentService.generateQRCode(paymentUrl);
            String qrCodeBase64 = Base64.getEncoder().encodeToString(qrCodeImage);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", orderId);
            response.put("amount", purchaseHistory.getTotalAmount());
            response.put("paymentUrl", paymentUrl);
            response.put("qrCode", qrCodeBase64);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); 
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Kiểm tra trạng thái thanh toán
    @GetMapping("/check-status/{orderId}")
    public ResponseEntity<?> checkPaymentStatus(@PathVariable Integer orderId) {
        try {
            PurchaseStatus status = paymentService.checkOrderStatus(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("status", status.toString());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // In ra log để debug
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Xử lý callback từ VNPay
    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> queryParams) {
        try {
            boolean isValidPayment = paymentService.processPaymentResponse(queryParams);
            String orderId = queryParams.get("vnp_TxnRef");
            String transactionNo = queryParams.get("vnp_TransactionNo");
            String responseCode = queryParams.get("vnp_ResponseCode");

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", orderId);
            response.put("transactionNo", transactionNo);
            response.put("isSuccess", isValidPayment);
            response.put("message", isValidPayment ? "Thanh toán thành công" : "Thanh toán thất bại");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // In ra log để debug
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
} 