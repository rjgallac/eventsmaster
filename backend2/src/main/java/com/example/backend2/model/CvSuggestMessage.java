package com.example.backend2.model;

public class CvSuggestMessage implements java.io.Serializable {
    private static final long serialVersionUID = 1L;
    private Long cvId;
    private String cvContent;


    public CvSuggestMessage() {
    }

    public CvSuggestMessage(String cvContent, Long cvId) {
        this.cvContent = cvContent;
        this.cvId = cvId;
    }

    public Long getCvId() {
        return cvId;
    }

    public void setCvId(Long cvId) {
        this.cvId = cvId;
    }

    public String getCvContent() {
        return cvContent;
    }
    
    public void setCvContent(String cvContent) {
        this.cvContent = cvContent;
    }

}
