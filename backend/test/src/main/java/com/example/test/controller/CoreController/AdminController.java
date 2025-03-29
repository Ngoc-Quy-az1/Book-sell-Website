package com.example.test.controller.CoreController;

import com.example.test.Entity.User;
import com.example.test.Service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Lấy danh sách tất cả người dùng
    // http://localhost:8090/api/admin/users
    @GetMapping("/users")
    public List<User> getAllUsers() {
        System.out.println("Calling getAllUsers");
        return adminService.findAllUser();
    }

    // Lấy thông tin chi tiết một người dùng theo ID
    // http://localhost:8090/api/admin/users/2
    @GetMapping("/users/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable int userId) {
        User user = adminService.findById(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    // Tạo mới một người dùng
    // http://localhost:8090/api/admin/createUsers

    @PostMapping("/createUsers")
    public ResponseEntity<User> createUser(@RequestBody User userDto) {
        User createdUser = adminService.create(userDto);
        return ResponseEntity.ok(createdUser);
    }

    // Cập nhật thông tin một người dùng
    // http://localhost:8090/api/admin/updateuUsers/
    @PutMapping("/updateUsers/{userId}")
    public ResponseEntity<String> updateUser(@PathVariable int userId, @RequestBody User userDetails) {
        User updatedUser = adminService.update(userId, userDetails);
        if (updatedUser != null) {
            return ResponseEntity.ok("Cập nhật thành công");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy người dùng");
    }

    // Xóa người dùng
    // http://localhost:8090/api/admin/deleteUsers/2
    @DeleteMapping("/deleteUsers/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable int userId) {
        adminService.delete(userId);
        return ResponseEntity.ok("Xóa người dùng thành công");
    }
    public AdminController() {
        System.out.println("AdminController Loaded!");
    }
}
