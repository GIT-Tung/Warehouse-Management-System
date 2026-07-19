package com.storagemanager.repository;

import com.storagemanager.entity.ExportDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ExportDetailRepository extends JpaRepository<ExportDetail, Integer> {

    List<ExportDetail> findByReceiptExportDateBetween(LocalDateTime start, LocalDateTime end);

}