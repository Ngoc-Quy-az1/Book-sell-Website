package com.example.test.Entity;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "books")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private int ID;

    @Column(name = "title")
    private String title;

    @Column(name = "image")
    private String image;  

    @Column(name = "price_discounted")
    private double price_discounted;

    @Column(name = "price_original")
    private double price_original;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "author")
    private String author;

    @Column(name = "translator")
    private String translator;

    @Column(name = "publisher")
    private String publisher;

    @Column(name = "dimensions")
    private String dimensions;

    @Column(name = "pages")
    private int pages;

    @Column(name = "created_at")
    private String created_at;

    @Column(name = "stock")
    private int stock;

    @Column(name = "category")
    private String category;

    public int getID() {
        return ID;
    }
    
    public void setID(int ID) {
        this.ID = ID;
    }

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

    public double getPrice_discounted() {
        return price_discounted;
    }

    public void setPrice_discounted(double price_discounted) {
        this.price_discounted = price_discounted;
    }

    public double getPrice_original() {
        return price_original;
    }

    public void setPrice_original(double price_original) {
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

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

}
