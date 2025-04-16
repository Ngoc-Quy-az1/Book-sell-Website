package com.example.test.DTO.book.request;

import java.sql.Date;

public class UpdateBookDTO {
    private String title;
    private String image;
    private Double price_discounted;
    private Double price_original;
    private String description;
    private String author;
    private String translator;
    private String publisher;
    private String dimensions;
    private Integer pages;
    private String created_at;
    private Integer stock;
    private String category;
    
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Double getPrice_discounted() {
        return price_discounted;
    }

    public void setPrice_discounted(Double price_discounted) {
        this.price_discounted = price_discounted;
    }

    public Double getPrice_original() {
        return price_original;
    }

    public void setPrice_original(Double price_original) {
        this.price_original = price_original;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getTranslator() {
        return translator;
    }

    public void setTranslator(String translator) {
        this.translator = translator;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getDimensions() {
        return dimensions;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }

    public Integer getPages() {
        return pages;
    }

    public void setPages(Integer pages) {
        this.pages = pages;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}

