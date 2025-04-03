package com.example.test.DTO.chatDTO.Request;


public class ApproveRequestDTO {
    private int adminId;
    private String status; 

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
