package com.example.test.Config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public BCryptPasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/verify").permitAll() // Cho phép truy cập công khai
                        .requestMatchers("/register").permitAll() // Cũng cho phép đăng ký công khai
                        .requestMatchers("/api/adminadmin").permitAll()
                        .requestMatchers("/").authenticated()
                        .anyRequest().permitAll()
                )
                .httpBasic(httpBasic -> {});
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // Tạo người dùng tùy chỉnh thay vì dùng user mặc định
        InMemoryUserDetailsManager manager = new InMemoryUserDetailsManager();
        manager.createUser(
                User.withUsername("admin")
                        .password("{noop}admin123") // {noop} để không mã hóa mật khẩu (chỉ dùng cho test)
                        .roles("ADMIN")
                        .build()
        );
        return manager;
    }
}
