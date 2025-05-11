package com.example.test.Service;

import com.example.test.DTO.DiscountCodeDTO.UserDiscountCodeDTO;
import com.example.test.DTO.Login_logout_register.Request.MoreRegisterDTO;
import com.example.test.DTO.Login_logout_register.Request.logInDTO;
import com.example.test.DTO.Login_logout_register.Request.registerDTO;
import com.example.test.DTO.Login_logout_register.Respose.ResponseLogInDTO;
import com.example.test.DTO.Login_logout_register.Respose.registerResponseDTO;
import com.example.test.DTO.ReviewDTO.Response.ReviewDTO;
import com.example.test.Entity.Book;
import com.example.test.Entity.DeletedToken;
import com.example.test.Entity.Notification;
import com.example.test.Entity.Review;
import com.example.test.Entity.User;
import com.example.test.Entity.pendingUser;
import com.example.test.Entity.DiscountCode;
import com.example.test.Entity.DiscountCodesNumberCode;
import com.example.test.Repository.UserRepo.NotificationRepository;
import com.example.test.Repository.UserRepo.UserPendingRepository;
import com.example.test.Repository.UserRepo.UserRepository;
import com.example.test.Repository.UserRepo.reviewRepository;
import com.example.test.Repository.BookRepo.BookRepository;
import com.example.test.Repository.Discount.DiscountCodeRepository;
import com.example.test.Repository.Discount.DiscountCodesNumberCodeRepository;
import com.example.test.Repository.Token.DeletedTokenRepository;
import com.example.test.Repository.Token.RefreshTokenRepository;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.redis.RedisProperties.Lettuce.Cluster.Refresh;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.logging.Logger;

@Service
@Transactional
public class UserService {

    private static final Logger logger = Logger.getLogger(UserService.class.getName());

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

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private DiscountCodeRepository discountCodeRepository;

    @Autowired
    private DiscountCodesNumberCodeRepository discountCodesNumberCodeRepository;

    @Autowired
    private DeletedTokenRepository deletedTokenRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PaymentService paymentService;

    private final Map<String, String> resetCodeMap = new java.util.concurrent.ConcurrentHashMap<>();

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
    public boolean isExistUser(registerDTO user) {
        // nếu không tồn tại thì lưu vào bảng phụ và trả về false
        if (userPendingRepository.findUserByMail(user.getMail()) == null
                && userPendingRepository.findUserByPhone(user.getPhone()) == null) {
            pendingUser newUser = new pendingUser();
            newUser.setMail(user.getMail());
            newUser.setName(user.getName());
            newUser.setPhone(user.getPhone());
            newUser.setPassword(passwordEncoder.encode(user.getPassword()));
            newUser.setFull_name(user.getFull_name());
            newUser.setAddress(user.getAddress());
            String code = generateRandomNumber();
            newUser.setCode(code);
            userPendingRepository.save(newUser);
            mailService.sendMail(user.getMail(), "Verify your email",
                    code + " is your code to register, please don't share with anyone else");
            return false;
        }
        // nếu tồn tại và chưa kích hoạt thì trả về true
        // if((userPendingRepository.findUserByMail(user.getMail()) != null ||
        // userPendingRepository.findUserByPhone(user.getPhone()) != null) &&
        // !user.isStatus())
        // {
        // entityManager.merge(user.getID());
        // return true;
        // }
        return true;
    }

