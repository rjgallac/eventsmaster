package com.example.backend1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "curriculum_vitae")
public class CurriculumVitae {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(columnDefinition="TEXT")
    private String curriculum_vitae_content;

    @Column(columnDefinition="TEXT")
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
