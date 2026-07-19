package com.storagemanager.repository;

import com.storagemanager.entity.ImportDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ImportDetailRepository extends JpaRepository<ImportDetail, Integer> {

    List<ImportDetail> findByReceiptImportDateBetween(LocalDateTime start, LocalDateTime end);

}