    // verify
    public registerResponseDTO verify(String mail, String code) {
        pendingUser pendingUser = userPendingRepository.findUserByMail(mail);
        registerResponseDTO result = new registerResponseDTO();
        if (pendingUser == null) {
            result.setStatus(false);
            result.setMessage("Email not found");
            return result;
        }
        if (!pendingUser.isStatus()) {
            if (code.equals(pendingUser.getCode())) {
                // Tạo user mới
                User newUser = new User();
                newUser.setPassword(pendingUser.getPassword());
                newUser.setMembershipLevel(User.MembershipLevel.Silver);
                newUser.setName(pendingUser.getName());
                newUser.setMail(pendingUser.getMail());
                newUser.setPhone(pendingUser.getPhone());
                newUser.setAddress(pendingUser.getAddress());
                newUser.setFull_name(pendingUser.getFull_name());
                userRepository.save(newUser);

                // Tặng mã giảm giá 30%
                try {
                    DiscountCode discount = discountCodeRepository.findByCode("OFFC5Y2R")
                            .orElseThrow(() -> new RuntimeException("Discount code OFFC5Y2R not found"));

                    DiscountCodesNumberCode userDiscount = new DiscountCodesNumberCode();
                    userDiscount.setCodeId(discount.getCodeId());
                    userDiscount.setUserId(newUser.getID());
                    // Tạo giá trị duy nhất cho number_code (ví dụ: timestamp)
                    userDiscount.setNumberCode(1);
                    userDiscount.setDiscountCode(discount); // Set relationship
                    userDiscount.setUser(newUser); // Set relationship
                    discountCodesNumberCodeRepository.save(userDiscount);

                    System.out.println("Successfully assigned discount code OFFC5Y2R to user: " + newUser.getID());
                } catch (Exception e) {
                    System.err.println("Error assigning discount code: " + e.getMessage());
                    // Log lỗi hoặc xử lý thêm nếu cần
                }

                // Cập nhật pending user
                pendingUser.setStatus(true);
                pendingUser.setCode(null);
                userPendingRepository.save(pendingUser);

                result.setMessage("Successfully register!");
                result.setStatus(true);
                return result;
            } else {
                result.setMessage("Wrong code!");
                result.setStatus(false);
                return result;
            }
        } else {
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
            String Acesstoken = jwtService.generateToken(userDetailsService.loadUserByUsername(user.getMail()));
            String Refreshtoken = jwtService
                    .generateRefreshToken(userDetailsService.loadUserByUsername(user.getMail()));
            // Thêm token vào kết quả trả về
            result.setRefreshToken(Refreshtoken); // Trả refresh token về trong response
            result.setToken(Acesstoken); // Trả token về trong response

            // Lưu lại trạng thái login của user
            userRepository.save(user); // Cập nhật trạng thái is_login trong database

            // Thêm thông báo cho người dùng
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage("Bạn đã đăng nhập vào ngày" + " " + new Date());
            notification.setCreatedAt(new Date());
            notification.setRead(false);
            notificationRepository.save(notification);

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
            user.setPhone(moreRegisterDTO.getPhone());
            return userRepository.save(user);
        } else {
            throw new RuntimeException("User not found!");
        }
    }

