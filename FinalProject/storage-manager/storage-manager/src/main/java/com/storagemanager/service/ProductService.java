package com.storagemanager.service;

import com.storagemanager.entity.Product;
import com.storagemanager.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getAll() {
        return repository.findAll();
    }

    public Product getById(Integer id) {
        Optional<Product> product = repository.findById(id);
        return product.orElse(null);
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public Product update(Product product) {
        return repository.save(product);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public List<Product> search(String keyword) {
        return repository.findByProductNameContainingOrProductCodeContaining(keyword, keyword);
    }

    public List<Product> getLowStockProducts(Integer threshold) {
        return repository.findByQuantityLessThanEqual(threshold);
    }
}   