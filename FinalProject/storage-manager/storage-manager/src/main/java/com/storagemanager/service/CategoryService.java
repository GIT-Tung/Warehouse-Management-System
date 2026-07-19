package com.storagemanager.service;

import com.storagemanager.entity.Category;
import com.storagemanager.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public List<Category> getAll() {
        return repository.findAll();
    }

    public Category getById(Integer id) {
        Optional<Category> category = repository.findById(id);
        return category.orElse(null);
    }

    public Category save(Category category) {
        return repository.save(category);
    }

    public Category update(Category category) {
        return repository.save(category);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

}