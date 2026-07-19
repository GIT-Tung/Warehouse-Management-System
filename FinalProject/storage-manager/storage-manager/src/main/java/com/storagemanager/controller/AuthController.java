package com.storagemanager.controller;

import com.storagemanager.dto.LoginRequest;
import com.storagemanager.dto.LoginResponse;
import com.storagemanager.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {


    private final AuthService service;


    public AuthController(AuthService service) {
        this.service = service;
    }



    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request
    ){

        return service.login(request);

    }

}