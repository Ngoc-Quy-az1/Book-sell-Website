package com.example.test.Service;

import com.example.test.DTO.order.request.CreateOrderRequest;
import com.example.test.DTO.order.response.OrderResponse;
import com.example.test.Entity.*;
import com.example.test.Entity.User.MembershipLevel;
import com.example.test.Repository.BookRepo.BookRepository;
import com.example.test.Repository.CartRepo.CartRepository;
import com.example.test.Repository.OrdersRepo.OrderDetailsRepository;
import com.example.test.Repository.OrdersRepo.OrderRepository;
import com.example.test.Repository.PurchaseHistoryRepo.PurchaseHistoryRepository;
import com.example.test.Repository.UserRepo.NotificationRepository;
import com.example.test.Repository.UserRepo.UserRepository;
import com.example.test.Entity.DiscountCode;
import com.example.test.Entity.DiscountCodesNumberCode;
import com.example.test.Repository.DiscountCodeRepository;
import com.example.test.Repository.DiscountCodesNumberCodeRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.time.LocalDate;
import java.math.RoundingMode;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailsRepository orderDetailsRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    @Autowired
    private DiscountCodesNumberCodeRepository discountCodesNumberCodeRepository;

    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        try {
            BigDecimal originalTotalAmount = BigDecimal.ZERO;
            List<Cart> cartItems = new ArrayList<>();
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // 1. Tính tổng tiền gốc từ giỏ hàng
            for (Integer bookId : request.getBookIds()) {
                Cart cart = cartRepository.findByUserIdAndBookId(request.getUserId(), bookId);
                if (cart == null) {
                    throw new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng với bookId: " + bookId);
                }
                if (cart.getIsPurchased()) {
                    throw new RuntimeException("Sản phẩm đã được mua: " + bookId);
                }
                
                Book book = bookRepository.findById(bookId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với ID: " + bookId));
                
                BigDecimal itemPrice = BigDecimal.valueOf(book.getPrice_discounted())
                        .multiply(BigDecimal.valueOf(cart.getQuantity()));
                originalTotalAmount = originalTotalAmount.add(itemPrice);
                cartItems.add(cart);
            }

            BigDecimal discountAmount = BigDecimal.ZERO;
            BigDecimal finalAmount = originalTotalAmount;
            DiscountCode appliedDiscount = null;
            String appliedCodeString = null; // Lưu mã code để trả về response

            // 2. Xử lý mã giảm giá nếu có
            if (request.getDiscountCode() != null && !request.getDiscountCode().isEmpty()) {
                String requestedDiscountCode = request.getDiscountCode();
                // Tìm bản ghi liên kết user và code
                DiscountCodesNumberCode userOwnedCode = discountCodesNumberCodeRepository
                        .findByUserIdAndDiscountCode_Code(request.getUserId(), requestedDiscountCode)
                        .orElseThrow(() -> new RuntimeException("Mã giảm giá '" + requestedDiscountCode + "' không hợp lệ hoặc không thuộc về bạn."));

                appliedDiscount = userOwnedCode.getDiscountCode();
                appliedCodeString = appliedDiscount.getCode();
                
                // Kiểm tra hạn sử dụng
                if (appliedDiscount.getExpirationDate().isBefore(LocalDate.now())) {
                    throw new RuntimeException("Mã giảm giá '" + appliedCodeString + "' đã hết hạn.");
                }

                // Kiểm tra số lượt sử dụng còn lại (number_code)
                if (userOwnedCode.getNumberCode() <= 0) {
                    throw new RuntimeException("Mã giảm giá '" + appliedCodeString + "' đã hết lượt sử dụng.");
                }

                // Tính số tiền giảm và số tiền cuối cùng
                discountAmount = originalTotalAmount
                    .multiply(appliedDiscount.getDiscountPercentage().divide(BigDecimal.valueOf(100)))
                    .setScale(2, RoundingMode.HALF_UP);
                
                finalAmount = originalTotalAmount.subtract(discountAmount);

                // Giảm số lượt sử dụng đi 1 và lưu lại
                discountCodesNumberCodeRepository.updateNumberCode(
                    userOwnedCode.getUserId(),
                    userOwnedCode.getDiscountCode().getCodeId(),
                    userOwnedCode.getNumberCode() - 1
                );
            }

            // 3. Tạo đơn hàng mới (lưu finalAmount vào cột total_amount)
            Orders order = new Orders();
            order.setUserId(request.getUserId());
            order.setTotalAmount(finalAmount);
            order = orderRepository.save(order);

            // 4. Tạo lịch sử mua hàng (lưu finalAmount vào total_amount)
            PurchaseHistory purchaseHistory = new PurchaseHistory();
            purchaseHistory.setOrderId(order.getOrderId());
            purchaseHistory.setUserId(request.getUserId());
            purchaseHistory.setTotalAmount(finalAmount); // Lưu số tiền cuối cùng
            purchaseHistory.setStatus(PurchaseStatus.Pending);
            purchaseHistory.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            purchaseHistoryRepository.save(purchaseHistory);

            // 5. Tạo chi tiết đơn hàng và cập nhật số lượng sách
            for (Cart cart : cartItems) {
                Book book = bookRepository.findById(cart.getBookId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với ID: " + cart.getBookId()));

                OrderDetails orderDetail = new OrderDetails();
                orderDetail.setOrderId(order.getOrderId());
                orderDetail.setBookId(cart.getBookId());
                orderDetail.setQuantity(cart.getQuantity());
                orderDetail.setPrice(BigDecimal.valueOf(book.getPrice_discounted()));
                orderDetailsRepository.save(orderDetail);

                cartRepository.delete(cart);
                book.setStock(book.getStock() - cart.getQuantity());
                bookRepository.save(book);
            }

            // 6. Kiểm tra và nâng cấp membership (dựa trên finalAmount)
            MembershipLevel newLevel = adminService.checkAndUpgradeMembership(request.getUserId(), finalAmount);
            
            // 7. Tạo response với đầy đủ thông tin tính toán
            OrderResponse response = OrderResponse.build(order, originalTotalAmount, discountAmount, appliedCodeString);
            if (newLevel != null) {
                response.setUpgradeInfo(newLevel);
                // Gửi thông báo nâng cấp (giữ nguyên)
                Notification notification = new Notification();
                notification.setUser(user);
                notification.setMessage("Bạn đã được nâng cấp lên cấp độ hội viên: " + newLevel.name());
                notification.setCreatedAt(new Date());
                notification.setRead(false);
                notificationRepository.save(notification);
            }
            
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo đơn hàng: " + e.getMessage());
        }
    }
} 