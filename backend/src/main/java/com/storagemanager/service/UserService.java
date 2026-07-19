package com.storagemanager.service;

import com.storagemanager.entity.User;
import com.storagemanager.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public User getById(Integer id) {
        Optional<User> user = repository.findById(id);
        return user.orElse(null);
    }

    public User save(User user) {
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return repository.save(user);
    }

    public User update(User user) {
        Optional<User> existingUserOpt = repository.findById(user.getUserID());
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            // Nếu mật khẩu mới trống hoặc giống với mật khẩu cũ (đã mã hóa) thì giữ nguyên mật khẩu cũ
            if (user.getPassword() == null || user.getPassword().isEmpty() || user.getPassword().equals(existingUser.getPassword())) {
                user.setPassword(existingUser.getPassword());
            } else {
                // Chỉ mã hóa nếu mật khẩu mới không phải là chuỗi đã mã hóa BCrypt
                if (!user.getPassword().startsWith("$2a$") && user.getPassword().length() != 60) {
                    user.setPassword(passwordEncoder.encode(user.getPassword()));
                }
            }
        } else {
            if (user.getPassword() != null && !user.getPassword().isEmpty() && !user.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
        }
        return repository.save(user);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public User login(String username) {
        return repository.findByUsername(username).orElse(null);
    }

}