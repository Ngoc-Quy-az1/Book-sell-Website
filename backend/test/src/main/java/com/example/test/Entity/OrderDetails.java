package com.example.test.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_details")
public class OrderDetails {

    @EmbeddedId
    private OrderDetailsId id;

    @ManyToOne
    @MapsId("orderId")
    @JoinColumn(name = "order_id", nullable = false)
    private PurchaseHistory order;

    @ManyToOne
    @MapsId("bookId")
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    public OrderDetailsId getId() {
        return id;
    }

    public void setId(OrderDetailsId id) {
        this.id = id;
    }

    public PurchaseHistory getOrder() {
        return order;
    }

    public void setOrder(PurchaseHistory order) {
        this.order = order;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}

@Embeddable
class OrderDetailsId implements java.io.Serializable {
    private int orderId;
    private int bookId;

    public OrderDetailsId() {}

    public OrderDetailsId(int orderId, int bookId) {
        this.orderId = orderId;
        this.bookId = bookId;
    }

    public int getOrderId() {
        return orderId;
    }

    public void setOrderId(int orderId) {
        this.orderId = orderId;
    }

    public int getBookId() {
        return bookId;
    }

    public void setBookId(int bookId) {
        this.bookId = bookId;
    }
}
