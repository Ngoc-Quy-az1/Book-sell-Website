package com.example.test.DTO.Login_logout_register.Request;

public class ForgetPassDTO {
    private String email;
    private String password;
    private String code;

    public ForgetPassDTO() {
    }

    public ForgetPassDTO(String email, String password, String code) {
        this.email = email;
        this.password = password;
        this.code = code;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return code;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.code = confirmPassword;
    }
    
}
