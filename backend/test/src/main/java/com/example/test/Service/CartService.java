package com.example.test.Service;

import com.example.test.Entity.Book;
import com.example.test.Entity.Cart;
import com.example.test.Entity.Notification;
import com.example.test.Repository.BookRepo.BookRepository;
import com.example.test.Repository.CartRepo.CartRepository;
import com.example.test.Repository.UserRepo.NotificationRepository;
import com.example.test.Repository.UserRepo.UserRepository;
import com.example.test.Repository.WishListRepo.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Transactional
    public Cart addToCart(Integer userId, Integer bookId, Integer quantity) {
        // Kiểm tra xem sách đã có trong giỏ hàng chưa
        Cart existingCart = cartRepository.findByUserIdAndBookId(userId, bookId);
        
        if (existingCart != null && !existingCart.getIsPurchased()) {
            throw new RuntimeException("Sách này đã có trong giỏ hàng của bạn!");
        }

        // Kiểm tra xem sách có trong wishlist không
        boolean isInWishlist = wishlistRepository.findByUserIdAndBookId(userId, bookId) != null;

        // Tạo mới item trong giỏ hàng
        Cart newCart = new Cart();
        newCart.setUserId(userId);
        newCart.setBookId(bookId);
        newCart.setQuantity(quantity);
        newCart.setIsPurchased(false);
        newCart.setIsLove(isInWishlist ? 1 : 0);
        newCart.setCreatedAt(Timestamp.from(Instant.now()));

        //Tạo thông báo thêm sách thành công 
        Notification notification = new Notification();
        notification.setUser(userRepository.findUserByID(userId));
        notification.setMessage("Bạn đã thêm sách"+" "+ bookRepository.findTitleByBookId(bookId)+" lúc  "+ new Date());
        notification.setCreatedAt(new Date());
        notification.setRead(false);
        notificationRepository.save(notification);
        return cartRepository.save(newCart);
    }

    @Transactional
    public String removeFromCart(Integer userId, Integer bookId) {
        Cart cart = cartRepository.findByUserIdAndBookId(userId, bookId);
        if (cart != null) {
            cartRepository.delete(cart);
            return "Xóa sản phẩm khỏi giỏ hàng thành công!";
        } else {
            throw new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng");
        }
    }

    @Transactional
    public Cart updateCartQuantity(Integer userId, Integer bookId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Số lượng phải lớn hơn 0");
        }
        
        Cart cart = cartRepository.findByUserIdAndBookId(userId, bookId);
        if (cart != null) {
            cart.setQuantity(quantity);
            return cartRepository.save(cart);
        }
        throw new RuntimeException("Không tìm thấy sản phẩm trong giỏ hàng");
    }

    public List<Cart> getCartByUserId(Integer userId) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống");
        }
        return cartItems;
    }

    @Transactional
    public void removeFromCart(Integer userId, List<Integer> bookIds) {
        for (Integer bookId : bookIds) {
            Cart cart = cartRepository.findByUserIdAndBookId(userId, bookId);
            if (cart != null) {
                cartRepository.delete(cart);
            }
        }
    }
}
