package com.example.test.controller.CoreController;

import com.example.test.DTO.Login_logout_register.Request.MoreRegisterDTO;
import com.example.test.DTO.Login_logout_register.Request.logInDTO;
import com.example.test.DTO.Login_logout_register.Request.registerDTO;
import com.example.test.DTO.Login_logout_register.Respose.ResponseLogInDTO;
import com.example.test.DTO.Login_logout_register.Respose.registerResponseDTO;
import com.example.test.DTO.ReviewDTO.Response.ReviewDTO;
import com.example.test.Entity.Review;
import com.example.test.Entity.User;
import com.example.test.Entity.pendingUser;
import com.example.test.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;



@RestController
@RequestMapping("/api/users")
public class userController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

//    {
//         "name" : "linh",
//         "phone": "12091212",
//          "mail": "121341@gmail.com",
//          "password" : "12345"
//    }
    @PostMapping("/register")
    public boolean register(@RequestBody registerDTO user)
    {
        if (!userService.isExistUser(user)){
            return true;
        }
        return false;
    }

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

    // {
    //     "phone":"12091112212",
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
    @GetMapping("/logout/{userId}")
    public boolean logout(@PathVariable Integer userId) {
        return userService.logOut(userId);
    }

    //Review
    // http://localhost:8090/api/users/review/2/1
    // {
    //     "rating": "5",
    //     "comment": "I like this book"
    //   }
      
    @PostMapping("/review/{userId}/{bookId}")
    public boolean review(@PathVariable Integer userId, @PathVariable Integer bookId, @RequestBody Map<String, String> body) {
        return userService.review(userId, bookId, body);
    }

    //Get all review of a book
    // http://localhost:8090/api/users/review/2
    @GetMapping("/review/{bookId}")
    public List<ReviewDTO> getAllReview(@PathVariable Integer bookId) {
        return userService.getAllReviews(bookId);
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
}