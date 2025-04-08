package com.example.test.Service;

import com.example.test.Config.VNPayConfig;
import com.example.test.Entity.PurchaseHistory;
import com.example.test.Entity.PurchaseStatus;
import com.example.test.Repository.PurchaseHistoryRepo.PurchaseHistoryRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PaymentService {

    @Autowired
    private VNPayConfig vnPayConfig;

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    public String createPaymentUrl(PurchaseHistory purchaseHistory) {
        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_TxnRef = String.valueOf(purchaseHistory.getOrderId());
            String vnp_IpAddr = "127.0.0.1";
            String vnp_TmnCode = vnPayConfig.getTmnCode();
            
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(purchaseHistory.getTotalAmount().multiply(new BigDecimal("100")).longValue()));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang: " + purchaseHistory.getOrderId());
            vnp_Params.put("vnp_OrderType", "other");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
            
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            
            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
            
            List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            String queryUrl = query.toString();
            String vnp_SecureHash = hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            return vnPayConfig.getPayUrl() + "?" + queryUrl;
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo URL thanh toán: " + e.getMessage());
        }
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac sha512Hmac = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes();
            SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            sha512Hmac.init(secretKey);
            byte[] dataBytes = data.getBytes();
            byte[] result = sha512Hmac.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder();
            for (byte b : result) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo chữ ký: " + e.getMessage());
        }
    }

    public byte[] generateQRCode(String paymentUrl) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(
                paymentUrl,
                BarcodeFormat.QR_CODE,
                250,
                250
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo QR code: " + e.getMessage());
        }
    }

    public boolean processPaymentResponse(Map<String, String> vnpParams) {
        // Kiểm tra chữ ký
        String vnp_SecureHash = vnpParams.get("vnp_SecureHash");
        String signValue = calculateSignature(vnpParams);
        
        if (vnp_SecureHash.equals(signValue)) {
            String vnp_ResponseCode = vnpParams.get("vnp_ResponseCode");
            String orderId = vnpParams.get("vnp_TxnRef");
            
            // Cập nhật trạng thái đơn hàng
            if ("00".equals(vnp_ResponseCode)) {
                updateOrderStatus(Integer.parseInt(orderId), PurchaseStatus.Completed);
                return true;
            } else {
                updateOrderStatus(Integer.parseInt(orderId), PurchaseStatus.Failed);
                return false;
            }
        }
        return false;
    }

    private void updateOrderStatus(Integer orderId, PurchaseStatus status) {
        PurchaseHistory purchaseHistory = purchaseHistoryRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
        purchaseHistory.setStatus(status);
        purchaseHistoryRepository.save(purchaseHistory);
    }

    private String calculateSignature(Map<String, String> params) {
        List<String> fieldNames = new ArrayList<>(params.keySet());
        fieldNames.remove("vnp_SecureHash");
        fieldNames.remove("vnp_SecureHashType");
        Collections.sort(fieldNames);
        
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }
        return hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());
    }

    public PurchaseStatus checkOrderStatus(Integer orderId) {
        PurchaseHistory purchaseHistory = purchaseHistoryRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + orderId));
        return purchaseHistory.getStatus();
    }
} 