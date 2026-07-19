package com.storagemanager.dto;

import java.util.List;

public class ExportRequest {

    private Integer userID;

    private String note;

    private List<ReceiptItemDTO> items;

    public ExportRequest() {
    }

    public Integer getUserID() {
        return userID;
    }

    public void setUserID(Integer userID) {
        this.userID = userID;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public List<ReceiptItemDTO> getItems() {
        return items;
    }

    public void setItems(List<ReceiptItemDTO> items) {
        this.items = items;
    }

}