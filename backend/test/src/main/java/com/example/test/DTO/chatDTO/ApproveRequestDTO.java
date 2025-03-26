package com.example.test.DTO.chatDTO;


public class ApproveRequestDTO {
    private int adminId;
    private String status; // "APPROVED" or "REJECTED"

    public int getAdminId() {
        return adminId;
    }

    public void setAdminId(int adminId) {
        this.adminId = adminId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
