package com.example.backend1.controllers;

import java.util.List;
import java.util.logging.Logger;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend1.model.CurriculumVitae;
import com.example.backend1.model.CvDto;
import com.example.backend1.model.CvMapper;
import com.example.backend1.service.CvService;


@RestController
@RequestMapping("/api/cv")
public class CvController {

    Logger logger = Logger.getLogger(CvController.class.getName());

    private final CvService cvService;

    private final CvMapper cvMapper;

    public CvController(CvService cvService) {
        this.cvService = cvService;
        this.cvMapper = new CvMapper();
    }

    @GetMapping
    public List<CvDto> getCvs() {
        List<CurriculumVitae> curriculumVitaes = cvService.getCvs();
        return curriculumVitaes.stream().map(cvMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public CvDto getCv(@PathVariable Long id) {
        CurriculumVitae curriculumVitae = cvService.getCv(id);
        return cvMapper.toDto(curriculumVitae);
    }
    
    @GetMapping("/{id}/suggest")
    public CvDto getSuggest(@PathVariable Long id) {
        CurriculumVitae curriculumVitae = cvService.sendCvForComparison(id);
        return cvMapper.toDto(curriculumVitae);
    }

    @PostMapping
    public String addCv(@RequestBody CvDto cvDto) {
        CurriculumVitae curriculumVitae = cvMapper.toEntity(cvDto);
        cvService.addCv(curriculumVitae);
        logger.info("Curriculum Vitae added: " + curriculumVitae.getId());
        return "Curriculum Vitae added successfully";
    }
    
    @DeleteMapping("/{id}")
    public String deleteCv(@PathVariable Long id) {
        cvService.deleteCv(id);
        logger.info("Curriculum Vitae deleted: " + id);
        return "Curriculum Vitae deleted successfully";
    }

}
