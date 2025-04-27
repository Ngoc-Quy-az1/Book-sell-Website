package com.example.test.controller.CoreController;

import com.example.test.DTO.DiscountCodeDTO.UserDiscountCodeDTO;
import com.example.test.DTO.Login_logout_register.Request.LogOutDTO;
import com.example.test.DTO.Login_logout_register.Request.MoreRegisterDTO;
import com.example.test.DTO.Login_logout_register.Request.logInDTO;
import com.example.test.DTO.Login_logout_register.Request.registerDTO;
import com.example.test.DTO.Login_logout_register.Respose.ResponseLogInDTO;
import com.example.test.DTO.Login_logout_register.Respose.registerResponseDTO;
import com.example.test.DTO.ReviewDTO.Response.ReviewDTO;
import com.example.test.Entity.User;
import com.example.test.Entity.pendingUser;
import com.example.test.Service.JwtService;
import com.example.test.Service.MailService;
import com.example.test.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
public class userController {


    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Autowired
    private MailService mailService;



// http://localhost:8090/api/users/register
//    {
//         "name" : "linh",
//         "phone": "12091212",
//          "mail": "121341@gmail.com",
//          "password" : "12345",
//          "full_name": "Ngocquy",
//          "address" : "Hai Ba Trung"
//    }
    @PostMapping("/register")
    public boolean register(@RequestBody registerDTO user)
    {
        if (!userService.isExistUser(user)){
            return true;
        }
        return false;
    }


//  http://localhost:8090/api/users/verify?mail=quy160104@gmail.com
//    {
//        "code" : "123123"
//    }
    @PostMapping("/verify")
    public registerResponseDTO verify(@RequestParam(name = "mail") String mail,
                                      @RequestBody Map<String, String> body)
    {
        String code = body.get("code");
        return userService.verify(mail, code);
    }

    //      localhost:8090/api/users/login
    // {
    //     "mail": "Phamthuy20102006@gmail.com",
    //     "password": "12345"
    // }
    // hoặc
    // {
    //     "phone":"0987654321",
    //     "password":"12345"
    // }
    @PostMapping("/login")
    public ResponseLogInDTO login(@RequestBody logInDTO infor)
    {
        return userService.logIn(infor);
    }

    //Bổ sung thông tin về người dùng sau khi đã đăng kí thành công 
    // {
    //     "full_name": "Nguyen Van A",
    //     "address": "123 Nguyen Trai, Ha Noi"
    // }
    
    @PutMapping("/update/{userId}")
    public User updateUser(@PathVariable Integer userId, @RequestBody MoreRegisterDTO moreRegisterDTO) {

        return userService.updateUserInfo(userId, moreRegisterDTO);
    }

    //Quy đổi số tiền người dùng nạp về xu cho tài khoản người dùng(10000vnd = 1 xu)

    // http://localhost:8090/api/users/update/balance/6?money=1000000
    @PostMapping("/update/balance/{userId}")
    public User updateBalance(@PathVariable Integer userId, @RequestParam double money) {
        return userService.updateBalance(userId, money);
    }

    //logout
    // http://localhost:8090/api/users/logout/6

// {
// "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJxdXkxNjAxMDQxQGdtYWlsLmNvbSIsImlhdCI6MTY5MjA2NTY0MCwiZXhwIjoxNjkyMDY5MjQwfQ.4v3a7bq8gk1j4f3c1e7d8f8e8f8e8f8e8f8e8f8e8f8e"
// }

    @PostMapping("/logout/{userId}")
    public boolean logout(@PathVariable Integer userId, @RequestBody LogOutDTO logOutDTO) {
        String token = logOutDTO.getToken();
        return userService.logOut(userId, token);
    }

    //Quên mật khẩu
    // http://localhost:8090/api/users/forgotpassword
    // {
    //     "infor":"quy160104@gmail.com",
    //     "password": "123456"
    // }

    @PostMapping("/forgotpassword")
    public String forgetPass(@RequestBody Map<String, String> body) {
        String password = body.get("password");
        String infor = body.get("infor");
        if(userService.forgetPass(infor, password)){
            return "ok";
        }else{
            return "Không tìm thấy tài khoản nào với email này";
        }
    }
    //Xác nhận code để đổi mật khẩu
    // http://localhost:8090/api/users/confirmcode
    // {
    //      "infor": "quy160104@gmail.com"
    //      "password": "123456",
    //     "code": "123456"
    // }

    @PostMapping("/confirmcode")
    public String confirmCode(@RequestBody Map<String, String> body) {
        String infor = body.get("infor");
        String password = body.get("password");
        String code = body.get("code");
        if(userService.confirmCode(infor,password,code)){
            return "ok";
        }else{
            return "Mã xác nhận không đúng";
        }
    }

    //Get all review of a book
    // http://localhost:8090/api/users/review/2
    @GetMapping("/review/{bookId}")
    public List<ReviewDTO> getAllReview(@PathVariable Integer bookId) {
        return userService.getAllReviews(bookId);
    }

    //Add review for a book
    // http://localhost:8090/api/users/review/2/1
    // {
    //     "rating": "5",
    //     "comment": "I like this book"
    //   }
      
    @PostMapping("/review/{userId}/{bookId}")
    public boolean review(@PathVariable Integer userId, @PathVariable Integer bookId, @RequestBody Map<String, String> body) {
        return userService.review(userId, bookId, body);
    }

    /**
     * API lấy danh sách mã giảm giá của người dùng
     * Method: GET
     * URL: http://localhost:8090/api/users/{userId}/discount-codes
     * Headers:
     *   Authorization: Bearer {your_jwt_token}
     * Response (200 OK):
     * [
     *   {
     *     "code": "OFFC5Y2R",
     *     "discountPercentage": 30.00,
     *     "expirationDate": "2025-12-31",
     *     "numberCode": 123456789
     *   },
     *   ...
     * ]
     * Error Response (403 Forbidden): Nếu người dùng không có quyền xem
     * Error Response (404 Not Found): Nếu userId không tồn tại
     */
    @GetMapping("/{userId}/discount-codes")
    // Chỉ chủ sở hữu tài khoản hoặc admin mới có quyền truy cập
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<List<UserDiscountCodeDTO>> getUserDiscountCodes(@PathVariable Integer userId) {
        try {
            List<UserDiscountCodeDTO> discountCodes = userService.getUserDiscountCodes(userId);
            return ResponseEntity.ok(discountCodes);
        } catch (RuntimeException e) {
            // Xử lý lỗi không tìm thấy user
            if (e.getMessage().contains("User not found")) {
                return ResponseEntity.notFound().build();
            }
            // Các lỗi khác
            return ResponseEntity.badRequest().body(null); // Hoặc trả về lỗi cụ thể hơn
        }
    }

    //thêm api trả về các trường cần thiết của trang user-detail như full_name, username, email, address, phone, balance, points, membership_level
    // http://localhost:8090/api/users/user-detail/{userId}

    @GetMapping("/user-detail/{userId}")
    public ResponseEntity<User> getUserDetail(@PathVariable Integer userId) {
        User user = userService.getUserDetails(userId);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
