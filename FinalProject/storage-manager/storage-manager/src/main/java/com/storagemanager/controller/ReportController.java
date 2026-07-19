package com.storagemanager.controller;

import com.storagemanager.dto.InventoryReportDTO;
import com.storagemanager.dto.TransactionReportDTO;
import com.storagemanager.service.ReportService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/inventory")
    public InventoryReportDTO getInventoryReport() {
        return reportService.getInventoryReport();
    }

    @GetMapping("/imports")
    public TransactionReportDTO getImportReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        if (startDate == null) {
            startDate = LocalDateTime.of(1970, 1, 1, 0, 0);
        }
        if (endDate == null) {
            endDate = LocalDateTime.of(2099, 12, 31, 23, 59);
        }
        
        return reportService.getImportReport(startDate, endDate);
    }

    @GetMapping("/exports")
    public TransactionReportDTO getExportReport(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        if (startDate == null) {
            startDate = LocalDateTime.of(1970, 1, 1, 0, 0);
        }
        if (endDate == null) {
            endDate = LocalDateTime.of(2099, 12, 31, 23, 59);
        }
        
        return reportService.getExportReport(startDate, endDate);
    }
}
