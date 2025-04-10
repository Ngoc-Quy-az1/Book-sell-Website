package com.example.test.Config;

import com.example.test.Entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    // Phương thức để lấy ID người dùng
    public int getId() {
        return user.getID();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = user.isAdmin() ? "ROLE_ADMIN" : "ROLE_USER";
        return Collections.singletonList(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        // Sử dụng email làm username cho Spring Security
        return user.getMail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Hoặc logic kiểm tra tài khoản hết hạn
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Hoặc logic kiểm tra tài khoản bị khóa
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Hoặc logic kiểm tra credentials hết hạn
    }

    @Override
    public boolean isEnabled() {
        return true; // Hoặc logic kiểm tra tài khoản được kích hoạt
    }

    // Optional: Cung cấp truy cập đến đối tượng User đầy đủ nếu cần
    public User getUser() {
        return user;
    }
} 