package com.example.test.Service;

import com.example.test.Entity.Notification;
import com.example.test.Entity.PurchaseHistory;
import com.example.test.Entity.PurchaseStatus;
import com.example.test.Entity.User;
import com.example.test.Repository.PurchaseHistoryRepo.PurchaseHistoryRepository;
import com.example.test.Repository.UserRepo.NotificationRepository;
import com.example.test.Repository.UserRepo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.mail.*;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.internet.MimeBodyPart;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PaymentService {

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${spring.mail.username}")
    private String emailUsername;
    
    @Value("${spring.mail.password}")
    private String emailPassword;

    @Autowired
    private NotificationRepository notificationRepository;
    
    private static final double XU_TO_VND_RATE = 1000.0; // 1 xu = 1000 VND

    /**
     * Get all pending orders that need payment
     */
    public List<Map<String, Object>> getPendingOrders() {
        try {
            List<PurchaseHistory> pendingOrders = purchaseHistoryRepository.findByStatus(PurchaseStatus.Pending);
            List<Map<String, Object>> result = new ArrayList<>();
            
            for (PurchaseHistory order : pendingOrders) {
                Map<String, Object> orderDetails = new HashMap<>();
                orderDetails.put("orderId", order.getOrderId());
                orderDetails.put("amount", order.getTotalAmount().toString());
                orderDetails.put("userId", order.getUserId());
                orderDetails.put("createdAt", order.getCreatedAt().toString());
                result.add(orderDetails);
            }
            
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    /**
     * Process new bank transfer from email and update order status for multiple orders
     */
    @Transactional
    public Map<String, Object> processNewBankTransfer(List<Integer> orderIds, Integer userId) {
        try {
            // Tính tổng tiền của tất cả đơn hàng
            BigDecimal totalAmount = BigDecimal.ZERO;
            List<PurchaseHistory> orders = new ArrayList<>();
            
            for (Integer orderId : orderIds) {
                PurchaseHistory order = purchaseHistoryRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
                
                if (order.getStatus() != PurchaseStatus.Pending) {
                    throw new RuntimeException("Đơn hàng #" + orderId + " không ở trạng thái chờ thanh toán");
                }
                
                if (!order.getUserId().equals(userId)) {
                    throw new RuntimeException("Đơn hàng #" + orderId + " không thuộc về người dùng này");
                }
                
                totalAmount = totalAmount.add(order.getTotalAmount());
                orders.add(order);
            }

            // Đọc email và kiểm tra thanh toán
            Map<String, String> transactionDetails = readRecentEmails();
            if (transactionDetails == null || !transactionDetails.containsKey("amount")) {
                return createResponse(false, "Không tìm thấy email chuyển khoản mới");
            }

            // Kiểm tra số tiền
            String amountStr = transactionDetails.get("amount");
            BigDecimal transactionAmount = new BigDecimal(amountStr);
            
            if (transactionAmount.compareTo(totalAmount) < 0) {
                return createResponse(false, "Số tiền chuyển khoản (" + amountStr + " VND) không đủ để thanh toán tổng đơn hàng (" + totalAmount + " VND)");
            }

            // Cập nhật trạng thái tất cả đơn hàng
            for (PurchaseHistory order : orders) {
                order.setStatus(PurchaseStatus.Completed);
                purchaseHistoryRepository.save(order);
            }
            Notification notification = new Notification();
            notification.setUser(userRepository.findUserByID(userId));
            notification.setMessage("Thanh toán thành công đơn hàng mã" + orderIds + " lúc " + new Date());
            notification.setCreatedAt(new Date());
            notification.setRead(false);
            notificationRepository.save(notification);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Thanh toán thành công " + orders.size() + " đơn hàng");
            result.put("orderIds", orderIds);
            result.put("totalAmount", totalAmount);
            result.put("transactionAmount", transactionAmount);
            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return createResponse(false, "Lỗi xử lý thanh toán: " + e.getMessage());
        }
    }

    /**
     * Process payment using user's balance (xu) for multiple orders
     */
    @Transactional
    public Map<String, Object> processBalancePayment(List<Integer> orderIds, Integer userId) {
        try {
            // Tính tổng tiền của tất cả đơn hàng
            BigDecimal totalAmount = BigDecimal.ZERO;
            List<PurchaseHistory> orders = new ArrayList<>();
            
            for (Integer orderId : orderIds) {
                PurchaseHistory order = purchaseHistoryRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
                
                if (order.getStatus() != PurchaseStatus.Pending) {
                    throw new RuntimeException("Đơn hàng #" + orderId + " không ở trạng thái chờ thanh toán");
                }
                
                if (!order.getUserId().equals(userId)) {
                    throw new RuntimeException("Đơn hàng #" + orderId + " không thuộc về người dùng này");
                }
                
                totalAmount = totalAmount.add(order.getTotalAmount());
                orders.add(order);
            }

            // Lấy thông tin người dùng
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // Tính số xu cần thiết
            double requiredXu = totalAmount.doubleValue() / XU_TO_VND_RATE;

            // Kiểm tra số dư
            if (user.getBalance() < requiredXu) {
                throw new RuntimeException("Số dư xu không đủ. Cần " + requiredXu + " xu, hiện có " + user.getBalance() + " xu");
            }

            // Trừ xu
            user.setBalance(user.getBalance() - requiredXu);
            userRepository.save(user);

            // Cập nhật trạng thái tất cả đơn hàng
            for (PurchaseHistory order : orders) {
                order.setStatus(PurchaseStatus.Completed);
                purchaseHistoryRepository.save(order);
            }

            Notification notification = new Notification();
            notification.setUser(userRepository.findUserByID(userId));
            notification.setMessage("Thanh toán thành công đơn hàng mã" + orderIds + " lúc " + new Date());
            notification.setCreatedAt(new Date());
            notification.setRead(false);
            notificationRepository.save(notification);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Thanh toán thành công " + orders.size() + " đơn hàng bằng " + requiredXu + " xu");
            result.put("orderIds", orderIds);
            result.put("totalAmount", totalAmount);
            result.put("remainingBalance", user.getBalance());         
            return result;

        } catch (Exception e) {
            e.printStackTrace();
            return createResponse(false, e.getMessage());
        }
    }

    /**
     * Read recent Sacombank emails and extract transaction details
     */
    public Map<String, String> readRecentEmails() throws MessagingException, IOException {
        System.out.println("Starting email check with username: " + emailUsername);
        
        Properties props = new Properties();
        props.put("mail.store.protocol", "imaps");
        props.put("mail.imaps.host", "imap.gmail.com");
        props.put("mail.imaps.port", "993");
        props.put("mail.imaps.ssl.enable", "true");
        props.put("mail.debug", "true");

        Session session = Session.getInstance(props, null);
        Store store = session.getStore();
        
        try {
            store.connect("imap.gmail.com", emailUsername, emailPassword);
            System.out.println("Connected to email server");

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_ONLY);

            int totalMessages = inbox.getMessageCount();
            System.out.println("Total messages in inbox: " + totalMessages);
            
            int startMessage = Math.max(1, totalMessages - 10);
            Message[] messages = inbox.getMessages(startMessage, totalMessages);
            System.out.println("Fetched " + messages.length + " recent messages");

            for (int i = messages.length - 1; i >= 0; i--) {
                Message message = messages[i];
                String from = Arrays.toString(message.getFrom());
                String subject = message.getSubject();
                System.out.println("Checking message from: " + from + ", subject: " + subject);

                if (from.toLowerCase().contains("sacombank") || 
                    (subject != null && subject.toUpperCase().contains("SACOMBANK"))) {
                    
                    String content = getEmailContent(message);
                    System.out.println("Email content: " + content);
                    
                    Map<String, String> transactionDetails = new HashMap<>();

                    Pattern amountPattern = Pattern.compile("\\+\\s*([\\d,]+)\\s*VND");
                    Matcher amountMatcher = amountPattern.matcher(content);
                    
                    if (amountMatcher.find()) {
                        String amountStr = amountMatcher.group(1).replace(",", "");
                        System.out.println("Found transaction amount: " + amountStr);
                        transactionDetails.put("amount", amountStr);
                        
                        Pattern datePattern = Pattern.compile("(\\d{2}/\\d{2}/\\d{4}\\s+\\d{2}:\\d{2})");
                        Matcher dateMatcher = datePattern.matcher(content);
                        if (dateMatcher.find()) {
                            transactionDetails.put("date", dateMatcher.group(1));
                        }
                        
                        return transactionDetails;
                    }
                }
            }
            System.out.println("No matching Sacombank emails found");
            return null;
        } finally {
            try {
                store.close();
            } catch (MessagingException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * Extract content from email message
     */
    private String getEmailContent(Message message) throws MessagingException, IOException {
        Object content = message.getContent();
        if (content instanceof String) {
            return (String) content;
        } else if (content instanceof MimeMultipart) {
            MimeMultipart multipart = (MimeMultipart) content;
            StringBuilder result = new StringBuilder();
            
            for (int i = 0; i < multipart.getCount(); i++) {
                BodyPart bodyPart = multipart.getBodyPart(i);
                if (bodyPart.getContentType().toLowerCase().startsWith("text/html")) {
                    String html = (String) bodyPart.getContent();
                    String text = html.replaceAll("<[^>]*>", "")
                                    .replaceAll("&nbsp;", " ")
                                    .replaceAll("\\s+", " ")
                                    .trim();
                    result.append(text);
                }
            }
            return result.toString();
        }
        return "";
    }

    private Map<String, Object> createResponse(boolean success, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        return response;
    }
} 