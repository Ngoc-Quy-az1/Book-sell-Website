package com.example.test.DTO.Login_logout_register;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MoreRegisterDTO {  
    private String full_name;

    private String address;

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
}
