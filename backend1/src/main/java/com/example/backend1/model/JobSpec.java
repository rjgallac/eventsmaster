package com.example.backend1.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_spec")
public class JobSpec {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;

    @Column(columnDefinition="TEXT")
    private String jobSpecContent;

    private String location;

    private String salary;

    private String score;

    private Long cvId;

    private String company;

    // Getters and setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getJobTitle() {
        return jobTitle;
    }
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }
    @Column(columnDefinition="TEXT")
    public String getJobSpecContent() {
        return jobSpecContent;
    }
    public void setJobSpecContent(String jobSpecContent) {
        this.jobSpecContent = jobSpecContent;
    }
    public String getLocation() {
        return location;
    }
    public void setLocation(String location) {
        this.location = location;
    }
    public String getSalary() {
        return salary;
    }
    public void setSalary(String salary) {
        this.salary = salary;
    }
    public String getScore() {
        return score;
    }
    public void setScore(String score) {
        this.score = score;
    }

    public Long getCvId() {
        return cvId;
    }

    public void setCvId(Long cvId) {
        this.cvId = cvId;
    }
    public void setCompany(String company) {
        this.company = company;
    }

    public String getCompany() {
        return company;
    }

}
