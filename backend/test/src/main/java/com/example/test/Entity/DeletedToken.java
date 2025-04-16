package com.example.test.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "deleted_tokens")
public class DeletedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Integer tokenId;

    @Column(name = "token", nullable = false, unique = true, length = 512)
    private String token;

    // Constructors
    public DeletedToken() {}

    public DeletedToken(String token) {
        this.token = token;
    }

    // Getters and Setters
    public Integer getTokenId() {
        return tokenId;
    }

    public void setTokenId(Integer tokenId) {
        this.tokenId = tokenId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
