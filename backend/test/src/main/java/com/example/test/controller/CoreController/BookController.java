package com.example.test.controller.CoreController;

import com.example.test.DTO.book.request.UpdateBookDTO;
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
import java.util.Map;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;

    @Autowired
    private WishlistService wishlistService;

    /**
     * Thêm sách mới vào hệ thống
     * Method: POST
     * URL: http://localhost:8090/api/books/add
     * 
     * Request Body:
     * {
     *   "title": "Book Title",           // Tên sách
     *   "price_original": 199000,        // Giá gốc
     *   "price_discounted": 149000,      // Giá đã giảm
     *   "description": "Book Description", // Mô tả sách
     *   "author": "Author Name",         // Tác giả
     *   "translator": "Translator Name", // Dịch giả (nếu có)
     *   "publisher": "Publisher Name",   // Nhà xuất bản
     *   "category": "Category Name",     // Thể loại
     *   "stock": 100,                    // Số lượng tồn kho
     *   "dimensions": "10x15x20 cm",     // Kích thước
     *   "pages": 300,                    // Số trang
     *   "created_at": "2022-01-01",      // Ngày tạo
     *   "image": "https://example.com/book-image.jpg" // URL hình ảnh
     * }
     * 
     * Success Response (200 OK):
     * {
     *   "id": 1,
     *   ... // Thông tin sách vừa thêm
     * }
     */
    @PostMapping("/add")
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        Book addedBook = bookService.addBook(book);
        return ResponseEntity.ok(addedBook);
    }

    /**
     * Cập nhật thông tin sách
     * Method: PUT
     * URL: http://localhost:8090/api/books/update/{id}
     * 
     * Path Variable:
     * - id: ID của sách cần cập nhật
     * 
     * Request Body: (Chỉ cần gửi các trường cần cập nhật)
        * {
        *   "title": "Updated Book Title",   // Tên sách mới
        *   "price_original": 199000,        // Giá gốc mới
        *   "price_discounted": 149000,      // Giá đã giảm mới
        *   "description": "Updated Description", // Mô tả sách mới
        *   "author": "Updated Author",      // Tác giả mới
        *   "translator": "Updated Translator", // Dịch giả mới (nếu có)
        *   "publisher": "Updated Publisher", // Nhà xuất bản mới
        *   "category": "Updated Category", // Thể loại mới
        *   "stock": 50,                    // Số lượng tồn kho mới
        *   "dimensions": "12x18x25 cm",     // Kích thước mới
        *   "pages": 350,                    // Số trang mới
        *   "created_at": "2022-02-01",      // Ngày tạo mới
        *   "image": "https://example.com/updated-book-image.jpg" // URL hình ảnh mới
        * }
     * 
     * Success Response (200 OK):
     * {
     *   "id": 1,
     *   ... // Thông tin sách sau khi cập nhật
     * }
     */
