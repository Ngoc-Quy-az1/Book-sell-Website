package com.example.test.Service;

import com.example.test.DTO.book.request.UpdateBookDTO;
import com.example.test.Entity.Book;
import com.example.test.Repository.BookRepo.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    // Thêm sách mới
    public Book addBook(Book book) {
        return bookRepository.save(book);
    }

    // Cập nhật sách
    public Book updateBook(int id, UpdateBookDTO bookDTO) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isPresent()) {
            Book book = optionalBook.get();

            if (bookDTO.getTitle() != null)
                book.setTitle(bookDTO.getTitle());
            if (bookDTO.getPrice_discounted() != null)
                book.setPrice_discounted(bookDTO.getPrice_discounted());
            if (bookDTO.getPrice_original() != null)
                book.setPrice_original(bookDTO.getPrice_original());
            if (bookDTO.getPages() != null)
                book.setPages(bookDTO.getPages());
            if (bookDTO.getStock() != null)
                book.setStock(bookDTO.getStock());
            if (bookDTO.getImage() != null)
                book.setImage(bookDTO.getImage());
            if (bookDTO.getDescription() != null)
                book.setDescription(bookDTO.getDescription());
            if (bookDTO.getAuthor() != null)
                book.setAuthor(bookDTO.getAuthor());
            if (bookDTO.getTranslator() != null)
                book.setTranslator(bookDTO.getTranslator());
            if (bookDTO.getPublisher() != null)
                book.setPublisher(bookDTO.getPublisher());
            if (bookDTO.getDimensions() != null)
                book.setDimensions(bookDTO.getDimensions());
            if (bookDTO.getCategory() != null)
                book.setCategory(bookDTO.getCategory());
            if (bookDTO.getCreated_at() != null)
                book.setCreated_at(bookDTO.getCreated_at());

            return bookRepository.save(book);
        } else {
            throw new RuntimeException("Book not found with id: " + id);
        }
    }

    // Xóa sách
    public void deleteBook(int id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
        } else {
            throw new RuntimeException("Book not found with id: " + id);
        }
    }

    // Lấy thông tin sách theo ID
    public Book getBookById(int id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    // Lấy danh sách tất cả sách
    public Iterable<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Lấy danh sách sách theo thể loại
    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category);
    }

    // Lấy sách theo khoảng giá cho trước
    public Page<Book> getBookByPrice(int price1, int price2, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return bookRepository.findByPrice(price1, price2, pageable);
    }

    // Lấy tất cả sách, phân trang mỗi trang 20 object
    public Page<Book> getAllBooksPaginated(int page, int size) {
        return bookRepository.findAll(PageRequest.of(page, size));
    }

    // Giá tăng dần
    // public Page<Book> getAllBooksPaginatedPriceAsc(int page, int size, String
    // category) {
    // Pageable pageable = PageRequest.of(page, size);
    // List<Book> sortedBooks =
    // bookRepository.findAllByCategoryOptionalOrderByPriceASC(category);
    // int start = Math.min((int) pageable.getOffset(), sortedBooks.size());
    // int end = Math.min((start + pageable.getPageSize()), sortedBooks.size());
    // return new PageImpl<>(sortedBooks.subList(start, end), pageable,
    // sortedBooks.size());
    // }

    // Giá giảm dần
    // public Page<Book> getAllBooksByCategoryPaginatedPriceDesc(int page, int size,
    // String category) {
    // Pageable pageable = PageRequest.of(page, size);
    // List<Book> sortedBooks =
    // bookRepository.findAllByCategoryOptionalOrderByPriceDesc(category);
    // int start = Math.min((int) pageable.getOffset(), sortedBooks.size());
    // int end = Math.min((start + pageable.getPageSize()), sortedBooks.size());
    // return new PageImpl<>(sortedBooks.subList(start, end), pageable,
    // sortedBooks.size());
    // }

    // Lấy thê thể loại sách
    public List<String> getAllCategories() {
        return bookRepository.findDistinctCategories();
    }

    // hàm lấy tất cả mọi thứ liên quan tới sách
    public Page<Book> getAllBooks(String sort, Integer minPrice, Integer maxPrice, int page, int size,
            List<String> categories, String search) {
        Pageable pageable = PageRequest.of(page, size);

        boolean hasSort = sort != null && !sort.isEmpty();
        boolean hasCategory = categories != null && !categories.isEmpty();
        boolean hasSearch = search != null && !search.isEmpty();
        boolean hasPrice = minPrice != null && maxPrice != null;

        // Nếu chỉ lọc theo khoảng giá
        if (!hasCategory && !hasSearch && !hasSort && hasPrice) {
            return bookRepository.findByPrice(minPrice, maxPrice, pageable);
        }

        // Nếu chỉ lọc theo category
        if (hasCategory && !hasSearch && !hasSort && !hasPrice) {
            return bookRepository.findByCategoryIn(categories, pageable);
        }

        // Nếu chỉ lọc theo search
        if (!hasCategory && hasSearch && !hasSort && !hasPrice) {
            return bookRepository.findByTitleOrAuthorOrCategory(search, pageable);
        }

        // Nếu chỉ sort (không category, search, price)
        if (hasSort && !hasCategory && !hasSearch && !hasPrice) {
            if (sort.equalsIgnoreCase("asc")) {
                return bookRepository.findAllOrderByPriceDiscountedAsc(pageable);
            } else if (sort.equalsIgnoreCase("desc")) {
                return bookRepository.findAllOrderByPriceDiscountedDesc(pageable);
            } else if (sort.equalsIgnoreCase("Tdesc")) {
                return bookRepository.findAllOrderByTitleDiscountedDesc(pageable);
            } else {
                return bookRepository.findAllOrderByTitleDiscountedAsc(pageable);
            }
        }

        // Category + Price (không search, không sort)
        if (hasCategory && !hasSearch && !hasSort && hasPrice) {
            return bookRepository.findByCategoryInAndPrice(categories, minPrice, maxPrice, pageable);
        }

        // Search + Price (không category, không sort)
        if (!hasCategory && hasSearch && !hasSort && hasPrice) {
            return bookRepository.findBySearchAndPrice(search, minPrice, maxPrice, pageable);
        }

        // Category + Sort (không search, không price)
        if (hasCategory && !hasSearch && hasSort && !hasPrice) {
            if (sort.equalsIgnoreCase("asc")) {
                return bookRepository.findByCategoryInOrderByPriceAsc(categories, pageable);
            } else if (sort.equalsIgnoreCase("desc")) {
                return bookRepository.findByCategoryInOrderByPriceDesc(categories, pageable);
            } else if (sort.equalsIgnoreCase("Tdesc")) {
                return bookRepository.findByCategoryInOrderByTitleDesc(categories, pageable);
            } else {
                return bookRepository.findByCategoryInOrderByTitleAsc(categories, pageable);
            }
        }

        // Search + Sort (không category, không price)
        if (!hasCategory && hasSearch && hasSort && !hasPrice) {
            if (sort.equalsIgnoreCase("asc")) {
                return bookRepository.findBySearchOrderByPriceAsc(search, pageable);
            } else if (sort.equalsIgnoreCase("desc")) {
                return bookRepository.findBySearchOrderByPriceDesc(search, pageable);
            } else if (sort.equalsIgnoreCase("Tdesc")) {
                return bookRepository.findBySearchOrderByTitleDesc(search, pageable);
            } else {
                return bookRepository.findBySearchOrderByTitleAsc(search, pageable);
            }
        }

        // Category + Search (không sort, không price)
        if (hasCategory && hasSearch && !hasSort && !hasPrice) {
            return bookRepository.findByCategoryInAndSearch(categories, search, pageable);
        }

        // Category + Search + Sort (không price)
        if (hasCategory && hasSearch && hasSort && !hasPrice) {
            if (sort.equalsIgnoreCase("asc")) {
                return bookRepository.findByCategoryInAndSearchOrderByPriceAsc(categories, search, pageable);
            } else if (sort.equalsIgnoreCase("Desc")) {
                return bookRepository.findByCategoryInAndSearchOrderByPriceDesc(categories, search, pageable);
            } else if (sort.equalsIgnoreCase("Tdesc")) {
                return bookRepository.findByCategoryInAndSearchOrderByTitleDesc(categories, search, pageable);
            } else {
                return bookRepository.findByCategoryInAndSearchOrderByTitleAsc(categories, search, pageable);
            }
        }

        // Price + Sort (không category, không search)
        if (!hasCategory && !hasSearch && hasSort && hasPrice) {
            if (sort.equalsIgnoreCase("asc")) {
                return bookRepository.findByPriceOrderByAsc(minPrice, maxPrice, pageable);
            } else if (sort.equalsIgnoreCase("desc")) {
                return bookRepository.findByPriceOrderByDesc(minPrice, maxPrice, pageable);
            } else if (sort.equalsIgnoreCase("Tdesc")) {
                return bookRepository.findByPriceOrderByTitleDesc(minPrice, maxPrice, pageable);
            } else {
                return bookRepository.findByPriceOrderByTitleAsc(minPrice, maxPrice, pageable);
            }
        }

        // Category + Price + Sort (không search)
        if (hasCategory && !hasSearch && hasSort && hasPrice) {
            if (sort.equalsIgnoreCase("asc")) {
                return bookRepository.findByCategoryInAndPriceOrderByAsc(categories, minPrice, maxPrice, pageable);
            } else if (sort.equalsIgnoreCase("desc")) {
                return bookRepository.findByCategoryInAndPriceOrderByDesc(categories, minPrice, maxPrice, pageable);
            } else if (sort.equalsIgnoreCase("Tdesc")) {
                return bookRepository.findByCategoryInAndPriceOrderByTitleDesc(categories, minPrice, maxPrice,
                        pageable);
            } else {
                return bookRepository.findByCategoryInAndPriceOrderByTitleAsc(categories, minPrice, maxPrice, pageable);
            }
        }

        // Search + Price + Sort (không category)
        if (!hasCategory && hasSearch && hasSort && hasPrice) {
            if (sort.equalsIgnoreCase("asc")) {
                return bookRepository.findBySearchAndPriceOrderByAsc(search, minPrice, maxPrice, pageable);
            } else if (sort.equalsIgnoreCase("desc")) {
                return bookRepository.findBySearchAndPriceOrderByDesc(search, minPrice, maxPrice, pageable);
            } else if (sort.equalsIgnoreCase("Tdesc")) {
                return bookRepository.findBySearchAndPriceOrderByTitleDesc(search, minPrice, maxPrice, pageable);
            } else {
                return bookRepository.findBySearchAndPriceOrderByTitleAsc(search, minPrice, maxPrice, pageable);
            }
        }

        // Category + Search + Price (không sort)
        if (hasCategory && hasSearch && !hasSort && hasPrice) {
            return bookRepository.findByCategoryInAndSearchAndPrice(categories, search, minPrice, maxPrice, pageable);
        }

        // Full đủ hết Category + Search + Sort + Price
        if (hasCategory && hasSearch && hasSort && hasPrice) {
            if (sort.equalsIgnoreCase("asc")) {
                return bookRepository.findByCategoryInAndSearchAndPriceOrderByAsc(categories, search, minPrice,
                        maxPrice, pageable);
            } else if (sort.equalsIgnoreCase("desc")) {
                return bookRepository.findByCategoryInAndSearchAndPriceOrderByDesc(categories, search, minPrice,
                        maxPrice, pageable);
            } else if (sort.equalsIgnoreCase("Tdesc")) {
                return bookRepository.findByCategoryInAndSearchAndPriceOrderByTitleDesc(categories, search, minPrice,
                        maxPrice, pageable);
            } else {
                return bookRepository.findByCategoryInAndSearchAndPriceOrderByTitleAsc(categories, search, minPrice,
                        maxPrice, pageable);
            }
        }

        // Trường hợp fallback
        return bookRepository.findAll(pageable);
    }

}
