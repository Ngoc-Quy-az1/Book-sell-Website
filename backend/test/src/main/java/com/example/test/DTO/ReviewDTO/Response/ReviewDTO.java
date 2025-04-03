package com.example.test.DTO.ReviewDTO.Response;

import java.time.LocalDateTime;

public class ReviewDTO {
    private String review;
    private int rating;
    private int user_id;
    private String user_name;
    private LocalDateTime created_at;

    public ReviewDTO(String review, int rating, int user_id, String user_name, LocalDateTime created_at) {
        this.review = review;
        this.rating = rating;
        this.user_id = user_id;
        this.user_name = user_name;
        this.created_at = created_at;
    }
    
    public String getReview() {
        return review;
    }
    public void setReview(String review) {
        this.review = review;
    }
    public int getRating() {
        return rating;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
    public int getUser_id() {
        return user_id;
    }
    public void setUser_id(int user_id) {
        this.user_id = user_id;
    }
    public String getUser_name() {
        return user_name;
    }
    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }
    public LocalDateTime getCreated_at() {
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
}