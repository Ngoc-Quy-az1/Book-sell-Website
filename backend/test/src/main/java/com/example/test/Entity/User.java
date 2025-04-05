package com.example.test.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "user_id")
        private int ID;

        @Column(name = "username")
        private String name;

        @Column(name = "phone")
        private String phone;

        @Column(name = "password_hash")
        private String password;

        @Column(name = "email")
        private String mail;

        @Column(name = "is_admin")
        private boolean is_admin;

        @Column(name = "full_name")
        private String full_name;

        @Column(name = "address")
        private String address;

        @Column(name = "points")
        private int points;

        @Column(name = "balance")
        private double balance;

        @Column(name = "membership_level")
        @Enumerated(EnumType.STRING)  
        private MembershipLevel membershipLevel;  

        @Column(name = "is_login")
        private boolean is_login;

        public enum MembershipLevel {
            Silver,
            Gold,
            Platinum
        }

        public int getID() {
            return ID;
        }

        public void setID(int ID) {
            this.ID = ID;
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

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String getMail() {
            return mail;
        }

        public void setMail(String mail) {
            this.mail = mail;
        }

        public boolean isIs_admin() {
            return is_admin;
        }

        public void setIs_admin(boolean is_admin) {
            this.is_admin = is_admin;
        }

        public boolean isAdmin() {
            return is_admin;
        }

        public void setFull_name(String full_name) {
            this.full_name = full_name;
        }

        public String getFull_name() {
            return full_name;
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

        public MembershipLevel getMembershipLevel() {
            return membershipLevel;
        }

        public void setMembershipLevel(MembershipLevel membershipLevel) {
            this.membershipLevel = membershipLevel;
        }

        public boolean isIs_login() {
            return is_login;
        }

        public void setIs_login(boolean is_login) {
            this.is_login = is_login;
        }
    }
