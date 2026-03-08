package com.example.backend1.model;

import org.springframework.stereotype.Component;

@Component
public class JobSpecMapper {

    public JobSpec toEntity(JobSpecDto jobSpecDto) {
        JobSpec jobSpec = new JobSpec();
        jobSpec.setId(jobSpecDto.getId());
        jobSpec.setCvId(jobSpecDto.getCvId());
        jobSpec.setJobSpecContent(jobSpecDto.getJob_spec_content());
        jobSpec.setLocation(jobSpecDto.getLocation());
        jobSpec.setSalary(jobSpecDto.getSalary());
        jobSpec.setScore(jobSpecDto.getScore());
        return jobSpec;
    }

    public JobSpecDto toDto(JobSpec jobSpec) {
        JobSpecDto jobSpecDto = new JobSpecDto();
        jobSpecDto.setId(jobSpec.getId());
        jobSpecDto.setJob_spec_content(jobSpec.getJobSpecContent());
        jobSpecDto.setLocation(jobSpec.getLocation());
        jobSpecDto.setSalary(jobSpec.getSalary());
        jobSpecDto.setScore(jobSpec.getScore());
        jobSpecDto.setCvId(jobSpec.getCvId());
        jobSpecDto.setJobTitle(jobSpec.getJobTitle());
        jobSpecDto.setCompany(jobSpec.getCompany());
        return jobSpecDto;
    }

}
