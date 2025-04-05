package com.example.test.Repository.CartRepo;

import com.example.test.Entity.Cart;
import com.example.test.Entity.CartId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, CartId> {
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.book WHERE c.userId = :userId AND c.bookId = :bookId AND c.isPurchased = false")
    Cart findByUserIdAndBookId(@Param("userId") Integer userId, @Param("bookId") Integer bookId);

    @Query("SELECT DISTINCT c FROM Cart c LEFT JOIN FETCH c.book WHERE c.userId = :userId AND c.isPurchased = false")
    List<Cart> findByUserId(@Param("userId") Integer userId);
} 