package com.storagemanager.controller;

import com.storagemanager.dto.ImportRequest;
import com.storagemanager.entity.ImportReceipt;
import com.storagemanager.service.ImportReceiptService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/imports")
@CrossOrigin("*")
public class ImportController {

    private final ImportReceiptService service;

    public ImportController(ImportReceiptService service) {
        this.service = service;
    }

    @GetMapping
    public List<ImportReceipt> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ImportReceipt create(@RequestBody ImportRequest request) {
        return service.saveImport(request);
    }

}