package com.example.test.controller.CoreController;

import com.example.test.Entity.PurchaseHistory;
import com.example.test.Entity.PurchaseStatus;
import com.example.test.Service.PaymentService;
import com.example.test.Repository.PurchaseHistoryRepo.PurchaseHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    /**
     * API lấy danh sách đơn hàng đang chờ thanh toán
     * Method: GET
     * URL: http://localhost:8090/api/payment/pending-orders
     * 
     * Response thành công:
     * [
     *     {
     *         "orderId": 5,
     *         "amount": "100000",
     *         "userId": 1,
     *         "createdAt": "2024-04-08 10:30:00"
     *     }
     * ]
     * 
     * Response thất bại:
     * {
     *     "error": "Error getting pending orders: ..."
     * }
     */
    @GetMapping("/pending-orders")
    public ResponseEntity<?> getPendingOrders() {
        try {
            List<Map<String, Object>> pendingOrders = paymentService.getPendingOrders();
            return ResponseEntity.ok(pendingOrders);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error getting pending orders: " + e.getMessage());
        }
    }

    /**
     * API thanh toán qua chuyển khoản ngân hàng
     * Method: POST
     * URL: http://localhost:8090/api/payment/check-transfer
     * Body: {
     *    "orderIds": [1, 2, 3],
     *    "userId": 1
     * }
     */
    @PostMapping("/check-transfer")
    public ResponseEntity<?> checkBankTransfer(@RequestBody Map<String, Object> request) {
        try {
            List<Integer> orderIds = (List<Integer>) request.get("orderIds");
            Integer userId = (Integer) request.get("userId");
            
            if (orderIds == null || orderIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn ít nhất một đơn hàng");
            }

            Map<String, Object> result = paymentService.processNewBankTransfer(orderIds, userId);
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error processing bank transfer: " + e.getMessage());
        }
    }

    /**
     * API test kết nối và đọc email từ Sacombank
     * Method: GET
     * URL: http://localhost:8090/api/payment/test-email
     * 
     * Response thành công:
     * {
     *     "amount": "100000",
     *     "date": "08/04/2024 17:44"
     * }
     * 
     * Response thất bại:
     * {
     *     "error": "Error testing email connection: ..."
     * }
     */
    @GetMapping("/test-email")
    public ResponseEntity<?> testEmailConnection() {
        try {
            Map<String, String> result = paymentService.readRecentEmails();
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error testing email connection: " + e.getMessage());
        }
    }

    /**
     * API kiểm tra trạng thái thanh toán của đơn hàng
     * Method: GET
     * URL: http://localhost:8090/api/payment/check-status/{orderId}
     * Example: http://localhost:8090/api/payment/check-status/5
     * 
     * Response thành công:
     * {
     *     "status": "Completed",
     *     "amount": 100000
     * }
     * 
     * Response thất bại:
     * {
     *     "error": "Không tìm thấy đơn hàng"
     * }
     */
    @GetMapping("/check-status/{orderId}")
    public ResponseEntity<?> checkPaymentStatus(@PathVariable Integer orderId) {
        try {
            Optional<PurchaseHistory> purchaseOpt = purchaseHistoryRepository.findById(orderId);
            if (!purchaseOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Không tìm thấy đơn hàng");
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("status", purchaseOpt.get().getStatus().toString());
            response.put("amount", purchaseOpt.get().getTotalAmount());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error checking payment status: " + e.getMessage());
        }
    }

    /**
     * API thanh toán bằng xu
     * Method: POST
     * URL: http://localhost:8090/api/payment/pay-with-balance
     * Body: {
     *    "orderIds": [1, 2, 3],
     *    "userId": 1
     * }
     */
    @PostMapping("/pay-with-balance")
    public ResponseEntity<?> payWithBalance(@RequestBody Map<String, Object> request) {
        try {
            List<Integer> orderIds = (List<Integer>) request.get("orderIds");
            Integer userId = (Integer) request.get("userId");
            
            if (orderIds == null || orderIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn ít nhất một đơn hàng");
            }

            Map<String, Object> result = paymentService.processBalancePayment(orderIds, userId);
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error processing balance payment: " + e.getMessage());
        }
    }
} 