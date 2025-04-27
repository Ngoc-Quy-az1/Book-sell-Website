package com.example.test.Repository.BookRepo;

import com.example.test.Entity.Book;

import java.util.List;

import org.springdoc.core.converters.models.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
        List<Book> findByCategory(String category);
        
        @Query("SELECT b.title FROM Book b WHERE b.ID = :bookId")
        String findTitleByBookId(@Param("bookId") Integer bookId);
        

        @Query("SELECT DISTINCT b.category FROM Book b")
        List<String> findDistinctCategories();

        // xử lý theo giá tăng dần
        @Query("SELECT b FROM Book b WHERE (:category IS NULL OR b.category = :category) ORDER BY b.price_discounted ASC")
        List<Book> findAllByCategoryOptionalOrderByPriceASC(@Param("category") String category);
        

        // xử lý theo giá giảm dần 
        @Query("SELECT b FROM Book b WHERE (:category IS NULL OR b.category = :category) ORDER BY b.price_discounted DESC")
        List<Book> findAllByCategoryOptionalOrderByPriceDesc(@Param("category") String category);
        

        @Query("SELECT b FROM Book b WHERE b.price_discounted >= :price1 AND b.price_discounted <= :price2 ORDER BY b.price_discounted ASC")
        Page<Book> findByPrice(@Param("price1") int price1, @Param("price2") int price2, org.springframework.data.domain.Pageable pageable);
        
        
}
