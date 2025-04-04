package com.example.test.Service;

import com.example.test.DTO.order.request.CreateOrderRequest;
import com.example.test.Entity.*;
import com.example.test.Repository.BookRepo.BookRepository;
import com.example.test.Repository.CartRepo.CartRepository;
import com.example.test.Repository.OrdersRepo.OrderDetailsRepository;
import com.example.test.Repository.OrdersRepo.OrderRepository;
import com.example.test.Repository.PurchaseHistoryRepo.PurchaseHistoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

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

    @Transactional
    public Orders createOrder(CreateOrderRequest request) {
        try {
            // Tính tổng tiền và kiểm tra giỏ hàng
            BigDecimal totalAmount = BigDecimal.ZERO;
            List<Cart> cartItems = new ArrayList<>();
            
            // Kiểm tra và lấy thông tin từ giỏ hàng
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
                
                // Tính giá tiền cho mỗi item
                BigDecimal itemPrice = BigDecimal.valueOf(book.getPrice_discounted())
                        .multiply(BigDecimal.valueOf(cart.getQuantity()));
                totalAmount = totalAmount.add(itemPrice);
                cartItems.add(cart);
            }

            // 1. Tạo đơn hàng mới trong bảng orders
            Orders order = new Orders();
            order.setUserId(request.getUserId());
            order.setTotalAmount(totalAmount);
            order = orderRepository.save(order);

            // 2. Tạo lịch sử mua hàng
            PurchaseHistory purchaseHistory = new PurchaseHistory();
            purchaseHistory.setOrderId(order.getOrderId());
            purchaseHistory.setUserId(request.getUserId());
            purchaseHistory.setTotalAmount(totalAmount);
            purchaseHistory.setStatus(PurchaseStatus.Completed);
            purchaseHistory.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            purchaseHistoryRepository.save(purchaseHistory);

            // 3. Tạo chi tiết đơn hàng, xóa khỏi giỏ hàng và cập nhật số lượng sách
            for (Cart cart : cartItems) {
                // Lấy thông tin sách
                Book book = bookRepository.findById(cart.getBookId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với ID: " + cart.getBookId()));

                // Tạo chi tiết đơn hàng
                OrderDetails orderDetail = new OrderDetails();
                orderDetail.setOrderId(order.getOrderId());
                orderDetail.setBookId(cart.getBookId());
                orderDetail.setQuantity(cart.getQuantity());
                orderDetail.setPrice(BigDecimal.valueOf(book.getPrice_discounted()));
                orderDetailsRepository.save(orderDetail);

                // Xóa sản phẩm khỏi giỏ hàng thay vì đánh dấu đã mua
                cartRepository.delete(cart);

                // Cập nhật số lượng sách
                book.setStock(book.getStock() - cart.getQuantity());
                bookRepository.save(book);
            }

            return order;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo đơn hàng: " + e.getMessage());
        }
    }
} 