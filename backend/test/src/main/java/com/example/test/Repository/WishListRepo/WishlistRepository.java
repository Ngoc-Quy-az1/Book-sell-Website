package com.example.test.Repository.WishListRepo;

import com.example.test.Entity.Book;
import com.example.test.Entity.User;
import com.example.test.Entity.WishList.Wishlist;
import com.example.test.Entity.WishList.WishlistId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.transaction.Transactional;
import java.util.List;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, WishlistId> {
    // Kiểm tra xem sách đã có trong danh sách yêu thích chưa
    @Query("SELECT CASE WHEN COUNT(w) > 0 THEN true ELSE false END FROM Wishlist w WHERE w.user = :user AND w.book = :book")
    boolean existsByUserAndBook(@Param("user") User user, @Param("book") Book book);

    // Tìm danh sách sách yêu thích của người dùng
    @Query("SELECT w.book FROM Wishlist w WHERE w.user.ID = :userId")
    List<Book> findBooksByUserId(@Param("userId") int userId);

    // Xóa sách khỏi danh sách yêu thích
    @Modifying
    @Transactional
    @Query("DELETE FROM Wishlist w WHERE w.user.ID = :userId AND w.book.ID = :bookId")
    void deleteByUserIdAndBookId(@Param("userId") int userId, @Param("bookId") int bookId);

    // Tìm wishlist theo userId và bookId
    @Query("SELECT w FROM Wishlist w WHERE w.user.ID = :userId AND w.book.ID = :bookId")
    Wishlist findByUserIdAndBookId(@Param("userId") int userId, @Param("bookId") int bookId);
} 