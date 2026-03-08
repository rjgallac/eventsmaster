package com.example.backend1.controllers;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend1.model.JobSpec;
import com.example.backend1.model.JobSpecDto;
import com.example.backend1.model.JobSpecMapper;
import com.example.backend1.service.JobSpecService;


@RestController
@RequestMapping("/api/jobspec")
public class JobSpecController {




    Logger logger = Logger.getLogger(JobSpecController.class.getName());

    private final JobSpecService jobSpecService;
    private final JobSpecMapper jobSpecMapper;

    public JobSpecController(JobSpecService jobSpecService, JobSpecMapper jobSpecMapper) {
        this.jobSpecService = jobSpecService;
        this.jobSpecMapper = jobSpecMapper;
    }

    @GetMapping
    public List<JobSpecDto> getProducts() {
        List<JobSpec> jobSpecs = jobSpecService.getJobSpecs();
        return jobSpecs.stream().map(jobSpecMapper::toDto).collect(java.util.stream.Collectors.toList());
    }


    @PostMapping
    public String addJobSpec(@RequestBody JobSpecDto jobSpecDto) {
       
        // save job spec to database
        JobSpec jobSpec = jobSpecMapper.toEntity(jobSpecDto);
        jobSpecService.addJobSpec(jobSpec);

        return "Product added successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteJobSpec(@PathVariable Long id) {
        jobSpecService.deleteJobSpec(id);
        return "Product deleted successfully";
    }

}
