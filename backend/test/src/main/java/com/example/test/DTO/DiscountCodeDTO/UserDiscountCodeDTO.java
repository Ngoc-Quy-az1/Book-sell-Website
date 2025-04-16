package com.example.test.DTO.DiscountCodeDTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class UserDiscountCodeDTO {
    private String code;
    private BigDecimal discountPercentage;
    private LocalDate expirationDate;
    private int numberCode; // Có thể thêm trường này nếu cần hiển thị

    public UserDiscountCodeDTO(String code, BigDecimal discountPercentage, LocalDate expirationDate, int numberCode) {
        this.code = code;
        this.discountPercentage = discountPercentage;
        this.expirationDate = expirationDate;
        this.numberCode = numberCode;
    }

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(BigDecimal discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public int getNumberCode() {
        return numberCode;
    }

    public void setNumberCode(int numberCode) {
        this.numberCode = numberCode;
    }
} 