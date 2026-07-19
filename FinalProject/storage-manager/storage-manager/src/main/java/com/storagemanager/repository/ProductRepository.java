package com.storagemanager.repository;

import com.storagemanager.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByProductNameContainingOrProductCodeContaining(String productName, String productCode);

    List<Product> findByQuantityLessThanEqual(Integer threshold);

}