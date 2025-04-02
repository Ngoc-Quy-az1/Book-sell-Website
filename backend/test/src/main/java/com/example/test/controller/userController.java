package com.example.test.controller;

import com.example.test.DTO.Login_logout_register.MoreRegisterDTO;
import com.example.test.DTO.Login_logout_register.ResponseLogInDTO;
import com.example.test.DTO.Login_logout_register.logInDTO;
import com.example.test.DTO.Login_logout_register.registerDTO;
import com.example.test.DTO.Login_logout_register.registerResponseDTO;
import com.example.test.Entity.User;
import com.example.test.Entity.pendingUser;
import com.example.test.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;



@RestController
@RequestMapping("/api/users")
public class userController {

    @Autowired
    private UserService userService;

//    {
//         "name" : "linh",
//         "phone": "12091212",
//          "mail": "121341@gmail.com",
//          "password" : "12345"
//    }
    @GetMapping("/register")
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
    @GetMapping("/login")
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
    
}
