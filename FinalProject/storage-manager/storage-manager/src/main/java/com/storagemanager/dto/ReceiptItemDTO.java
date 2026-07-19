package com.storagemanager.dto;

import java.math.BigDecimal;

public class ReceiptItemDTO {

    private Integer productID;
    private Integer quantity;
    private BigDecimal price;

    public ReceiptItemDTO() {
    }

    public Integer getProductID() {
        return productID;
    }

    public void setProductID(Integer productID) {
        this.productID = productID;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

}