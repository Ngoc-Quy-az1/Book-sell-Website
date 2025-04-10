package com.example.test.Service;

import com.example.test.Entity.User;
import com.example.test.Repository.UserRepo.UserRepository;
import com.example.test.Repository.chatRepo.GroupJoinRequestRepository;
import com.example.test.Repository.OrdersRepo.OrderRepository;
import com.example.test.Repository.PurchaseHistoryRepo.PurchaseHistoryRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import com.example.test.Entity.User.MembershipLevel;
import com.example.test.Entity.chatEntity.GroupJoinRequest;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private GroupJoinRequestRepository groupJoinRequestRepository;

    // Định nghĩa ngưỡng chi tiêu cho từng cấp độ hội viên
    private static final Map<String, BigDecimal> MEMBERSHIP_THRESHOLDS = new HashMap<>() {{
        put("Silver", new BigDecimal("1000000")); // 1 triệu VND
        put("Gold", new BigDecimal("5000000"));   // 5 triệu VND
        put("Platinum", new BigDecimal("10000000")); // 10 triệu VND
    }};

    // Lấy tất cả người dùng
    public List<User> findAllUser() {
        return userRepository.findAll();
    }

    // Lấy số lượng người dùng
    public long getTotalUsers() {
        return userRepository.count();
    }

    // Lấy thông tin người dùng theo ID
    public User findById(Integer id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Tạo mới một người dùng
    public User create(User user) {
        // Kiểm tra email đã tồn tại
        if (userRepository.findUserByMail(user.getMail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        // Kiểm tra số điện thoại đã tồn tại
        if (userRepository.findUserByPhone(user.getPhone()) != null) {
            throw new RuntimeException("Phone number already exists");
        }

        // Mã hóa password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set giá trị mặc định
        user.setIs_admin(false);
        user.setIs_login(false);
        user.setPoints(0);
        user.setBalance(0.0);
        user.setMembershipLevel(User.MembershipLevel.Silver);

        return userRepository.save(user);
    }

    // Cập nhật thông tin người dùng
    public User update(Integer id, User userDetails) {
        User user = findById(id);
        
        // Chỉ cập nhật các trường không null
        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        if (userDetails.getMail() != null) {
            // Kiểm tra email mới không trùng với email của user khác
            User existingUser = userRepository.findUserByMail(userDetails.getMail());
            if (existingUser != null && existingUser.getID() != user.getID()) {
                throw new RuntimeException("Email đã tồn tại");
            }
            user.setMail(userDetails.getMail());
        }
        if (userDetails.getPhone() != null) {
            // Kiểm tra số điện thoại mới không trùng với số điện thoại của user khác
            User existingUser = userRepository.findUserByPhone(userDetails.getPhone());
            if (existingUser != null && existingUser.getID() != user.getID()) {
                throw new RuntimeException("Số điện thoại đã tồn tại");
            }
            user.setPhone(userDetails.getPhone());
        }
        if (userDetails.getFull_name() != null) {
            user.setFull_name(userDetails.getFull_name());
        }
        if (userDetails.getAddress() != null) {
            user.setAddress(userDetails.getAddress());
        }
        if (userDetails.getPoints() != 0) {
            user.setPoints(userDetails.getPoints());
        }
        if (userDetails.getBalance() != 0.0) {
            user.setBalance(userDetails.getBalance());
        }
        if (userDetails.getMembershipLevel() != null) {
            user.setMembershipLevel(userDetails.getMembershipLevel());
        }
        if (userDetails.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        
        return userRepository.save(user);
    }

    // Xóa người dùng
    public void delete(Integer id) {
        userRepository.deleteById(id);
    }

    // Lấy tổng số đơn hàng
    public long getTotalOrders() {
        return orderRepository.count();
    }

    // Lấy tổng doanh thu từ trước đến nay
    public BigDecimal getTotalRevenue() {
        Query query = entityManager.createQuery("SELECT SUM(ph.totalAmount) FROM PurchaseHistory ph");
        BigDecimal result = (BigDecimal) query.getSingleResult();
        return result != null ? result : BigDecimal.ZERO;
    }

    // Lấy tổng doanh thu trong tháng
    public BigDecimal getMonthlyRevenue() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        Query query = entityManager.createQuery(
            "SELECT SUM(ph.totalAmount) FROM PurchaseHistory ph WHERE ph.createdAt >= :startDate"
        );
        query.setParameter("startDate", startOfMonth);
        BigDecimal result = (BigDecimal) query.getSingleResult();
        return result != null ? result : BigDecimal.ZERO;
    }

    // Lấy tổng doanh thu trong tuần
    public BigDecimal getWeeklyRevenue() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(DayOfWeek.MONDAY).withHour(0).withMinute(0).withSecond(0);
        Query query = entityManager.createQuery(
            "SELECT SUM(ph.totalAmount) FROM PurchaseHistory ph WHERE ph.createdAt >= :startDate"
        );
        query.setParameter("startDate", startOfWeek);
        BigDecimal result = (BigDecimal) query.getSingleResult();
        return result != null ? result : BigDecimal.ZERO;
    }

    // Lấy tổng doanh thu trong ngày
    public BigDecimal getDailyRevenue() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        Query query = entityManager.createQuery(
            "SELECT SUM(ph.totalAmount) FROM PurchaseHistory ph WHERE ph.createdAt >= :startDate"
        );
        query.setParameter("startDate", startOfDay);
        BigDecimal result = (BigDecimal) query.getSingleResult();
        return result != null ? result : BigDecimal.ZERO;
    }

    // Lấy danh sách người dùng sắp xếp theo mức chi tiêu giảm dần
    public List<Object[]> getTopSpendingUsers() {
        Query query = entityManager.createQuery(
            "SELECT u.ID, u.name, u.mail, COALESCE(SUM(ph.totalAmount), 0) as totalSpent " +
            "FROM User u " +
            "LEFT JOIN PurchaseHistory ph ON ph.userId = u.ID " +
            "GROUP BY u.ID, u.name, u.mail " +
            "ORDER BY totalSpent DESC"
        );
        return query.getResultList();
    }

    // Lấy doanh số theo thể loại sách
    public List<Object[]> getRevenueByCategory() {
        Query query = entityManager.createQuery(
            "SELECT b.category, COUNT(od.bookId) as totalSold, SUM(od.price * od.quantity) as totalRevenue " +
            "FROM OrderDetails od " +
            "JOIN Book b ON od.bookId = b.ID " +
            "JOIN Orders o ON od.orderId = o.orderId " +
            "GROUP BY b.category " +
            "ORDER BY totalRevenue DESC"
        );
        return query.getResultList();
    }

    // Lấy tổng chi tiêu của một người dùng
    public BigDecimal getUserTotalSpending(Integer userId) {
        Query query = entityManager.createQuery(
            "SELECT COALESCE(SUM(ph.totalAmount), 0) FROM PurchaseHistory ph WHERE ph.userId = :userId"
        );
        query.setParameter("userId", userId);
        BigDecimal result = (BigDecimal) query.getSingleResult();
        return result != null ? result : BigDecimal.ZERO;
    }

    // Kiểm tra và nâng cấp hội viên dựa trên tổng chi tiêu
    @Transactional
    public MembershipLevel checkAndUpgradeMembership(Integer userId, BigDecimal newPurchaseAmount) {
        User user = findById(userId);
        BigDecimal totalSpending = getUserTotalSpending(userId).add(newPurchaseAmount);
        
        // Xác định cấp độ hội viên mới dựa trên tổng chi tiêu
        MembershipLevel newLevel = null;
        if (totalSpending.compareTo(new BigDecimal("10000000")) >= 0) { // 10 triệu
            newLevel = MembershipLevel.Platinum;
        } else if (totalSpending.compareTo(new BigDecimal("5000000")) >= 0) { // 5 triệu
            newLevel = MembershipLevel.Gold;
        } else if (totalSpending.compareTo(new BigDecimal("1000000")) >= 0) { // 1 triệu
            newLevel = MembershipLevel.Silver;
        }
        
        // Chỉ nâng cấp nếu cấp độ mới cao hơn cấp độ hiện tại
        if (newLevel != null && newLevel.ordinal() > user.getMembershipLevel().ordinal()) {
            user.setMembershipLevel(newLevel);
            userRepository.save(user);
            return newLevel; 
        }
        
        return null; 
    }

    // Lấy danh sách yêu cầu tham gia nhóm chat
    public List<GroupJoinRequest> getGroupJoinRequests() {
        return groupJoinRequestRepository.findAll();
    }
}
