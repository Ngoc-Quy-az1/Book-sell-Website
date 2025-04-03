package com.example.test.Repository.UserRepo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.test.DTO.ReviewDTO.Response.ReviewDTO;
import com.example.test.Entity.Review;

import jakarta.persistence.Tuple;

public interface reviewRepository extends JpaRepository<Review, Integer> {

    // Truy vấn JPQL để ánh xạ kết quả thành ReviewDTO
//    @Query("SELECT new com.example.test.DTO.ReviewDTO.ReviewDTO(r.comment, r.rating, r.user.id, r.user.name, r.createdAt) " +
//           "FROM Review r JOIN r.user u JOIN r.book b WHERE b.id = :bookId")
//     List<ReviewDTO> findReviewsWithDTO(@Param("bookId") int bookId);


}