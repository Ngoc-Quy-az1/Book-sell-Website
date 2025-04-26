package com.example.test.Service;

import com.example.test.DTO.order.request.CreateOrderRequest;
import com.example.test.DTO.order.response.OrderResponse;
import com.example.test.DTO.order.response.OrderDetailsResponseDTO;

import com.example.test.Entity.*;
import com.example.test.Entity.User.MembershipLevel;
import com.example.test.Repository.BookRepo.BookRepository;
import com.example.test.Repository.CartRepo.CartRepository;
import com.example.test.Repository.OrdersRepo.OrderDetailsRepository;
import com.example.test.Repository.OrdersRepo.OrderRepository;
import com.example.test.Repository.PurchaseHistoryRepo.PurchaseHistoryRepository;
import com.example.test.Repository.UserRepo.NotificationRepository;
import com.example.test.Repository.UserRepo.UserRepository;
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
import java.util.stream.Collectors;

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
            System.out.println("Bắt đầu tạo đơn hàng...");
            
            // 1. Tính tổng tiền và lấy thông tin giỏ hàng
            BigDecimal originalTotalAmount = BigDecimal.ZERO;
            List<Cart> cartItems = new ArrayList<>();
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

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
            System.out.println("Đã tính tổng tiền giỏ hàng: " + originalTotalAmount);

            // 2. Xử lý mã giảm giá nếu có
            Orders order = new Orders();
            
            BigDecimal discountAmount = BigDecimal.ZERO;
            BigDecimal finalAmount = originalTotalAmount;
            String appliedCodeString = null;

            if (request.getDiscountCode() != null && !request.getDiscountCode().isEmpty()) {
                String requestedDiscountCode = request.getDiscountCode();
                // Tìm bản ghi liên kết user và code
                DiscountCodesNumberCode userOwnedCode = discountCodesNumberCodeRepository
                        .findByUserIdAndDiscountCode_Code(request.getUserId(), requestedDiscountCode)
                        .orElseThrow(() -> new RuntimeException("Mã giảm giá '" + requestedDiscountCode + "' không hợp lệ hoặc không thuộc về bạn."));

                DiscountCode appliedDiscount = userOwnedCode.getDiscountCode();
                appliedCodeString = appliedDiscount.getCode();
                
                // Kiểm tra hạn sử dụng
                if (appliedDiscount.getExpirationDate().isBefore(LocalDate.now())) {
                    throw new RuntimeException("Mã giảm giá '" + appliedCodeString + "' đã hết hạn.");
                }

                // Kiểm tra số lượt sử dụng còn lại (number_code)
                if (userOwnedCode.getNumberCode() <= 0) {
                    throw new RuntimeException("Mã giảm giá '" + appliedCodeString + "' đã hết lượt sử dụng.");
                }

                order.setAppliedDiscountCodeId(appliedDiscount.getCodeId()); 
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
            System.out.println("Đã xử lý mã giảm giá, tổng tiền cuối cùng: " + finalAmount);


            order.setUserId(request.getUserId());
            order.setTotalAmount(finalAmount);
            order.setDiscountAmount(discountAmount);
            order.setFinalAmount(finalAmount);
            order.setOriginalAmount(originalTotalAmount);
            order = orderRepository.save(order);
            System.out.println("Đã tạo order với ID: " + order.getOrderId());

            // 4. Tạo purchase history với cùng order_id
            PurchaseHistory purchaseHistory = new PurchaseHistory();
            purchaseHistory.setOrderId(order.getOrderId()); 
            purchaseHistory.setUserId(request.getUserId());
            purchaseHistory.setTotalAmount(finalAmount);
            purchaseHistory.setStatus(PurchaseStatus.Pending);
            purchaseHistory.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            purchaseHistory = purchaseHistoryRepository.save(purchaseHistory);
            System.out.println("Đã tạo purchase history với ID: " + purchaseHistory.getOrderId());

            // 5. Tạo order details và cập nhật số lượng sách
            for (Cart cart : cartItems) {
                Book book = bookRepository.findById(cart.getBookId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với ID: " + cart.getBookId()));

                OrderDetails orderDetail = new OrderDetails();
                orderDetail.setOrderId(order.getOrderId()); // Sử dụng order_id từ orders
                orderDetail.setBookId(cart.getBookId());
                orderDetail.setQuantity(cart.getQuantity());
                orderDetail.setPrice(BigDecimal.valueOf(book.getPrice_discounted()));
                
                try {
                    orderDetailsRepository.save(orderDetail);
                    System.out.println("Đã tạo order detail cho order ID: " + orderDetail.getOrderId() + ", book ID: " + orderDetail.getBookId());
                } catch (Exception e) {
                    System.err.println("Lỗi khi tạo order detail: " + e.getMessage());
                    throw e;
                }

                cartRepository.delete(cart);
                book.setStock(book.getStock() - cart.getQuantity());
                bookRepository.save(book);
            }

            // 6. Kiểm tra và nâng cấp membership
            MembershipLevel newLevel = adminService.checkAndUpgradeMembership(request.getUserId(), finalAmount);
            if (newLevel != null) {
                System.out.println("Đã nâng cấp membership lên: " + newLevel);
                Notification notification = new Notification();
                notification.setUser(user);
                notification.setMessage("Bạn đã được nâng cấp lên cấp độ hội viên: " + newLevel.name());
                notification.setCreatedAt(new Date());
                notification.setRead(false);
                notificationRepository.save(notification);
            }

            // 7. Tạo response
            OrderResponse response = OrderResponse.build(order, originalTotalAmount, discountAmount, appliedCodeString);
            if (newLevel != null) {
                response.setUpgradeInfo(newLevel);
            }
            
            System.out.println("Hoàn thành tạo đơn hàng!");
            return response;
        } catch (Exception e) {
            System.err.println("Lỗi khi tạo đơn hàng: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo đơn hàng: " + e.getMessage());
        }
    }

    // Hàm lấy danh sách các đơn hàng của người dùng
    @Transactional
    public List<PurchaseHistory> getOrdersByUserId(int userId) {
        return purchaseHistoryRepository.findByUserId(userId);
    }


    //Hàm trả về chi tiết đơn hàng 
    @Transactional
    public List<OrderDetailsResponseDTO> getOrderDetails(Integer orderId) {
        // Get the order
        Orders order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
            
        // Get all order details for this order
        List<OrderDetails> orderDetailsList = orderDetailsRepository.findByOrderId(orderId);
        if (orderDetailsList.isEmpty()) {
            throw new RuntimeException("No order details found for order id: " + orderId);
        }
        
        // Convert each order detail to DTO
        return orderDetailsList.stream()
            .map(orderDetails -> OrderDetailsResponseDTO.build(order, orderDetails))
            .collect(Collectors.toList());
    }


} 