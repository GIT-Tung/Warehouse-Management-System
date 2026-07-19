package com.storagemanager.service;

import com.storagemanager.entity.ImportDetail;
import com.storagemanager.repository.ImportDetailRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImportDetailService {

    private final ImportDetailRepository repository;

    public ImportDetailService(ImportDetailRepository repository) {
        this.repository = repository;
    }

    public List<ImportDetail> getAll() {
        return repository.findAll();
    }

    public ImportDetail save(ImportDetail detail) {
        return repository.save(detail);
    }

}