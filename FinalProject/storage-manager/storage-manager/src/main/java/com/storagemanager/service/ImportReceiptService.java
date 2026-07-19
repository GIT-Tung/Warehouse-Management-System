package com.storagemanager.service;

import com.storagemanager.dto.ImportRequest;
import com.storagemanager.dto.ReceiptItemDTO;
import com.storagemanager.entity.ImportDetail;
import com.storagemanager.entity.Product;
import com.storagemanager.entity.Supplier;
import com.storagemanager.entity.User;
import com.storagemanager.repository.ImportDetailRepository;
import com.storagemanager.repository.ProductRepository;
import com.storagemanager.repository.SupplierRepository;
import com.storagemanager.repository.UserRepository;
import com.storagemanager.entity.ImportReceipt;
import com.storagemanager.repository.ImportReceiptRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ImportReceiptService {

    private final ImportReceiptRepository repository;
    private final ImportDetailRepository detailRepository;
    private final UserRepository userRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;

    public ImportReceiptService(ImportReceiptRepository repository,
                                ImportDetailRepository detailRepository,
                                UserRepository userRepository,
                                SupplierRepository supplierRepository,
                                ProductRepository productRepository) {
        this.repository = repository;
        this.detailRepository = detailRepository;
        this.userRepository = userRepository;
        this.supplierRepository = supplierRepository;
        this.productRepository = productRepository;
    }

    public List<ImportReceipt> getAll() {
        return repository.findAll();
    }

    @Transactional
    public ImportReceipt saveImport(ImportRequest request) {
        User user = userRepository.findById(request.getUserID())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Supplier supplier = supplierRepository.findById(request.getSupplierID())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        ImportReceipt receipt = new ImportReceipt();
        receipt.setUser(user);
        receipt.setSupplier(supplier);
        receipt.setNote(request.getNote());
        receipt.setImportDate(LocalDateTime.now());
        
        ImportReceipt savedReceipt = repository.save(receipt);

        if (request.getItems() != null) {
            for (ReceiptItemDTO item : request.getItems()) {
                Product product = productRepository.findById(item.getProductID())
                        .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductID()));

                ImportDetail detail = new ImportDetail();
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