    // update balance
    @Transactional
    public Map<String, Object> updateBalance(int userId) {
        try {
            Optional<User> optionalUser = userRepository.findById(userId);
            if (!optionalUser.isPresent()) {
                return createResponse(false, "Không tìm thấy người dùng");
            }
            User user = optionalUser.get();

            Map<String, String> transactionDetails = paymentService.readRecentEmails();
            if (transactionDetails == null || !transactionDetails.containsKey("amount")) {
                return createResponse(false, "Không tìm thấy email chuyển khoản mới");
            }

            // ✅ So khớp số điện thoại trong email với số điện thoại người dùng
            String phoneInEmail = transactionDetails.get("phone");
            String userPhone = user.getPhone(); // Cần đảm bảo user có trường phoneNumber

            if (userPhone == null || !userPhone.equals(phoneInEmail)) {
                return createResponse(false, "Email không khớp với số điện thoại người dùng");
            }

            String amountStr = transactionDetails.get("amount");
            BigDecimal transactionAmount = new BigDecimal(amountStr);

            // Hằng số tỉ lệ
            final int VND_TO_XU_RATE = 1000;
            final int DISCOUNT_THRESHOLD_VND_1 = 100000;
            final int DISCOUNT_THRESHOLD_VND_2 = 200000;
            final int DISCOUNT_THRESHOLD_VND_5 = 500000;

            // Chuyển VND sang xu
            double xuAmount = transactionAmount.doubleValue() / VND_TO_XU_RATE;

            // Cập nhật số dư
            user.setBalance(user.getBalance() + xuAmount);
            userRepository.save(user);

            // Thông báo nạp xu
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage(
                    String.format("Bạn đã nạp thành công %.1f xu vào tài khoản lúc %s", xuAmount, new Date()));
            notification.setCreatedAt(new Date());
            notification.setRead(false);
            notificationRepository.save(notification);

            // Tặng mã giảm giá nếu đủ điều kiện
            if (transactionAmount.doubleValue() >= DISCOUNT_THRESHOLD_VND_5) {
                try {
                    DiscountCode discount = discountCodeRepository.findByCode("OFFC5Y2R")
                            .orElseThrow(() -> new RuntimeException("Discount code OFFC5Y2R not found"));

                    DiscountCodesNumberCode existingDiscount = discountCodesNumberCodeRepository
                            .findByUserIdAndDiscountCode_CodeId(user.getID(), discount.getCodeId());

                    if (existingDiscount != null) {
                        existingDiscount.setNumberCode(existingDiscount.getNumberCode() + 1);
                        discountCodesNumberCodeRepository.save(existingDiscount);
                    } else {
                        DiscountCodesNumberCode userDiscount = new DiscountCodesNumberCode();
                        userDiscount.setCodeId(discount.getCodeId());
                        userDiscount.setUserId(user.getID());
                        userDiscount.setNumberCode(1);
                        userDiscount.setDiscountCode(discount);
                        userDiscount.setUser(user);
                        discountCodesNumberCodeRepository.save(userDiscount);
                    }

                    Notification discountNotification = new Notification();
                    discountNotification.setUser(user);
                    discountNotification.setMessage(
                            String.format("Chúc mừng! Bạn đã nhận được mã giảm giá %d%% (%s) cho đơn hàng tiếp theo.",
                                    discount.getDiscountPercentage(), discount.getCode()));
                    discountNotification.setCreatedAt(new Date());
                    discountNotification.setRead(false);
                    notificationRepository.save(discountNotification);
                } catch (Exception e) {
                    logger.severe("Lỗi khi tặng mã giảm giá: " + e.getMessage());
                }
            } else if(transactionAmount.doubleValue() >= DISCOUNT_THRESHOLD_VND_2) {
                try {
                    DiscountCode discount = discountCodeRepository.findByCode("DEAL7TQK")
                            .orElseThrow(() -> new RuntimeException("Discount code OFFC5Y2R not found"));

                    DiscountCodesNumberCode existingDiscount = discountCodesNumberCodeRepository
                            .findByUserIdAndDiscountCode_CodeId(user.getID(), discount.getCodeId());

                    if (existingDiscount != null) {
                        existingDiscount.setNumberCode(existingDiscount.getNumberCode() + 1);
                        discountCodesNumberCodeRepository.save(existingDiscount);
                    } else {
                        DiscountCodesNumberCode userDiscount = new DiscountCodesNumberCode();
                        userDiscount.setCodeId(discount.getCodeId());
                        userDiscount.setUserId(user.getID());
                        userDiscount.setNumberCode(1);
                        userDiscount.setDiscountCode(discount);
                        userDiscount.setUser(user);
                        discountCodesNumberCodeRepository.save(userDiscount);
                    }

                    Notification discountNotification = new Notification();
                    discountNotification.setUser(user);
                    discountNotification.setMessage(
                            String.format("Chúc mừng! Bạn đã nhận được mã giảm giá %d%% (%s) cho đơn hàng tiếp theo.",
                                    discount.getDiscountPercentage(), discount.getCode()));
                    discountNotification.setCreatedAt(new Date());
                    discountNotification.setRead(false);
                    notificationRepository.save(discountNotification);
                } catch (Exception e) {
                    logger.severe("Lỗi khi tặng mã giảm giá: " + e.getMessage());
                }
            } else if(transactionAmount.doubleValue() >= DISCOUNT_THRESHOLD_VND_1) {
                try {
                    DiscountCode discount = discountCodeRepository.findByCode("SALE9X3G")
                            .orElseThrow(() -> new RuntimeException("Discount code OFFC5Y2R not found"));

                    DiscountCodesNumberCode existingDiscount = discountCodesNumberCodeRepository
                            .findByUserIdAndDiscountCode_CodeId(user.getID(), discount.getCodeId());

                    if (existingDiscount != null) {
                        existingDiscount.setNumberCode(existingDiscount.getNumberCode() + 1);
                        discountCodesNumberCodeRepository.save(existingDiscount);
                    } else {
                        DiscountCodesNumberCode userDiscount = new DiscountCodesNumberCode();
                        userDiscount.setCodeId(discount.getCodeId());
                        userDiscount.setUserId(user.getID());
                        userDiscount.setNumberCode(1);
                        userDiscount.setDiscountCode(discount);
                        userDiscount.setUser(user);
                        discountCodesNumberCodeRepository.save(userDiscount);
                    }

                    Notification discountNotification = new Notification();
                    discountNotification.setUser(user);
                    discountNotification.setMessage(
                            String.format("Chúc mừng! Bạn đã nhận được mã giảm giá %d%% (%s) cho đơn hàng tiếp theo.",
                                    discount.getDiscountPercentage(), discount.getCode()));
                    discountNotification.setCreatedAt(new Date());
                    discountNotification.setRead(false);
                    notificationRepository.save(discountNotification);
                } catch (Exception e) {
                    logger.severe("Lỗi khi tặng mã giảm giá: " + e.getMessage());
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Nạp xu thành công: " + xuAmount + " xu");
            result.put("newBalance", user.getBalance());
            result.put("transactionAmount", transactionAmount);
            return result;

        } catch (Exception e) {
            logger.severe("Lỗi xử lý nạp xu: " + e.getMessage());
            return createResponse(false, "Lỗi xử lý nạp xu: " + e.getMessage());
        }
    }

    private Map<String, Object> createResponse(boolean success, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        return response;
    }

    // log out
    public boolean logOut(int userId, String token, String refreshToken) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setIs_login(false);
            userRepository.save(user);
            // Lưu token vào bảng deleted_tokens
            DeletedToken deletedToken = new DeletedToken(token);
            deletedTokenRepository.save(deletedToken);

            // Xóa refresh token trong bảng refresh_tokens
            // refreshTokenRepository.deleteByTokenAndUserId(refreshToken, userId);
            refreshTokenRepository.deleteByToken(refreshToken);
            return true;
        }
        return false;
    }

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

