package com.example.test.DTO.Login_logout_register.Request;

public class LogOutDTO {
    private String token;

    public LogOutDTO() {
    }

    public LogOutDTO(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    } 
}
