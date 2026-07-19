package com.storagemanager.service;

import com.storagemanager.dto.ExportRequest;
import com.storagemanager.dto.ReceiptItemDTO;
import com.storagemanager.entity.ExportDetail;
import com.storagemanager.entity.Product;
import com.storagemanager.entity.User;
import com.storagemanager.repository.ExportDetailRepository;
import com.storagemanager.repository.ProductRepository;
import com.storagemanager.repository.UserRepository;
import com.storagemanager.entity.ExportReceipt;
import com.storagemanager.repository.ExportReceiptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExportReceiptService {

    private final ExportReceiptRepository repository;
    private final ExportDetailRepository detailRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public ExportReceiptService(ExportReceiptRepository repository,
                                ExportDetailRepository detailRepository,
                                UserRepository userRepository,
                                ProductRepository productRepository) {
        this.repository = repository;
        this.detailRepository = detailRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public List<ExportReceipt> getAll() {
        return repository.findAll();
    }

    @Transactional
    public ExportReceipt saveExport(ExportRequest request) {
        User user = userRepository.findById(request.getUserID())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ExportReceipt receipt = new ExportReceipt();
        receipt.setUser(user);
        receipt.setNote(request.getNote());
        receipt.setExportDate(LocalDateTime.now());

        ExportReceipt savedReceipt = repository.save(receipt);

        if (request.getItems() != null) {
            for (ReceiptItemDTO item : request.getItems()) {
                Product product = productRepository.findById(item.getProductID())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductID()));

                ExportDetail detail = new ExportDetail();
                detail.setReceipt(savedReceipt);
                detail.setProduct(product);
                detail.setQuantity(item.getQuantity());
                detail.setPrice(item.getPrice());

                detailRepository.save(detail);
            }
        }

        return savedReceipt;
    }
}