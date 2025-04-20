package com.example.test.Repository.UserRepo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.test.DTO.ReviewDTO.Response.ReviewDTO;
import com.example.test.Entity.Review;

public interface reviewRepository extends JpaRepository<Review, Integer> {
  
    @Query("SELECT new com.example.test.DTO.ReviewDTO.Response.ReviewDTO(r.comment, r.rating, r.user.id, u.name, r.createdAt) " +
       "FROM Review r JOIN r.user u JOIN r.book b WHERE b.ID = :bookId")
    List<ReviewDTO> findReviewsByBookId(@Param("bookId") int bookId);
}