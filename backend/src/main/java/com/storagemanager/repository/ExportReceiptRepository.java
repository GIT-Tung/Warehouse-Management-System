package com.storagemanager.repository;

import com.storagemanager.entity.ExportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ExportReceiptRepository extends JpaRepository<ExportReceipt, Integer> {

    long countByExportDateBetween(LocalDateTime start, LocalDateTime end);

}