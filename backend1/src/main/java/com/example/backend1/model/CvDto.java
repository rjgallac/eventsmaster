package com.example.backend1.model;

public class CvDto {
    private Long id;
    private String name;
    private String curriculum_vitae_content;
    private String curriculum_vitae_content_suggestions;
    private String status;

    // Getters and setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getCurriculum_vitae_content() {
        return curriculum_vitae_content;
    }
    public void setCurriculum_vitae_content(String curriculum_vitae_content) {
        this.curriculum_vitae_content = curriculum_vitae_content;
    }
    public String getCurriculum_vitae_content_suggestions() {
        return curriculum_vitae_content_suggestions;
    }
    public void setCurriculum_vitae_content_suggestions(String curriculum_vitae_content_suggestions) {
        this.curriculum_vitae_content_suggestions = curriculum_vitae_content_suggestions;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

}
