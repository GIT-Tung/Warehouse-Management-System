package com.storagemanager.service;

import com.storagemanager.entity.Supplier;
import com.storagemanager.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SupplierService {

    private final SupplierRepository repository;

    public SupplierService(SupplierRepository repository) {
        this.repository = repository;
    }

    public List<Supplier> getAll() {
        return repository.findAll();
    }

    public Supplier getById(Integer id) {
        Optional<Supplier> supplier = repository.findById(id);
        return supplier.orElse(null);
    }

    public Supplier save(Supplier supplier) {
        return repository.save(supplier);
    }

    public Supplier update(Supplier supplier) {
        return repository.save(supplier);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

}