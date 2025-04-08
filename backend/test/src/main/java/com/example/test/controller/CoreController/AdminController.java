package com.example.test.controller.CoreController;

import com.example.test.Entity.User;
import com.example.test.Service.AdminService;
import com.example.test.Service.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
// @CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtService jwtService;

    /**
     * Lấy danh sách tất cả người dùng
     * Method: GET
     * URL: http://localhost:8090/api/admin/users
     * Response: Danh sách tất cả người dùng trong hệ thống
     * [
     *   {
     *     "id": 14,
     *     "name": "Nguyen A",
     *     "email": "nguyena@example.com",
     *     "membershipLevel": "SILVER",
     *     "balance": 30000.00
     *   }
     * ]
     */

@GetMapping("/users")
public ResponseEntity<List<User>> getAllUsers(@RequestHeader("Authorization") String token) {
    // Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
        token = token.substring(7);
    }
    
    String role = jwtService.getUserRoleFromToken(token);
    if (!role.equals("ROLE_ADMIN")) {
        return ResponseEntity.status(403).build(); 
    }
    return ResponseEntity.ok(adminService.findAllUser());
}


    /**
     * Lấy số lượng người dùng
     * Method: GET
     * URL: http://localhost:8090/api/admin/users/count
     * Response: Số lượng người dùng trong hệ thống
     * Example: 42
     */
    @PreAuthorize("hasRole('1')")
    @GetMapping("/users/count")
    public ResponseEntity<Long> getTotalUsers() {
        long totalUsers = adminService.getTotalUsers();
        return ResponseEntity.ok(totalUsers);
    }

    /**
     * Lấy thông tin chi tiết một người dùng theo ID
     * Method: GET
     * URL: http://localhost:8090/api/admin/users/{userId}
     * Response: Thông tin chi tiết của người dùng hoặc 404 Not Found
     * {
     *   "id": 14,
     *   "name": "Nguyen A",
     *   "email": "nguyena@example.com",
     *   "membershipLevel": "SILVER",
     *   "balance": 30000.00
     * }
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable int userId) {
        User user = adminService.findById(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Tạo mới một người dùng
     * Method: POST
     * URL: http://localhost:8090/api/admin/createUsers
     * Request body: Thông tin người dùng cần tạo
     * {
     *   "name": "Nguyen A",
     *   "mail": "nguyena@example.com",
     *   "password": "password123",
     *   "phone": "0936795792",
     *   "full_name": "Nguyen Van A",
     *   "address": "123 ABC Street"
     * }
     * Response: Thông tin người dùng đã được tạo
     */
    @PostMapping("/createUsers")
    public ResponseEntity<?> createUser(@RequestBody User userDto) {
        try {
            // Set giá trị mặc định
            userDto.setIs_admin(false);
            userDto.setIs_login(false);
            userDto.setPoints(0);
            userDto.setBalance(0.0);
            userDto.setMembershipLevel(User.MembershipLevel.Silver);

            User createdUser = adminService.create(userDto);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Cập nhật thông tin một người dùng
     * Method: PUT
     * URL: http://localhost:8090/api/admin/updateUsers/{userId}
     * Request body: Thông tin cần cập nhật
     * {
     *   "name": "Nguyen A Updated",
     *   "email": "nguyena.new@example.com"
     * }
     * Response: Thông báo kết quả cập nhật
     */
    @PutMapping("/updateUsers/{userId}")
    public ResponseEntity<String> updateUser(@PathVariable int userId, @RequestBody User userDetails) {
        User updatedUser = adminService.update(userId, userDetails);
        if (updatedUser != null) {
            return ResponseEntity.ok("Cập nhật thành công");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy người dùng");
    }

    /**
     * Xóa người dùng
     * Method: DELETE
     * URL: http://localhost:8090/api/admin/deleteUsers/{userId}
     * Response: Thông báo kết quả xóa
     */
    @DeleteMapping("/deleteUsers/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable int userId) {
        adminService.delete(userId);
        return ResponseEntity.ok("Xóa người dùng thành công");
    }

    /**
     * Lấy tổng số đơn hàng
     * Method: GET
     * URL: http://localhost:8090/api/admin/orders/count
     * Response: Tổng số đơn hàng trong hệ thống
     * Example: 150
     */
    @GetMapping("/orders/count")
    public ResponseEntity<Long> getTotalOrders() {
        long totalOrders = adminService.getTotalOrders();
        return ResponseEntity.ok(totalOrders);
    }

    /**
     * Lấy tổng doanh thu từ trước đến nay
     * Method: GET
     * URL: http://localhost:8090/api/admin/revenue/total
     * Response: Tổng doanh thu (VND)
     * Example: 15000000.00
     */
    @GetMapping("/revenue/total")
    public ResponseEntity<BigDecimal> getTotalRevenue() {
        BigDecimal totalRevenue = adminService.getTotalRevenue();
        return ResponseEntity.ok(totalRevenue);
    }

    /**
     * Lấy tổng doanh thu trong tháng
     * Method: GET
     * URL: http://localhost:8090/api/admin/revenue/monthly
     * Response: Doanh thu tháng hiện tại (VND)
     * Example: 5000000.00
     */
    @GetMapping("/revenue/monthly")
    public ResponseEntity<BigDecimal> getMonthlyRevenue() {
        BigDecimal monthlyRevenue = adminService.getMonthlyRevenue();
        return ResponseEntity.ok(monthlyRevenue);
    }

    /**
     * Lấy tổng doanh thu trong tuần
     * Method: GET
     * URL: http://localhost:8090/api/admin/revenue/weekly
     * Response: Doanh thu tuần hiện tại (VND)
     * Example: 2000000.00
     */
    @GetMapping("/revenue/weekly")
    public ResponseEntity<BigDecimal> getWeeklyRevenue() {
        BigDecimal weeklyRevenue = adminService.getWeeklyRevenue();
        return ResponseEntity.ok(weeklyRevenue);
    }

    /**
     * Lấy tổng doanh thu trong ngày
     * Method: GET
     * URL: http://localhost:8090/api/admin/revenue/daily
     * Response: Doanh thu ngày hiện tại (VND)
     * Example: 500000.00
     */
    @GetMapping("/revenue/daily")
    public ResponseEntity<BigDecimal> getDailyRevenue() {
        BigDecimal dailyRevenue = adminService.getDailyRevenue();
        return ResponseEntity.ok(dailyRevenue);
    }

    /**
     * Lấy danh sách người dùng sắp xếp theo mức chi tiêu giảm dần
     * Method: GET
     * URL: http://localhost:8090/api/admin/users/top-spenders
     * Response: Danh sách người dùng và tổng chi tiêu
     * [
     *   {
     *     "userId": 14,
     *     "name": "Nguyen A",
     *     "email": "nguyena@example.com",
     *     "totalSpent": 5000000.00
     *   }
     * ]
     */
    @GetMapping("/users/top-spenders")
    public ResponseEntity<List<Map<String, Object>>> getTopSpendingUsers() {
        List<Object[]> results = adminService.getTopSpendingUsers();
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (Object[] result : results) {
            Map<String, Object> userData = new HashMap<>();
            userData.put("userId", result[0]);
            userData.put("name", result[1]);
            userData.put("email", result[2]);
            userData.put("totalSpent", result[3]);
            response.add(userData);
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy doanh số theo thể loại sách
     * Method: GET
     * URL: http://localhost:8090/api/admin/revenue/by-category
     * Response: Danh sách doanh số theo thể loại
     * [
     *   {
     *     "category": "Tiểu thuyết",
     *     "totalSold": 50,
     *     "totalRevenue": 5000000.00
     *   }
     * ]
     */
    @GetMapping("/revenue/by-category")
    public ResponseEntity<List<Map<String, Object>>> getRevenueByCategory() {
        List<Object[]> results = adminService.getRevenueByCategory();
        List<Map<String, Object>> response = new ArrayList<>();
        
        for (Object[] result : results) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("category", result[0]);
            categoryData.put("totalSold", result[1]);
            categoryData.put("totalRevenue", result[2]);
            response.add(categoryData);
        }
        
        return ResponseEntity.ok(response);
    }
}
