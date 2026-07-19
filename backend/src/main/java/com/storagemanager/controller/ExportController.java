package com.storagemanager.controller;

import com.storagemanager.dto.ExportRequest;
import com.storagemanager.entity.ExportReceipt;
import com.storagemanager.service.ExportReceiptService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exports")
@CrossOrigin("*")
public class ExportController {

    private final ExportReceiptService service;

    public ExportController(ExportReceiptService service) {
        this.service = service;
    }

    @GetMapping
    public List<ExportReceipt> getAll() {
        return service.getAll();
    }

    @PostMapping
    public ExportReceipt create(@RequestBody ExportRequest request) {
        return service.saveExport(request);
    }

}