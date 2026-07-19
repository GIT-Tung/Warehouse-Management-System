package com.storagemanager.dto;

import java.math.BigDecimal;

public class TransactionReportDTO {

    private long totalReceipts;
    private long totalItems;
    private BigDecimal totalValue;

    public TransactionReportDTO() {
    }

    public TransactionReportDTO(long totalReceipts, long totalItems, BigDecimal totalValue) {
        this.totalReceipts = totalReceipts;
        this.totalItems = totalItems;
        this.totalValue = totalValue;
    }

    public long getTotalReceipts() {
        return totalReceipts;
    }

    public void setTotalReceipts(long totalReceipts) {
        this.totalReceipts = totalReceipts;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(long totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue;
    }
}