    // thêm api trả về các trường cần thiết của trang user-detail như full_name,
    // username, email, address, phone, balance, points, membership_level
    public User getUserDetails(int userId) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        } else {
            throw new RuntimeException("User not found!");
        }
    }

    public List<ReviewDTO> getAllReviews(int bookId) {
        List<ReviewDTO> reviewDTOs = reviewRepository.findReviewsByBookId(bookId);
        return reviewDTOs;
    }

    public User findUserByMail(String email) {
        return userRepository.findUserByMail(email);
    }

    // Quên mật khẩu
    public boolean forgetPass(String tmp, String password) {
        User optionalUser = null;

        if (tmp.contains("@")) {
            optionalUser = userRepository.findUserByMail(tmp);
        } else {
            optionalUser = userRepository.findUserByPhone(tmp);
        }

        if (optionalUser == null || optionalUser.getMail() == null) {
            return false;
        }

        String email = optionalUser.getMail();
        String code = generateRandomNumber();

        resetCodeMap.put(email, code); // lưu code với key là email

        mailService.sendMail(email, "Verify your email",
                code + " is your code to reset password. Do not share it with anyone.");

        return true;
    }

    // Xác nhận code để đổi mật khẩu
    public boolean confirmCode(String infor, String password, String code) {
        User optionalUser = null;

        if (infor.contains("@")) {
            optionalUser = userRepository.findUserByMail(infor);
        } else {
            optionalUser = userRepository.findUserByPhone(infor);
        }

        if (optionalUser == null || optionalUser.getMail() == null) {
            return false;
        }

        String email = optionalUser.getMail(); // dùng lại email làm key map
        String storedCode = resetCodeMap.get(email);

        if (storedCode != null && storedCode.equals(code)) {
            optionalUser.setPassword(passwordEncoder.encode(password));
            userRepository.save(optionalUser);
            resetCodeMap.remove(email);
            // thêm thông báo đã đổi mật khẩu thành công
            Notification notification = new Notification();
            notification.setUser(optionalUser);
            notification.setMessage("Đổi mật khẩu thành công! ");
            notification.setCreatedAt(new Date());
            notification.setRead(false);
            notificationRepository.save(notification);
            return true;
        }

        return false;
    }

    // Phương thức lấy danh sách mã giảm giá của người dùng
    public List<UserDiscountCodeDTO> getUserDiscountCodes(Integer userId) {
        // Kiểm tra người dùng tồn tại
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        List<DiscountCodesNumberCode> userDiscounts = discountCodesNumberCodeRepository.findByUserId(userId);

        return userDiscounts.stream()
                .map(userDiscount -> new UserDiscountCodeDTO(
                        userDiscount.getDiscountCode().getCode(),
                        userDiscount.getDiscountCode().getDiscountPercentage(),
                        userDiscount.getDiscountCode().getExpirationDate(),
                        userDiscount.getNumberCode()))
                .collect(Collectors.toList());
    }
}