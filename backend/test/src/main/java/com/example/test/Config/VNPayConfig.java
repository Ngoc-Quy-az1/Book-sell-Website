package com.example.test.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VNPayConfig {
    
    @Value("${vnpay.tmnCode}")
    private String tmnCode;
    
    @Value("${vnpay.hashSecret}")
    private String hashSecret;
    
    @Value("${vnpay.payUrl}")
    private String payUrl;
    
    @Value("${vnpay.returnUrl}")
    private String returnUrl;
    
    @Value("${vnpay.merchantId}")
    private String merchantId;

    public String getTmnCode() {
        return tmnCode;
    }

    public String getHashSecret() {
        return hashSecret;
    }

    public String getPayUrl() {
        return payUrl;
    }

    public String getReturnUrl() {
        return returnUrl;
    }

    public String getMerchantId() {
        return merchantId;
    }
} 