package com.example.test.Repository.BookRepo;

import com.example.test.Entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

       // Tìm theo 1 category
       List<Book> findByCategory(String category);

       // Tìm tiêu đề theo ID sách
       @Query("SELECT b.title FROM Book b WHERE b.ID = :bookId")
       String findTitleByBookId(@Param("bookId") Integer bookId);

       // Lấy danh sách tất cả category không trùng
       @Query("SELECT DISTINCT b.category FROM Book b")
       List<String> findDistinctCategories();

       // Lấy tất cả sách có phân trang và sắp xếp
       @Query("SELECT b FROM Book b ORDER BY b.price_discounted ASC")
       Page<Book> findAllOrderByPriceDiscountedAsc(Pageable pageable);

       @Query("SELECT b FROM Book b ORDER BY b.price_discounted DESC")
       Page<Book> findAllOrderByPriceDiscountedDesc(Pageable pageable);

       @Query("SELECT b FROM Book b ORDER BY b.title DESC")
       Page<Book> findAllOrderByTitleDiscountedDesc(Pageable pageable);

       @Query("SELECT b FROM Book b ORDER BY b.title ASC")
       Page<Book> findAllOrderByTitleDiscountedAsc(Pageable pageable);

       // Giá tăng dần có phân trang (Category optional)
       @Query("SELECT b FROM Book b WHERE (:category IS NULL OR b.category = :category) ORDER BY b.price_discounted ASC")
       Page<Book> findAllByCategoryOptionalOrderByPriceASC(@Param("category") String category, Pageable pageable);

       // Giá giảm dần có phân trang (Category optional)
       @Query("SELECT b FROM Book b WHERE (:category IS NULL OR b.category = :category) ORDER BY b.price_discounted DESC")
       Page<Book> findAllByCategoryOptionalOrderByPriceDesc(@Param("category") String category, Pageable pageable);

       // Tìm sách theo khoảng giá
       @Query("SELECT b FROM Book b WHERE b.price_discounted >= :price1 AND b.price_discounted <= :price2 ORDER BY b.price_discounted ASC")
       Page<Book> findByPrice(@Param("price1") Integer price1, @Param("price2") Integer price2, Pageable pageable);

       // 🔥 Tìm theo nhiều category
       Page<Book> findByCategoryIn(List<String> categories, Pageable pageable);

       // 🔥 Tìm theo nhiều category + sort
       @Query("SELECT b FROM Book b WHERE b.category IN :categories ORDER BY b.price_discounted ASC")
       Page<Book> findByCategoryInOrderByPriceAsc(@Param("categories") List<String> categories, Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.category IN :categories ORDER BY b.price_discounted DESC")
       Page<Book> findByCategoryInOrderByPriceDesc(@Param("categories") List<String> categories, Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.category IN :categories ORDER BY b.title DESC")
       Page<Book> findByCategoryInOrderByTitleDesc(@Param("categories") List<String> categories, Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.category IN :categories ORDER BY b.title ASC")
       Page<Book> findByCategoryInOrderByTitleAsc(@Param("categories") List<String> categories, Pageable pageable);

       // 🔥 Search theo title, author, category (không cần sort)
       @Query("SELECT b FROM Book b WHERE b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%")
       Page<Book> findByTitleOrAuthorOrCategory(@Param("search") String search, Pageable pageable);

       // 🔥 Search theo title + sort
       @Query("SELECT b FROM Book b WHERE b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search% ORDER BY b.price_discounted ASC")
       Page<Book> findBySearchOrderByPriceAsc(@Param("search") String search, Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search% ORDER BY b.price_discounted DESC")
       Page<Book> findBySearchOrderByPriceDesc(@Param("search") String search, Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search% ORDER BY b.title DESC")
       Page<Book> findBySearchOrderByTitleDesc(@Param("search") String search, Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search% ORDER BY b.title ASC")
       Page<Book> findBySearchOrderByTitleAsc(@Param("search") String search, Pageable pageable);

       // 🔥 Tìm category + search + sort
       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) ORDER BY b.price_discounted ASC")
       Page<Book> findByCategoryInAndSearchOrderByPriceAsc(@Param("categories") List<String> categories,
                     @Param("search") String search, Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) ORDER BY b.price_discounted DESC")
       Page<Book> findByCategoryInAndSearchOrderByPriceDesc(@Param("categories") List<String> categories,
                     @Param("search") String search, Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) ORDER BY b.title DESC")
       Page<Book> findByCategoryInAndSearchOrderByTitleDesc(@Param("categories") List<String> categories,
                     @Param("search") String search, Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) ORDER BY b.title ASC")
       Page<Book> findByCategoryInAndSearchOrderByTitleAsc(@Param("categories") List<String> categories,
                     @Param("search") String search, Pageable pageable);

       // 🔥 Tìm category + search + price + sort ASC
       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) AND b.price_discounted >= :price1 AND b.price_discounted <= :price2 ORDER BY b.price_discounted ASC")
       Page<Book> findByCategoryInAndSearchAndPriceAsc(@Param("categories") List<String> categories,
                     @Param("search") String search, @Param("price1") int price1, @Param("price2") int price2,
                     Pageable pageable);

       // 🔥 Tìm category + search + price + sort DESC
       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) AND b.price_discounted >= :price1 AND b.price_discounted <= :price2 ORDER BY b.price_discounted DESC")
       Page<Book> findByCategoryInAndSearchAndPriceDesc(@Param("categories") List<String> categories,
                     @Param("search") String search, @Param("price1") int price1, @Param("price2") int price2,
                     Pageable pageable);

       // 🔥 Tìm theo price và sort ASC
       @Query("SELECT b FROM Book b WHERE b.price_discounted >= :price1 AND b.price_discounted <= :price2 ORDER BY b.price_discounted ASC")
       Page<Book> findByPriceAndSortAsc(@Param("price1") int price1, @Param("price2") int price2, Pageable pageable);

       // 🔥 Tìm theo price và sort DESC
       @Query("SELECT b FROM Book b WHERE b.price_discounted >= :price1 AND b.price_discounted <= :price2 ORDER BY b.price_discounted DESC")
       Page<Book> findByPriceAndSortDesc(@Param("price1") int price1, @Param("price2") int price2, Pageable pageable);

       // Tìm theo nhiều category và từ khóa
       @Query("SELECT b FROM Book b " +
                     "WHERE b.category IN :categories " +
                     "AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
                     "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')) " +
                     "OR LOWER(b.category) LIKE LOWER(CONCAT('%', :search, '%')))")
       Page<Book> findByCategoryInAndSearch(@Param("categories") List<String> categories,
                     @Param("search") String search,
                     Pageable pageable);

       // Tìm theo nhiều category và khoảng giá
       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND b.price_discounted >= :price1 AND b.price_discounted <= :price2")
       Page<Book> findByCategoryInAndPrice(@Param("categories") List<String> categories,
                     @Param("price1") Integer price1,
                     @Param("price2") Integer price2,
                     Pageable pageable);

       // Tìm sách theo search term và khoảng giá
       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) AND b.price_discounted >= :price1 AND b.price_discounted <= :price2")
       Page<Book> findBySearchAndPrice(@Param("search") String search,
                     @Param("price1") Integer price1,
                     @Param("price2") Integer price2,
                     Pageable pageable);

       // Phương thức tìm kiếm sách theo giá từ thấp đến cao
       @Query("SELECT b FROM Book b WHERE b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.price_discounted ASC")
       Page<Book> findByPriceOrderByAsc(@Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.price_discounted DESC")
       Page<Book> findByPriceOrderByDesc(@Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.title DESC")
       Page<Book> findByPriceOrderByTitleDesc(@Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.title ASC")
       Page<Book> findByPriceOrderByTitleAsc(@Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       // Phương thức tìm kiếm sách theo thể loại và giá (sắp xếp theo giá tăng dần)
       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.price_discounted ASC")
       Page<Book> findByCategoryInAndPriceOrderByAsc(@Param("categories") List<String> categories,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.price_discounted DESC")
       Page<Book> findByCategoryInAndPriceOrderByDesc(@Param("categories") List<String> categories,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.title DESC")
       Page<Book> findByCategoryInAndPriceOrderByTitleDesc(@Param("categories") List<String> categories,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE b.category IN :categories AND b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.title ASC")
       Page<Book> findByCategoryInAndPriceOrderByTitleAsc(@Param("categories") List<String> categories,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       // Phương thức tìm kiếm sách theo từ khóa và khoảng giá (sắp xếp theo tên sách
       // tăng dần)

       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) AND b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.price_discounted ASC")
       Page<Book> findBySearchAndPriceOrderByAsc(@Param("search") String search,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) AND b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.price_discounted DESC")
       Page<Book> findBySearchAndPriceOrderByDesc(@Param("search") String search,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) AND b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.title ASC")
       Page<Book> findBySearchAndPriceOrderByTitleAsc(@Param("search") String search,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) AND b.price_discounted BETWEEN :minPrice AND :maxPrice ORDER BY b.title DESC")
       Page<Book> findBySearchAndPriceOrderByTitleDesc(@Param("search") String search,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) "
                     +
                     "AND (b.category IN :categories OR :categories IS NULL) " +
                     "AND b.price_discounted BETWEEN :minPrice AND :maxPrice")
       Page<Book> findByCategoryInAndSearchAndPrice(@Param("categories") List<String> categories,
                     @Param("search") String search,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       // Tìm theo nhiều category + search + price + sort DESC
       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) "
                     +
                     "AND (b.category IN :categories OR :categories IS NULL) " +
                     "AND b.price_discounted BETWEEN :minPrice AND :maxPrice " +
                     "ORDER BY b.price_discounted DESC")
       Page<Book> findByCategoryInAndSearchAndPriceOrderByDesc(@Param("categories") List<String> categories,
                     @Param("search") String search,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) "
                     +
                     "AND (b.category IN :categories OR :categories IS NULL) " +
                     "AND b.price_discounted BETWEEN :minPrice AND :maxPrice " +
                     "ORDER BY b.price_discounted ASC")
       Page<Book> findByCategoryInAndSearchAndPriceOrderByAsc(@Param("categories") List<String> categories,
                     @Param("search") String search,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) "
                     +
                     "AND (b.category IN :categories OR :categories IS NULL) " +
                     "AND b.price_discounted BETWEEN :minPrice AND :maxPrice " +
                     "ORDER BY b.title ASC")
       Page<Book> findByCategoryInAndSearchAndPriceOrderByTitleAsc(@Param("categories") List<String> categories,
                     @Param("search") String search,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

       @Query("SELECT b FROM Book b WHERE (b.title LIKE %:search% OR b.author LIKE %:search% OR b.category LIKE %:search%) "
                     +
                     "AND (b.category IN :categories OR :categories IS NULL) " +
                     "AND b.price_discounted BETWEEN :minPrice AND :maxPrice " +
                     "ORDER BY b.title DESC")
       Page<Book> findByCategoryInAndSearchAndPriceOrderByTitleDesc(@Param("categories") List<String> categories,
                     @Param("search") String search,
                     @Param("minPrice") Integer minPrice,
                     @Param("maxPrice") Integer maxPrice,
                     Pageable pageable);

}
