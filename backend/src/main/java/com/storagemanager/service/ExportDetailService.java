package com.storagemanager.service;

import com.storagemanager.entity.ExportDetail;
import com.storagemanager.repository.ExportDetailRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExportDetailService {

    private final ExportDetailRepository repository;

    public ExportDetailService(ExportDetailRepository repository) {
        this.repository = repository;
    }

    public List<ExportDetail> getAll() {
        return repository.findAll();
    }

    public ExportDetail save(ExportDetail detail) {
        return repository.save(detail);
    }

}