package com.example.test.Service;

import com.example.test.Config.VNPayConfig;
import com.example.test.Entity.Orders;
import com.example.test.Entity.PurchaseStatus;
import com.example.test.Repository.OrdersRepo.OrderRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VNPayService {

    @Autowired
    private VNPayConfig vnPayConfig;

    @Autowired
    private OrderRepository orderRepository;

    public Map<String, String> createPaymentFromOrder(Integer orderId) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        String paymentUrl = createPaymentUrl(order.getTotalAmount().longValue(), "Thanh toan don hang #" + orderId);
        byte[] qrCode = generateQRCode(paymentUrl);

        Map<String, String> response = new HashMap<>();
        response.put("paymentUrl", paymentUrl);
        response.put("qrCode", Base64.getEncoder().encodeToString(qrCode));
        response.put("orderId", orderId.toString());
        
        return response;
    }

    public void updateOrderStatus(String orderId, String responseCode) {
        Orders order = orderRepository.findById(Integer.parseInt(orderId))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if ("00".equals(responseCode)) {
            order.setStatus(PurchaseStatus.Completed);
        } else {
            order.setStatus(PurchaseStatus.Failed);
        }
        
        orderRepository.save(order);
    }

    public String createPaymentUrl(long amount, String orderInfo) {
        try {
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_TxnRef = generateTxnRef();
            String vnp_IpAddr = "127.0.0.1";
            String vnp_TmnCode = vnPayConfig.getTmnCode();
            String vnp_HashSecret = vnPayConfig.getHashSecret();
            String vnp_Url = vnPayConfig.getPayUrl();
            String vnp_ReturnUrl = vnPayConfig.getReturnUrl();

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", orderInfo);
            vnp_Params.put("vnp_OrderType", "other");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            List fieldNames = new ArrayList(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            Iterator itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = (String) itr.next();
                String fieldValue = (String) vnp_Params.get(fieldName);
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
            String paymentUrl = vnPayConfig.getPayUrl() + "?" + queryUrl;

            return paymentUrl;
        } catch (Exception e) {
            throw new RuntimeException("Error creating payment URL", e);
        }
    }

    public byte[] generateQRCode(String paymentUrl) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(paymentUrl, BarcodeFormat.QR_CODE, 200, 200);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error generating QR code", e);
        }
    }

    private String generateTxnRef() {
        return "ORDER_" + System.currentTimeMillis();
    }

    private String hmacSHA512(String key, String data) {
        try {
            javax.crypto.Mac sha512_HMAC = javax.crypto.Mac.getInstance("HmacSHA512");
            javax.crypto.spec.SecretKeySpec secret_key = new javax.crypto.spec.SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            sha512_HMAC.init(secret_key);
            byte[] bytes = sha512_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(bytes);
        } catch (Exception e) {
            throw new RuntimeException("Error generating hash", e);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder result = new StringBuilder();
        for (byte b : bytes) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }
} 