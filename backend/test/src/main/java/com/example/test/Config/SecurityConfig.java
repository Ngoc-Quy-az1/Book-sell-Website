package com.example.test.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - Không cần đăng nhập
                .requestMatchers(
                    "/api/auth/**",                    // Các API xác thực
                    "/api/users/login",                // API đăng nhập
                    "/api/users/register",             // API đăng ký
                    "/api/users/verify",               // API xác thực email
                    "api/users/forgotpassword",        // API quên mật khẩu
                    "api/users/confirmcode"  ,          // API xác thực mã quên mật khẩu

                    "/api/books/search/**",            // API tìm kiếm sách
                    "/api/books/categories/**",        // API danh mục sách
                    "/api/books/details/**",           // API chi tiết sách
                    "/api/books/{id}",                 // API chi tiết sách theo ID    
                    "/api/books/GetAllPaginated/**",   // API lấy tất cả sách phân trang
                    "/api/books/AllTypeCategories",   // API lấy tất cả danh mục sách
                    "/api/books/GetAllPaginated/SearchByPrice", // API lấy tất cả danh mục sách theo ID

                    "/api/payment/process-balance/**", // API thanh toán sử dụng tiền mặt
                    "/api/order/**" ,                  // API đặt hàng
                    "/api/chat/community/**",   
                    "/api/chat/admin/**",    

                    "/swagger-ui/**",
                    "/ws/**",                         // WebSocket endpoints
                    "/ws/info",                       // SockJS info endpoint             
                    "v3/**"                         
                ).permitAll()

                // Payment endpoints - Không cần đăng nhập
                .requestMatchers(
                    "/api/payment/create-payment/**",
                    "/api/payment/check-status/**"
                ).permitAll()

                //Cần đăng nhập
                .requestMatchers(
                    "/api/users/profile/**",                       
                    "/api/users/update/**",
                    "/api/users/update/balance/**",
                    "/api/users/logout/**",
                    "/api/users/review/**",
                    "/api/cart/**",
                    // "/api/chat/admin/**",
                    "/api/users/{userId}/discount-codes",
                    "/api/users/logout/{userId}"
                ).authenticated()

                // Admin endpoints - Cần role ADMIN
                .requestMatchers(
                    "/api/admin/**",                   // Tất cả API admin
                    "/api/books/add/**",               // Thêm sách
                    "/api/books/update/**",            // Cập nhật sách
                    "/api/books/delete/**"             // Xóa sách
                ).hasRole("ADMIN")

                // Mặc định - Yêu cầu xác thực
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5173", "http://localhost:8090"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}