@PutMapping("/update/{id}")
public ResponseEntity<Book> updateBook(@PathVariable int id, @RequestBody UpdateBookDTO bookDTO) {
    Book updatedBook = bookService.updateBook(id, bookDTO);
    return ResponseEntity.ok(updatedBook);
}


    /**
     * Xóa sách khỏi hệ thống
     * Method: DELETE
     * URL: http://localhost:8090/api/books/delete/{id}
     * 
     * Path Variable:
     * - id: ID của sách cần xóa
     * 
     * Success Response (200 OK):
     * "Book deleted successfully."
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable int id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok("Book deleted successfully.");
    }

    /**
     * Lấy thông tin chi tiết của một sách
     * Method: GET
     * URL: http://localhost:8090/api/books/{id}
     * 
     * Path Variable:
     * - id: ID của sách cần xem
     * 
     * Success Response (200 OK):
     * {
     *   "id": 1,
     *   "title": "Book Title",
     *   "price_original": 199000,
     *   "price_discounted": 149000,
     *   ... // Toàn bộ thông tin của sách
     * }
     */
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable int id) {
        Book book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    /**
     * Lấy danh sách tất cả sách
     * Method: GET
     * URL: http://localhost:8090/api/books/all
     * 
     * Success Response (200 OK):
     * [
     *   {
     *     "id": 1,
     *     ... // Thông tin sách 1
     *   },
     *   {
     *     "id": 2,
     *     ... // Thông tin sách 2
     *   }
     * ]
     */
    @GetMapping("/all")
    public ResponseEntity<List<Book>> getAllBooks() {
        Iterable<Book> booksIterable = bookService.getAllBooks();  
        List<Book> booksList = new ArrayList<>();  
        booksIterable.forEach(booksList::add);  
        return ResponseEntity.ok(booksList);  
    }

    /**
     * Lấy danh sách sách theo thể loại
     * Method: GET
     * URL: http://localhost:8090/api/books/category?category=Tiểu thuyết
     * 
     * Query Parameter:
     * - category: Tên thể loại cần tìm
     * 
     * Success Response (200 OK):
     * [
     *   {
     *     "id": 1,
     *     "category": "Tiểu thuyết",
     *     ... // Thông tin sách
     *   }
     * ]
     */
    @GetMapping("/category")
    public ResponseEntity<List<Book>> getBooksByCategory(@RequestParam String category) {
        List<Book> books = bookService.getBooksByCategory(category);
        return ResponseEntity.ok(books);
    }

    /**
     * Thêm sách vào danh sách yêu thích
     * Method: POST
     * URL: http://localhost:8090/api/books/wishlist/{userId}/{bookId}
     * 
     * Path Variables:
     * - userId: ID của người dùng
     * - bookId: ID của sách muốn thêm vào wishlist
     * 
     * Success Response (200 OK):
     * "Book added to wishlist successfully."
     * 
     * Error Response (400 Bad Request):
     * "Book is already in the wishlist."
     */
    @PostMapping("/wishlist/{userId}/{bookId}")
    public ResponseEntity<String> addBookToWishlist(@PathVariable int userId, @PathVariable int bookId) {
        boolean isAdded = wishlistService.addBookToWishlist(userId, bookId);
        if (isAdded) {
            return ResponseEntity.ok("Book added to wishlist successfully.");
        } else {
            return ResponseEntity.badRequest().body("Book is already in the wishlist.");
        }
    }

    /**
     * Lấy danh sách sách yêu thích của người dùng
     * Method: GET
     * URL: http://localhost:8090/api/books/wishlist/{userId}
     * 
     * Path Variable:
     * - userId: ID của người dùng
     * 
     * Success Response (200 OK):
     * [
     *   {
     *     "id": 1,
     *     ... // Thông tin sách trong wishlist
     *   }
     * ]
     */
    @GetMapping("/wishlist/{userId}")
    public ResponseEntity<List<Book>> getWishlist(@PathVariable int userId) {
        List<Book> wishlist = wishlistService.getWishlistByUserId(userId);
        return ResponseEntity.ok(wishlist);
    }

    /**
     * Xóa sách khỏi danh sách yêu thích    
     * Method: DELETE
     * URL: http://localhost:8090/api/books/wishlist/{userId}/{bookId}
     * 
     * Path Variables:
     * - userId: ID của người dùng
     * - bookId: ID của sách muốn xóa khỏi wishlist
     * 
     * Success Response (200 OK):
     * "Book deleted from wishlist successfully."
     */
    @DeleteMapping("/wishlist/{userId}/{bookId}")
    public ResponseEntity<String> deleteBookFromWishlist(@PathVariable int userId, @PathVariable int bookId) {
        wishlistService.deleteBookFromWishlist(userId, bookId);
        return ResponseEntity.ok("Book deleted from wishlist successfully.");
    }

    /**
     * Lấy danh sách sách có phân trang
     * Method: GET
     * URL: http://localhost:8090/api/books/GetAllPaginated?page=0&size=20
     * 
     * Query Parameters:
     * - page: Số trang (mặc định: 0)
     * - size: Số sách mỗi trang (mặc định: 20)
     * 
     * Success Response (200 OK):
     * {
     *   "content": [
     *     {
     *       "id": 1,
     *       "title": "Book Title",
     *       "author": "Author Name",
     *       "category": "Category",
     *       "image": "image_url",
     *       "price_discounted": 149000,
     *       "price_original": 199000,
     *       "description": "Book Description"
     *     }
     *   ],
     *   "totalPages": 5,
     *   "totalElements": 100,
     *   "size": 20,
     *   "number": 0
     * }
     */
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
            response.setPrice_discounted((int)book.getPrice_discounted());
            response.setPrice_original((int) book.getPrice_original());
            response.setDescription(book.getDescription());
            return response;
        }).collect(Collectors.toList());
        Page<BookResponse> responsePage = new PageImpl<>(bookResponses, PageRequest.of(page, size), booksPage.getTotalElements());
        return ResponseEntity.ok(responsePage);
    }

    //Api lấy ra danh sách sách có phân trang và sắp xếp theo giá tăng dần 
    // Nếu không truyền về số trang thì mặc định lấy trang 0
    // http://localhost:8090/api/books/GetAllPaginated/sortedAcss
    // 
    // http://localhost:8090/api/books/GetAllPaginated/sortedAcs?page=1&size=20
    @GetMapping("/GetAllPaginated/sortedAcs")
    public ResponseEntity<Page<BookResponse>> getAllBooksPaginatedSortedAcs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category) {
        Page<Book> booksPage = bookService.getAllBooksPaginatedPriceAsc(page, size,category);
        List<BookResponse> bookResponses = booksPage.getContent().stream().map(book -> {
            BookResponse response = new BookResponse();
            response.setId(book.getID());
            response.setTitle(book.getTitle());
            response.setAuthor(book.getAuthor());
            response.setCategory(book.getCategory());
            response.setImage(book.getImage());
            response.setPrice_discounted((int)book.getPrice_discounted());
            response.setPrice_original((int) book.getPrice_original());
            response.setDescription(book.getDescription());
            return response;
        }).collect(Collectors.toList());
        Page<BookResponse> responsePage = new PageImpl<>(bookResponses, PageRequest.of(page, size), booksPage.getTotalElements());
        return ResponseEntity.ok(responsePage);
    }

    //Api lấy ra danh sách sách có phân trang và sắp xếp theo giá giảm dần 
    // Nếu không truyền về số trang thì mặc định lấy trang 0
    // http://localhost:8090/api/books/GetAllPaginated/sortedDesc
    // 
    // http://localhost:8090/api/books/GetAllPaginated/sortedDesc?page=1&size=20
    @GetMapping("/GetAllPaginated/sortedDesc")
    public ResponseEntity<Page<BookResponse>> getAllBooksPaginatedSortedDesc(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String category) {
    
        Page<Book> booksPage = bookService.getAllBooksByCategoryPaginatedPriceDesc(page, size, category);
    
        List<BookResponse> bookResponses = booksPage.getContent().stream().map(book -> {
            BookResponse response = new BookResponse();
            response.setId(book.getID());
            response.setTitle(book.getTitle());
            response.setAuthor(book.getAuthor());
            response.setCategory(book.getCategory());
            response.setImage(book.getImage());
            response.setPrice_discounted((int) book.getPrice_discounted());
            response.setPrice_original((int) book.getPrice_original());
            response.setDescription(book.getDescription());
            return response;
        }).collect(Collectors.toList());
    
        Page<BookResponse> responsePage = new PageImpl<>(bookResponses, PageRequest.of(page, size), booksPage.getTotalElements());
        return ResponseEntity.ok(responsePage);
    }
    

    //Api lấy ra các thể loại sách đang có 
    // http://localhost:8090/api/books/AllTypeCategories
    @GetMapping("/AllTypeCategories")
    public ResponseEntity<List<String>> getTypeCategories() {
        List<String> categories = bookService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    //API lấy sách theo khoảng giá cho trước
    //http://localhost:8090/api/books/GetAllPaginated/SearchByPrice
    // request body
    // {
    //     "minPrice" : "10000",
    //     "maxPrice" : "20000",
    //     "page" : "0",
    //     "size" : "20",
    // }
    
    @PostMapping("/GetAllPaginated/SearchByPrice")
    public ResponseEntity<Page<BookResponse>> getBooksByPrice(@RequestBody Map<String, Integer> priceRange) {
        int minPrice = priceRange.get("minPrice");
        int maxPrice = priceRange.get("maxPrice");
        int page = priceRange.getOrDefault("page", 0);
        int size = priceRange.getOrDefault("size", 20);
    
        Page<Book> booksPage = bookService.getBookByPrice(minPrice, maxPrice, page, size);
    
        List<BookResponse> bookResponses = booksPage.getContent().stream().map(book -> {
            BookResponse response = new BookResponse();
            response.setId(book.getID());
            response.setTitle(book.getTitle());
            response.setAuthor(book.getAuthor());
            response.setCategory(book.getCategory());
            response.setImage(book.getImage());
            response.setPrice_discounted((int) book.getPrice_discounted());
            response.setPrice_original((int) book.getPrice_original());
            response.setDescription(book.getDescription());
            return response;
        }).collect(Collectors.toList());
    
        Page<BookResponse> responsePage = new PageImpl<>(bookResponses, PageRequest.of(page, size), booksPage.getTotalElements());
        return ResponseEntity.ok(responsePage);
    }
    
    
}
