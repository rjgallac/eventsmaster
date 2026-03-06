package com.example.backend2.model;

import java.io.Serializable;

public class StatusMessage implements Serializable{
    private static final long serialVersionUID = 1L;
    private String id;
    private String status;

    public StatusMessage() {
    }

    public StatusMessage(String id, String status) {
        this.id = id;
        this.status = status;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
