package com.storagemanager.repository;

import com.storagemanager.entity.ImportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ImportReceiptRepository extends JpaRepository<ImportReceipt, Integer> {

    long countByImportDateBetween(LocalDateTime start, LocalDateTime end);

}