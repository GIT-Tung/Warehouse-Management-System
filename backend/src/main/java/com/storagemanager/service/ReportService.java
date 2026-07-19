package com.storagemanager.service;

import com.storagemanager.dto.InventoryReportDTO;
import com.storagemanager.dto.TransactionReportDTO;
import com.storagemanager.entity.ExportDetail;
import com.storagemanager.entity.ImportDetail;
import com.storagemanager.entity.Product;
import com.storagemanager.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportService {

    private final ProductRepository productRepository;
    private final ImportReceiptRepository importReceiptRepository;
    private final ImportDetailRepository importDetailRepository;
    private final ExportReceiptRepository exportReceiptRepository;
    private final ExportDetailRepository exportDetailRepository;

    public ReportService(ProductRepository productRepository,
                         ImportReceiptRepository importReceiptRepository,
                         ImportDetailRepository importDetailRepository,
                         ExportReceiptRepository exportReceiptRepository,
                         ExportDetailRepository exportDetailRepository) {
        this.productRepository = productRepository;
        this.importReceiptRepository = importReceiptRepository;
        this.importDetailRepository = importDetailRepository;
        this.exportReceiptRepository = exportReceiptRepository;
        this.exportDetailRepository = exportDetailRepository;
    }

    public InventoryReportDTO getInventoryReport() {
        List<Product> products = productRepository.findAll();
        long totalTypes = products.size();
        long totalQty = 0;
        BigDecimal totalImportVal = BigDecimal.ZERO;
        BigDecimal totalExportVal = BigDecimal.ZERO;

        for (Product p : products) {
            long qty = p.getQuantity() != null ? p.getQuantity() : 0;
            totalQty += qty;
            
            BigDecimal qtyBD = BigDecimal.valueOf(qty);
            if (p.getImportPrice() != null) {
                totalImportVal = totalImportVal.add(p.getImportPrice().multiply(qtyBD));
            }
            if (p.getExportPrice() != null) {
                totalExportVal = totalExportVal.add(p.getExportPrice().multiply(qtyBD));
            }
        }

        return new InventoryReportDTO(totalTypes, totalQty, totalImportVal, totalExportVal);
    }

    public TransactionReportDTO getImportReport(LocalDateTime start, LocalDateTime end) {
        long receiptsCount = importReceiptRepository.countByImportDateBetween(start, end);
        List<ImportDetail> details = importDetailRepository.findByReceiptImportDateBetween(start, end);

        long totalItems = 0;
        BigDecimal totalValue = BigDecimal.ZERO;

        for (ImportDetail d : details) {
            long qty = d.getQuantity() != null ? d.getQuantity() : 0;
            totalItems += qty;

            if (d.getPrice() != null) {
                totalValue = totalValue.add(d.getPrice().multiply(BigDecimal.valueOf(qty)));
            }
        }

        return new TransactionReportDTO(receiptsCount, totalItems, totalValue);
    }

    public TransactionReportDTO getExportReport(LocalDateTime start, LocalDateTime end) {
        long receiptsCount = exportReceiptRepository.countByExportDateBetween(start, end);
        List<ExportDetail> details = exportDetailRepository.findByReceiptExportDateBetween(start, end);

        long totalItems = 0;
        BigDecimal totalValue = BigDecimal.ZERO;

        for (ExportDetail d : details) {
            long qty = d.getQuantity() != null ? d.getQuantity() : 0;
            totalItems += qty;

            if (d.getPrice() != null) {
                totalValue = totalValue.add(d.getPrice().multiply(BigDecimal.valueOf(qty)));
            }
        }

        return new TransactionReportDTO(receiptsCount, totalItems, totalValue);
    }
}
