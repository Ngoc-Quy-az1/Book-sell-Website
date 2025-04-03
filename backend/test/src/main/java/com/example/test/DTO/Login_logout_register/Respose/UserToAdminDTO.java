package com.example.test.DTO.Login_logout_register.Respose;

public class UserToAdminDTO {
    private int user_id;
    private String name;
    private String phone;
    private String mail;
    private String address;
    private int points;
    private double balance;
    private boolean is_admin;
    private String full_name;
    private String status;
    private boolean is_login = false;

    public int getUser_id() {
        return user_id;
    }
    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getMail() {
        return mail;
    }
    public void setMail(String mail) {
        this.mail = mail;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public int getPoints() {
        return points;
    }
    public void setPoints(int points) {
        this.points = points;
    }
    public double getBalance() {
        return balance;
    }
    public void setBalance(double balance) {
        this.balance = balance;
    }
    public boolean isIs_admin() {
        return is_admin;
    }
    public void setIs_admin(boolean is_admin) {
        this.is_admin = is_admin;
    }
    public String getFull_name() {
        return full_name;
    }
    public void setFull_name(String full_name) {
        this.full_name = full_name;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public boolean isIs_login() {
        return is_login;
    }
    public void setIs_login(boolean is_login) {
        this.is_login = is_login;
    }
    
}
