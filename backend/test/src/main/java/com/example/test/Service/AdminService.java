package com.example.test.Service;

import com.example.test.Entity.User;
import com.example.test.Repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;
    // Lấy tất cả người dùng
    public List<User> findAllUser() {
        return userRepository.findAll();
    }

    // Lấy thông tin người dùng theo ID
    public User findById(Integer id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Tạo mới một người dùng
    public User create(User user) {
        return userRepository.save(user);
    }

    // Cập nhật thông tin người dùng
    public User update(Integer id, User userDetails) {
        User user = findById(id);
        user.setName(userDetails.getName());
        user.setMail(userDetails.getMail());
        user.setFull_name(userDetails.getFull_name());
        user.setAddress(userDetails.getAddress());
        user.setPoints(userDetails.getPoints());
        user.setBalance(userDetails.getBalance());
        user.setMembershipLevel(userDetails.getMembershipLevel());
        return userRepository.save(user);
    }

    // Xóa người dùng
    public void delete(Integer id) {
        userRepository.deleteById(id);
    }
}
