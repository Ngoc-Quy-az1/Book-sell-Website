package com.example.test.controller;

import com.example.test.DTO.MoreRegisterDTO;
import com.example.test.DTO.ResponseLogInDTO;
import com.example.test.DTO.logInDTO;
import com.example.test.DTO.registerDTO;
import com.example.test.DTO.registerResponseDTO;
import com.example.test.Entity.User;
import com.example.test.Entity.pendingUser;
import com.example.test.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;



@RestController
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

    @GetMapping("/login")
    public ResponseLogInDTO login(@RequestBody logInDTO infor)
    {
        return userService.logIn(infor);
    }

    @PutMapping("/moreRegister/{userId}")
    public ResponseEntity<String> moreRegister(@PathVariable int userId, @RequestBody MoreRegisterDTO moreRegisterDTO) {
        boolean updated = userService.updateUserDetails(userId, moreRegisterDTO);
        if (updated) {
            return ResponseEntity.ok("Cập nhật thành công");
        }
        return ResponseEntity.badRequest().body("Không tìm thấy người dùng");
    }

    // @GetMapping("/logout")
    // public String logout(@RequestParam boolean Islogout) {
    //     return userService.logout(Islogout);
    // }
    

}
