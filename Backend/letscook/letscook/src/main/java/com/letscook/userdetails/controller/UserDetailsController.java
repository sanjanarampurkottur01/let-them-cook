package com.letscook.userdetails.controller;

import com.letscook.userdetails.model.UserInfo;
import com.letscook.userdetails.model.UserInput;
import com.letscook.userdetails.model.JwtResponse;
import com.letscook.userdetails.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserDetailsController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserInfo> register(@RequestBody UserInfo userDetails) throws Exception {
        return userService.register(userDetails);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody UserInput userInput) throws Exception {
        return userService.login(userInput);
    }

    @GetMapping("/hello")
    public String hello() {
        return "hello";
    }


}


