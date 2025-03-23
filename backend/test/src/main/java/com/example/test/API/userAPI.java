package com.example.test.API;

import com.example.test.DTO.ResponseLogInDTO;
import com.example.test.DTO.logInDTO;
import com.example.test.DTO.registerDTO;
import com.example.test.DTO.registerResponseDTO;
import com.example.test.Entity.User;
import com.example.test.Entity.pendingUser;
import com.example.test.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class userAPI {

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

}
