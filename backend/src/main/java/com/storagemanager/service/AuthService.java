package com.storagemanager.service;

import com.storagemanager.dto.LoginRequest;
import com.storagemanager.dto.LoginResponse;
import com.storagemanager.entity.User;
import com.storagemanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import com.storagemanager.security.JwtTokenProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElse(null);

        if (user == null) {
            return null;
        }

        // So sánh mật khẩu bằng BCryptPasswordEncoder
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return null;
        }

        LoginResponse response = new LoginResponse();
        response.setUserID(user.getUserID());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());

        String roleName = "STAFF";
        if (user.getRole() != null) {
            roleName = user.getRole().getRoleName();
            response.setRole(roleName);
        }

        // Tạo JWT Token
        String token = tokenProvider.generateToken(user.getUsername(), roleName);
        response.setToken(token);

        return response;
    }
}