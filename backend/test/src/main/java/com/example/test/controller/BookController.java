package com.example.test.controller;

import com.example.test.DTO.book.request.BookGetAllRequest;
import com.example.test.DTO.book.response.BookResponse;
import com.example.test.Entity.Book;
import com.example.test.Service.BookService;
import com.example.test.Service.WishlistService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/GetAllPaginated")
    public ResponseEntity<Page<BookResponse>> getAllBooksPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Book> booksPage = bookService.getAllBooksPaginated(page, size);
        List<BookResponse> bookResponses = booksPage.getContent().stream().map(book -> {
            BookResponse response = new BookResponse();
            response.setId(book.getID());
            response.setTitle(book.getTitle());
            response.setAuthor(book.getAuthor());
            response.setCategory(book.getCategory());
            response.setImage(book.getImage());
            response.setPrice_discounted(book.getPrice_discounted());
            response.setPrice_original(book.getPrice_original());
            response.setDescription(book.getDescription());
            return response;
        }).collect(Collectors.toList());
        Page<BookResponse> responsePage = new PageImpl<>(bookResponses, PageRequest.of(page, size), booksPage.getTotalElements());
        return ResponseEntity.ok(responsePage);
    }
}
