package com.storagemanager.service;

import com.storagemanager.entity.User;
import com.storagemanager.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public User getById(Integer id) {
        Optional<User> user = repository.findById(id);
        return user.orElse(null);
    }

    public User save(User user) {
        return repository.save(user);
    }

    public User update(User user) {
        return repository.save(user);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public User login(String username) {
        return repository.findByUsername(username).orElse(null);
    }

}