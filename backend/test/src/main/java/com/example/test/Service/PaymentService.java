package com.example.test.Service;

import com.example.test.Entity.Notification;
import com.example.test.Entity.PurchaseHistory;
import com.example.test.Entity.PurchaseStatus;
import com.example.test.Entity.User;
import com.example.test.Entity.DiscountCode;
import com.example.test.Entity.DiscountCodesNumberCode;
import com.example.test.Repository.Discount.DiscountCodeRepository;
import com.example.test.Repository.Discount.DiscountCodesNumberCodeRepository;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private static Timestamp lastProcessedEmailTime = null; // Thêm biến để theo dõi thời gian email đã xử lý gần nhất
    // Thêm map để theo dõi số tiền đã thanh toán cho mỗi đơn hàng
    private static final Map<String, BigDecimal> partialPayments = new HashMap<>();

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

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    @Autowired
    private DiscountCodesNumberCodeRepository discountCodesNumberCodeRepository;

    private static final double XU_TO_VND_RATE = 1000.0; // 1 xu = 1000 VND

    // Hàm helper để tạo key cho partialPayments
    private String createPaymentKey(List<Integer> orderIds, Integer userId) {
        return userId + "_" + String.join("_", orderIds.stream().map(String::valueOf).toArray(String[]::new));
    }

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
     * Process new bank transfer from email and update order status for multiple
     * orders
     */
    @Transactional
    public Map<String, Object> processNewBankTransfer(List<Integer> orderIds, Integer userId) {
        try {
            String paymentKey = createPaymentKey(orderIds, userId);
            BigDecimal totalAmount = BigDecimal.ZERO;
            List<PurchaseHistory> orders = new ArrayList<>();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // Kiểm tra xem có thanh toán một phần trước đó không
            BigDecimal previousPayment = partialPayments.getOrDefault(paymentKey, BigDecimal.ZERO);
            boolean hasPartialPayment = previousPayment.compareTo(BigDecimal.ZERO) > 0;

            for (Integer orderId : orderIds) {
                PurchaseHistory order = purchaseHistoryRepository.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

                // Nếu có thanh toán một phần, cho phép tiếp tục thanh toán ngay cả khi trạng thái đã thay đổi
                if (!hasPartialPayment && order.getStatus() != PurchaseStatus.Pending) {
                    throw new RuntimeException("Đơn hàng " + orderId + " không ở trạng thái chờ thanh toán");
                }

                if (!order.getUserId().equals(userId)) {
                    throw new RuntimeException("Đơn hàng " + orderId + " không thuộc về người dùng này");
                }

                totalAmount = totalAmount.add(order.getTotalAmount());
                orders.add(order);
            }

            try {
                Map<String, String> transactionDetails = readRecentEmails();
                if (transactionDetails == null) {
                    if (hasPartialPayment) {
                        BigDecimal remainingAmount = totalAmount.subtract(previousPayment);
                        return createResponse(false,
                            "Bạn đã thanh toán " + previousPayment + " VND. " +
                            "Còn thiếu " + remainingAmount + " VND. " +
                            "Vui lòng chuyển thêm " + remainingAmount + " VND để hoàn tất thanh toán.");
                    }
                    return createResponse(false, "Vui lòng chuyển khoản để hoàn thiện đơn hàng");
                }

                String amountStr = transactionDetails.get("amount");
                BigDecimal transactionAmount = new BigDecimal(amountStr);
                
                // Cộng dồn số tiền mới với số tiền đã thanh toán trước đó
                BigDecimal totalPaidAmount = previousPayment.add(transactionAmount);

                if (totalPaidAmount.compareTo(totalAmount) < 0) {
                    // Cập nhật số tiền đã thanh toán
                    partialPayments.put(paymentKey, totalPaidAmount);
                    BigDecimal remainingAmount = totalAmount.subtract(totalPaidAmount);
                    return createResponse(false,
                            "Đã nhận được thanh toán " + transactionAmount + " VND. " +
                            "Tổng số tiền đã thanh toán: " + totalPaidAmount + " VND. " +
                            "Còn thiếu " + remainingAmount + " VND. " +
                            "Hãy chuyển thêm " + remainingAmount + " VND nữa để hoàn tất thanh toán.");
                }

                // Xóa thông tin thanh toán một phần sau khi hoàn tất
                partialPayments.remove(paymentKey);

                if (totalPaidAmount.compareTo(totalAmount) > 0) {
                    BigDecimal excessAmount = totalPaidAmount.subtract(totalAmount);
                    int excessXu = excessAmount.divide(BigDecimal.valueOf(1000), BigDecimal.ROUND_DOWN).intValue();
                    user.setBalance(user.getBalance() + excessXu);

                    for (PurchaseHistory order : orders) {
                        order.setStatus(PurchaseStatus.Completed);
                        purchaseHistoryRepository.save(order);
                        assignDiscountCodeBasedOnAmount(user, order.getTotalAmount());
                    }

                    Map<String, Object> result = new HashMap<>();
                    result.put("success", true);
                    result.put("paymentStatus", "excess");
                    result.put("message", "Thanh toán thành công " + orders.size() + " đơn hàng");
                    result.put("excessAmount", excessAmount);
                    result.put("excessCoins", excessXu);
                    result.put("orderIds", orderIds);
                    result.put("totalAmount", totalAmount);
                    result.put("totalPaidAmount", totalPaidAmount);
                    return result;
                }

                // Xử lý thanh toán đủ
                for (PurchaseHistory order : orders) {
                    order.setStatus(PurchaseStatus.Completed);
                    purchaseHistoryRepository.save(order);
                    assignDiscountCodeBasedOnAmount(user, order.getTotalAmount());
                }

                Notification notification_1 = new Notification();
                notification_1.setUser(user);
                notification_1.setMessage(
                        "Thanh toán thành công đơn hàng mã " + orderIds + " bằng chuyển khoản lúc " + new Date());
                notification_1.setCreatedAt(new Date());
                notification_1.setRead(false);
                notificationRepository.save(notification_1);

                if (totalPaidAmount.compareTo(BigDecimal.valueOf(500000)) >= 0) {
                    Notification notification_2 = new Notification();
                    notification_2.setUser(user);
                    notification_2.setMessage(
                            "Bạn được cộng 5 điểm tích lũy cho đơn hàng mã " + orderIds + "lúc" + new Date());
                    notification_2.setCreatedAt(new Date());
                    notification_2.setRead(false);
                    notificationRepository.save(notification_2);
                    user.setPoints(user.getPoints() + 5);
                    userRepository.save(user);
                } else if (totalPaidAmount.compareTo(BigDecimal.valueOf(2000000)) >= 0
                        && totalPaidAmount.compareTo(BigDecimal.valueOf(5000000)) < 0) {
                    Notification notification_2 = new Notification();
                    notification_2.setUser(user);
                    notification_2.setMessage(
                            "Bạn được cộng 3 điểm tích lũy cho đơn hàng mã " + orderIds + "lúc" + new Date());
                    notification_2.setCreatedAt(new Date());
                    notification_2.setRead(false);
                    notificationRepository.save(notification_2);
                    user.setPoints(user.getPoints() + 3);
                    userRepository.save(user);
                }

                Map<String, Object> result = new HashMap<>();
                result.put("success", true);
                result.put("paymentStatus", "exact");
                result.put("message", "Thanh toán thành công " + orders.size() + " đơn hàng");
                result.put("orderIds", orderIds);
                result.put("totalAmount", totalAmount);
                result.put("totalPaidAmount", totalPaidAmount);
                return result;

            } catch (RuntimeException e) {
                // Xử lý các exception cụ thể từ readRecentEmails
                if (e.getMessage().equals("Vui lòng nhập số điện thoại khi chuyển khoản")) {
                    return createResponse(false, e.getMessage());
                } else if (e.getMessage().equals("Vui lòng chuyển khoản để hoàn thiện đơn hàng")) {
                    return createResponse(false, e.getMessage());
                }
                // Nếu là lỗi khác, throw lại để xử lý ở catch block bên ngoài
                throw e;
            }

        } catch (Exception e) {
            logger.error("Lỗi xử lý thanh toán qua chuyển khoản: {}", e.getMessage(), e);
            // Kiểm tra nếu là lỗi đã xử lý ở trên thì trả về message tương ứng
            if (e.getMessage().equals("Vui lòng nhập số điện thoại khi chuyển khoản") ||
                e.getMessage().equals("Vui lòng chuyển khoản để hoàn thiện đơn hàng")) {
                return createResponse(false, e.getMessage());
            }
            // Các lỗi khác sẽ trả về message chung
            return createResponse(false, "Có lỗi xảy ra, vui lòng thử lại sau");
        }
    }

    /**
     * Process payment using user's balance (xu) for multiple orders
     */
    @Transactional
    public Map<String, Object> processBalancePayment(List<Integer> orderIds, Integer userId) {
        try {
            BigDecimal totalAmount = BigDecimal.ZERO;
            List<PurchaseHistory> orders = new ArrayList<>();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            for (Integer orderId : orderIds) {
                PurchaseHistory order = purchaseHistoryRepository.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));

                if (order.getStatus() != PurchaseStatus.Pending) {
                    throw new RuntimeException("Đơn hàng " + orderId + " không ở trạng thái chờ thanh toán");
                }

                if (!order.getUserId().equals(userId)) {
                    throw new RuntimeException("Đơn hàng " + orderId + " không thuộc về người dùng này");
                }

                totalAmount = totalAmount.add(order.getTotalAmount());
                orders.add(order);
            }

            double requiredXu = totalAmount.doubleValue() / XU_TO_VND_RATE;

            if (user.getBalance() < requiredXu) {
                throw new RuntimeException(
                        "Số dư xu không đủ. Cần " + requiredXu + " xu, hiện có " + user.getBalance() + " xu");
            }

            user.setBalance(user.getBalance() - requiredXu);

            // Tích điểm dựa trên số tiền thanh toán
            int pointsToAdd = 0;
            if (totalAmount.compareTo(BigDecimal.valueOf(500000)) >= 0) {
                pointsToAdd = 5;
            } else if (totalAmount.compareTo(BigDecimal.valueOf(200000)) >= 0) {
                pointsToAdd = 3;
            } else if (totalAmount.compareTo(BigDecimal.valueOf(100000)) >= 0) {
                pointsToAdd = 1;
            }

            if (pointsToAdd > 0) {
                user.setPoints(user.getPoints() + pointsToAdd);
                // Thông báo tích điểm
                Notification pointsNotification = new Notification();
                pointsNotification.setUser(user);
                pointsNotification.setMessage(
                    String.format("Bạn được cộng %d điểm tích lũy cho đơn hàng %s trị giá %s VND lúc %s", 
                        pointsToAdd,
                        orderIds,
                        totalAmount.toString(),
                        new Date())
                );
                pointsNotification.setCreatedAt(new Date());
                pointsNotification.setRead(false);
                notificationRepository.save(pointsNotification);
            }

            userRepository.save(user);

            for (PurchaseHistory order : orders) {
                order.setStatus(PurchaseStatus.Completed);
                purchaseHistoryRepository.save(order);
                // Gán mã giảm giá sau khi thanh toán thành công
                assignDiscountCodeBasedOnAmount(user, order.getTotalAmount());
            }

            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage("Thanh toán thành công đơn hàng mã " + orderIds + " bằng xu lúc " + new Date());
            notification.setCreatedAt(new Date());
            notification.setRead(false);
            notificationRepository.save(notification);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Thanh toán thành công " + orders.size() + " đơn hàng bằng " + requiredXu + " xu");
            result.put("orderIds", orderIds);
            result.put("totalAmount", totalAmount);
            result.put("remainingBalance", user.getBalance());
            result.put("pointsAdded", pointsToAdd);
            result.put("totalPoints", user.getPoints());
            return result;

        } catch (Exception e) {
            logger.error("Lỗi xử lý thanh toán bằng xu: {}", e.getMessage(), e);
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
            // Mở folder với quyền đọc và ghi để có thể đánh dấu email đã đọc
            inbox.open(Folder.READ_WRITE);

            int totalMessages = inbox.getMessageCount();
            System.out.println("Total messages in inbox: " + totalMessages);

            // Lấy 10 email gần nhất
            int startMessage = Math.max(1, totalMessages - 10);
            Message[] messages = inbox.getMessages(startMessage, totalMessages);
            System.out.println("Fetched " + messages.length + " recent messages");

            for (int i = messages.length - 1; i >= 0; i--) {
                Message message = messages[i];
                
                if (message.getFlags().contains(Flags.Flag.SEEN)) {
                    System.out.println("Skipping already read email");
                    continue;
                }

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

                    Pattern phonePattern = Pattern.compile("\\b0\\d{9,10}\\b");
                    Matcher phoneMatcher = phonePattern.matcher(content);

                    if (amountMatcher.find()) {
                        String amountStr = amountMatcher.group(1).replace(",", "");

                        if (phoneMatcher.find()) {
                            String phone = phoneMatcher.group(0);

                            transactionDetails.put("amount", amountStr);
                            transactionDetails.put("phone", phone);

                            Pattern datePattern = Pattern.compile("(\\d{2}/\\d{2}/\\d{4}\\s+\\d{2}:\\d{2})");
                            Matcher dateMatcher = datePattern.matcher(content);
                            if (dateMatcher.find()) {
                                transactionDetails.put("date", dateMatcher.group(1));
                            }

                            try {
                                message.setFlag(Flags.Flag.SEEN, true);
                                message.saveChanges();
                            } catch (Exception e) {
                                logger.warn("Không thể đánh dấu email đã đọc: " + e.getMessage());
                                // Bỏ qua lỗi và tiếp tục xử lý giao dịch
                            }

                            return transactionDetails;
                        } else {
                            // Đánh dấu email đã đọc và throw exception với message cụ thể
                            try {
                                message.setFlag(Flags.Flag.SEEN, true);
                                message.saveChanges();
                            } catch (Exception e) {
                                logger.warn("Không thể đánh dấu email đã đọc: " + e.getMessage());
                            }
                            throw new RuntimeException("Vui lòng nhập số điện thoại khi chuyển khoản");
                        }
                    } else {
                        // Đánh dấu email đã đọc nếu không phải email chuyển khoản
                        try {
                            message.setFlag(Flags.Flag.SEEN, true);
                            message.saveChanges();
                        } catch (Exception e) {
                            logger.warn("Không thể đánh dấu email đã đọc: " + e.getMessage());
                        }
                    }
                }
            }

            // Nếu không tìm thấy email chuyển khoản nào
            throw new RuntimeException("Vui lòng chuyển khoản để hoàn thiện đơn hàng");

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

    private void assignDiscountCodeBasedOnAmount(User user, BigDecimal orderAmount) {
        String discountCodeToAssign = null;
        double amount = orderAmount.doubleValue();

        if (amount >= 5000000) {
            discountCodeToAssign = "COUPN4BZ"; // 60%
        } else if (amount >= 3000000) {
            discountCodeToAssign = "PROMO1WL"; // 50%
        } else if (amount >= 2000000) {
            discountCodeToAssign = "ZDISCNT8"; // 40%
        } else if (amount >= 1000000) {
            discountCodeToAssign = "OFFC5Y2R"; // 30%
        } else if (amount >= 500000) {
            discountCodeToAssign = "DEAL7TQK"; // 20%
        } else if (amount >= 200000) {
            discountCodeToAssign = "SALE9X3G"; // 10%
        }

        if (discountCodeToAssign != null) {
            try {
                final String finalDiscountCode = discountCodeToAssign; // Biến final
                DiscountCode discount = discountCodeRepository.findByCode(finalDiscountCode)
                        .orElseThrow(() -> new RuntimeException("Discount code " + finalDiscountCode + " not found"));

                // Check if the discount code is already assigned to the user
                DiscountCodesNumberCode existingDiscount = discountCodesNumberCodeRepository
                        .findByUserIdAndDiscountCode_CodeId(user.getID(), discount.getCodeId());
                if (existingDiscount != null) {
                    existingDiscount.setNumberCode(existingDiscount.getNumberCode() + 1);
                    discountCodesNumberCodeRepository.save(existingDiscount);
                } else {
                    DiscountCodesNumberCode userDiscount = new DiscountCodesNumberCode();
                    userDiscount.setCodeId(discount.getCodeId());
                    userDiscount.setUserId(user.getID());
                    userDiscount.setNumberCode(1);
                    userDiscount.setDiscountCode(discount);
                    userDiscount.setUser(user);
                    discountCodesNumberCodeRepository.save(userDiscount);
                }

                logger.info("Successfully assigned discount code {} to user: {}", finalDiscountCode, user.getID());

                Notification notification = new Notification();
                notification.setUser(user);
                notification.setMessage("Chúc mừng! Bạn đã nhận được mã giảm giá " + discount.getDiscountPercentage()
                        + "% (" + discount.getCode() + ") cho đơn hàng tiếp theo.");
                notification.setCreatedAt(new Date());
                notification.setRead(false);
                notificationRepository.save(notification);

            } catch (Exception e) {
                logger.error("Error assigning discount code {} to user {}: {}", discountCodeToAssign, user.getID(),
                        e.getMessage(), e);
            }
        }
    }
}