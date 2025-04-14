package com.example.test.Service;

import com.example.test.Entity.Book;
import com.example.test.Repository.BookRepo.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

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
    public Book updateBook(int id, Book bookDetails) {
        Optional<Book> book = bookRepository.findById(id);

        if (book.isPresent()) {
            Book existingBook = book.get();
            existingBook.setTitle(bookDetails.getTitle());
            existingBook.setImage(bookDetails.getImage());
            existingBook.setPrice_discounted(bookDetails.getPrice_discounted());
            existingBook.setPrice_original(bookDetails.getPrice_original());
            existingBook.setDescription(bookDetails.getDescription());
            existingBook.setAuthor(bookDetails.getAuthor());
            existingBook.setTranslator(bookDetails.getTranslator());
            existingBook.setPublisher(bookDetails.getPublisher());
            existingBook.setDimensions(bookDetails.getDimensions());
            existingBook.setPages(bookDetails.getPages());
            existingBook.setCreated_at(bookDetails.getCreated_at());
            existingBook.setStock(bookDetails.getStock());
            existingBook.setCategory(bookDetails.getCategory());
            return bookRepository.save(existingBook);
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

    //Lấy tất cả sách, phân trang mỗi trang 20 object
    public Page<Book> getAllBooksPaginated(int page, int size) {
        return bookRepository.findAll(PageRequest.of(page, size));
    }
    public List<String> getAllCategories() {
        return bookRepository.findDistinctCategories();
    }
}
