package com.example.test.DTO.book.response;

import jakarta.persistence.Column;

public class BookResponse {
    private int id;
    private String title;
    private String author;
    private String category;
    private String image;
    private int price_discounted;
    private int price_original;
    private String description;


    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public int getPrice_discounted() {
        return price_discounted;
    }

    public void setPrice_discounted(int price_discounted) {
        this.price_discounted = price_discounted;
    }

    public int getPrice_original() {
        return price_original;
    }

    public void setPrice_original(int price_original) {
        this.price_original = price_original;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}