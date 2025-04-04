package com.example.test.Service;

import com.example.test.Entity.Book;
import com.example.test.Entity.User;
import com.example.test.Entity.WishList.Wishlist;
import com.example.test.Entity.WishList.WishlistId;
import com.example.test.Repository.BookRepo.BookRepository;
import com.example.test.Repository.WishListRepo.WishlistRepository;
import com.example.test.Repository.UserRepo.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    // Thêm sách vào danh sách yêu thích
    public boolean addBookToWishlist(int userId, int bookId) {
        // Lấy đối tượng User và Book từ cơ sở dữ liệu
        User user = userRepository.findById(userId).orElse(null);
        Book book = bookRepository.findById(bookId).orElse(null);
    
        // Kiểm tra nếu User và Book tồn tại
        if (user == null || book == null) {
            return false;
        }
    
        // Kiểm tra xem sách đã có trong danh sách yêu thích chưa
        if (wishlistRepository.existsByUserAndBook(user, book)) {
            return false;
        }
    
        // Tạo WishlistId từ userId và bookId
        WishlistId wishlistId = new WishlistId(userId, bookId);
    
        // Tạo đối tượng Wishlist với WishlistId
        Wishlist wishlist = new Wishlist();
        wishlist.setId(wishlistId);
        wishlist.setUser(user);
        wishlist.setBook(book);
    
        // Lưu sách vào danh sách yêu thích
        wishlistRepository.save(wishlist);
    
        return true;
    }
    
    // Xóa sách khỏi danh sách yêu thích
    public void deleteBookFromWishlist(int userId, int bookId) {
        // Lấy đối tượng Wishlist từ cơ sở dữ liệu
        WishlistId wishlistId = new WishlistId(userId, bookId);
        wishlistRepository.deleteByUserIdAndBookId(userId, bookId);
    }
    // Lấy danh sách sách yêu thích của một người dùng
    public List<Book> getWishlistByUserId(int userId) {
        return wishlistRepository.findBooksByUserId(userId);
    }
}

