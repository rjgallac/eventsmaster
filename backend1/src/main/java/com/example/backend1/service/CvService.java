package com.example.backend1.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.backend1.model.CurriculumVitae;
import com.example.backend1.repository.CvRepository;

@Service
public class CvService {

    @Autowired
    private final CvRepository cvRepository;

    public CvService(CvRepository cvRepository) {
        this.cvRepository = cvRepository;
    }

    public void addCv(CurriculumVitae curriculumVitae) {
        cvRepository.save(curriculumVitae);
    }

    public List<CurriculumVitae> getCvs() {
        return cvRepository.findAll();
    }

    public CurriculumVitae getCv(Long id) {
        return cvRepository.findById(id).orElse(null);
    }

    public void deleteCv(Long id) {
        cvRepository.deleteById(id);
    }

}
