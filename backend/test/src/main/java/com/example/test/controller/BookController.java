package com.example.test.controller;

import com.example.test.Entity.Book;
import com.example.test.Service.BookService;
import com.example.test.Service.WishlistService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private WishlistService wishlistService;

    // API thêm sách
    @PostMapping("/add")
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        Book addedBook = bookService.addBook(book);
        return ResponseEntity.ok(addedBook);
    }

    // API sửa sách
    @PutMapping("/update/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable int id, @RequestBody Book bookDetails) {
        Book updatedBook = bookService.updateBook(id, bookDetails);
        return ResponseEntity.ok(updatedBook);
    }

    // API xóa sách
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable int id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok("Book deleted successfully.");
    }

    // API lấy thông tin sách theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable int id) {
        Book book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    // API lấy danh sách tất cả sách
    @GetMapping("/all")
    public ResponseEntity<List<Book>> getAllBooks() {
        Iterable<Book> booksIterable = bookService.getAllBooks();  
        List<Book> booksList = new ArrayList<>();  
        booksIterable.forEach(booksList::add);  
        return ResponseEntity.ok(booksList);  
    }

    // API lấy sách theo danh mục thể loại
    @GetMapping("/category")
    public ResponseEntity<List<Book>> getBooksByCategory(@RequestParam String category) {
        List<Book> books = bookService.getBooksByCategory(category);
        return ResponseEntity.ok(books);
    }

    // API thêm sách vào wishlist
    @PostMapping("/wishlist/{userId}/{bookId}")
    public ResponseEntity<String> addBookToWishlist(@PathVariable int userId, @PathVariable int bookId) {
        boolean isAdded = wishlistService.addBookToWishlist(userId, bookId);
        if (isAdded) {
            return ResponseEntity.ok("Book added to wishlist successfully.");
        } else {
            return ResponseEntity.badRequest().body("Book is already in the wishlist.");
        }
    }

    // API lấy danh sách yêu thích của người dùng
    @GetMapping("/wishlist/{userId}")
    public ResponseEntity<List<Book>> getWishlist(@PathVariable int userId) {
        List<Book> wishlist = wishlistService.getWishlistByUserId(userId);
        return ResponseEntity.ok(wishlist);
    }

    // API xóa sách khỏi wishlist
    @DeleteMapping("/wishlist/{userId}/{bookId}")
    public ResponseEntity<String> deleteBookFromWishlist(@PathVariable int userId, @PathVariable int bookId) {
        wishlistService.deleteBookFromWishlist(userId, bookId);
        return ResponseEntity.ok("Book deleted from wishlist successfully.");
    }
}
