package com.storagemanager.dto;

import java.math.BigDecimal;

public class InventoryReportDTO {

    private long totalProductTypes;
    private long totalQuantity;
    private BigDecimal totalImportValue;
    private BigDecimal totalExportValue;

    public InventoryReportDTO() {
    }

    public InventoryReportDTO(long totalProductTypes, long totalQuantity, BigDecimal totalImportValue, BigDecimal totalExportValue) {
        this.totalProductTypes = totalProductTypes;
        this.totalQuantity = totalQuantity;
        this.totalImportValue = totalImportValue;
        this.totalExportValue = totalExportValue;
    }

    public long getTotalProductTypes() {
        return totalProductTypes;
    }

    public void setTotalProductTypes(long totalProductTypes) {
        this.totalProductTypes = totalProductTypes;
    }

    public long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public BigDecimal getTotalImportValue() {
        return totalImportValue;
    }

    public void setTotalImportValue(BigDecimal totalImportValue) {
        this.totalImportValue = totalImportValue;
    }

    public BigDecimal getTotalExportValue() {
        return totalExportValue;
    }

    public void setTotalExportValue(BigDecimal totalExportValue) {
        this.totalExportValue = totalExportValue;
    }
}
