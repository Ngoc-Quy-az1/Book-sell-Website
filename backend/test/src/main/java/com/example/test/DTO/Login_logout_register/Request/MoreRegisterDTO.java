package com.example.test.DTO.Login_logout_register.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MoreRegisterDTO {  
    private String full_name;

    private String address;

    private String phone;

    public String getFull_name() {
        return full_name;
    }

    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
