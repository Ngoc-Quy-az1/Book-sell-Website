package com.example.test.Service;


import com.example.test.DTO.Login_logout_register.Request.MoreRegisterDTO;
import com.example.test.DTO.Login_logout_register.Request.logInDTO;
import com.example.test.DTO.Login_logout_register.Request.registerDTO;
import com.example.test.DTO.Login_logout_register.Respose.ResponseLogInDTO;
import com.example.test.DTO.Login_logout_register.Respose.registerResponseDTO;
import com.example.test.DTO.ReviewDTO.Response.ReviewDTO;
import com.example.test.Entity.Book;
import com.example.test.Entity.Review;
import com.example.test.Entity.User;
import com.example.test.Entity.pendingUser;
import com.example.test.Repository.UserRepo.UserPendingRepository;
import com.example.test.Repository.UserRepo.UserRepository;
import com.example.test.Repository.UserRepo.reviewRepository;
import com.example.test.Repository.BookRepo.BookRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserPendingRepository userPendingRepository;

    @Autowired
    private reviewRepository reviewRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    public String generateRandomNumber() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 6; i++) {
            code.append(random.nextInt(10)); // Tạo số ngẫu nhiên từ 0-9
        }
        return code.toString();
    }

    // request body
    // kiểm tra nếu user đăng ký có tồn tại trong bảng user phụ không
    // tồn tại thì lưu vào bảng user phụ, và trả về true
    public boolean isExistUser(registerDTO user)
    {
        // nếu không tồn tại thì lưu vào bảng phụ và trả về false
        if (userPendingRepository.findUserByMail(user.getMail()) == null && userPendingRepository.findUserByPhone(user.getPhone()) == null)
        {
            pendingUser newUser = new pendingUser();
            newUser.setMail(user.getMail());
            newUser.setName(user.getName());
            newUser.setPhone(user.getPhone());
            newUser.setPassword(passwordEncoder.encode(user.getPassword()));
            String code = generateRandomNumber();
            newUser.setCode(code);
            userPendingRepository.save(newUser);
            mailService.sendMail(user.getMail(), "Verify your email", code + " is your code to register, please don't share with anyone else");
            return false;
        }
        // nếu tồn tại và chưa kích hoạt thì trả về true
//        if((userPendingRepository.findUserByMail(user.getMail()) != null || userPendingRepository.findUserByPhone(user.getPhone()) != null) && !user.isStatus())
//        {
//            entityManager.merge(user.getID());
//            return true;
//        }
        return true;
    }

    // verify
    public registerResponseDTO verify(String mail, String code)
    {
        pendingUser user = userPendingRepository.findUserByMail(mail);  
//        System.out.println(user);
//        pendingUser user = findByMail(mail);
        registerResponseDTO result = new registerResponseDTO();
        if (user == null) {
            result.setStatus(false);
            result.setMessage("Email not found");
            return result;
        }
        if (!user.isStatus())
        {
            System.out.println(code);
            System.out.println(user.getCode());
            if (code.equals(user.getCode()))
            {
                User user1 = new User();
                user1.setPassword(user.getPassword());
                user1.setMembershipLevel(User.MembershipLevel.Silver);
                user1.setName(user.getName());
                user1.setMail(user.getMail());
                user1.setPhone(user.getPhone());
                userRepository.save(user1);
                result.setMessage("Successfully register!");
                result.setStatus(true);
                user.setStatus(true);
                user.setCode(null);
                userPendingRepository.save(user);
                return result;
            }else{
                result.setMessage("Wrong code!");
                result.setStatus(false);
                return result;
            }
        }else {
            result.setMessage("Your account is enable! Log in now!");
            result.setStatus(false);
            return result;
        }

    }

    // log in
    public ResponseLogInDTO logIn(logInDTO infor) {
        ResponseLogInDTO result = new ResponseLogInDTO();
    
        // Kiểm tra đầu vào
        if (infor == null || (infor.getPhone() == null && infor.getMail() == null)) {
            result.setMessage("Phone or email is required!");
            result.setStatus(false);
            return result;
        }
    
        // Tìm user theo phone hoặc mail
        User user = null;
        if (infor.getPhone() != null) {
            user = userRepository.findUserByPhone(infor.getPhone());
        }
        if (user == null && infor.getMail() != null) {
            user = userRepository.findUserByMail(infor.getMail());
        }
    
        // Kiểm tra tài khoản tồn tại
        if (user == null) {
            result.setMessage("This account doesn't exist!");
            result.setStatus(false);
            return result;
        }
    
        // Kiểm tra mật khẩu
        if (passwordEncoder.matches(infor.getPassword(), user.getPassword())) {
            result.setUser_id(user.getID());
            result.setMessage("Successfully log in!");
            result.setStatus(true);
            user.setIs_login(true);
    
            // Tạo JWT token sau khi đăng nhập thành công
            String token = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getMail())); 
    
            // Thêm token vào kết quả trả về
            result.setToken(token);  // Trả token về trong response
    
            // Lưu lại trạng thái login của user
            userRepository.save(user);  // Cập nhật trạng thái is_login trong database
        } else {
            result.setMessage("Wrong password!");
            result.setStatus(false);
        }
    
        return result;
    }
    
    // update infor
    public boolean updateUserDetails(int userId, MoreRegisterDTO moreRegisterDTO) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setFull_name(moreRegisterDTO.getFull_name());
            user.setAddress(moreRegisterDTO.getAddress());
            userRepository.save(user);
            return true;
        }
        return false;
        }
        public User updateUserInfo(Integer userId, MoreRegisterDTO moreRegisterDTO) {
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                user.setFull_name(moreRegisterDTO.getFull_name());
                user.setAddress(moreRegisterDTO.getAddress());
                return userRepository.save(user);
            } else {
                throw new RuntimeException("User not found!");
            }
        }

    // update balance
        public User updateBalance(int userId, double money) {
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                user.setBalance(user.getBalance() + money/10000);
                return userRepository.save(user);
            } else {
                throw new RuntimeException("User not found!");
            }
        }

    // log out
    public boolean logOut(int userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setIs_login(false);
            userRepository.save(user);
            return true;
        }
        return false;
    }


    // create review
    @Transactional
    public boolean review(int userId, int bookId, Map<String, String> body) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            return false;
        }
        
        Optional<Book> optionalBook = bookRepository.findById(bookId);
        if (optionalBook.isEmpty()) {
            return false;
        }
    
        int rating = Integer.parseInt(body.get("rating"));
        
        Review review = new Review();
        review.setRating(rating);
        review.setUser(optionalUser.get());
        review.setBook(optionalBook.get());
        review.setComment(body.get("comment"));
        review.setCreatedAt(LocalDateTime.now());
        reviewRepository.save(review);
        
        return true;
    }

    // get reviews
        public List<ReviewDTO> getAllReviews(int bookId) {
            List<ReviewDTO> reviewDTOs = reviewRepository.findReviewsByBookId(bookId);
            return reviewDTOs;
        }
    
}