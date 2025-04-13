package com.example.test.Repository.BookRepo;

import com.example.test.Entity.Book;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;



@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
        List<Book> findByCategory(String category);
        @Query("SELECT DISTINCT b.category FROM Book b")
        List<String> findDistinctCategories();
}
