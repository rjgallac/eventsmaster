package com.example.backend1.model;

public class CvMapper {

    public CurriculumVitae toEntity(CvDto cvDto) {
        CurriculumVitae curriculumVitae = new CurriculumVitae();

        curriculumVitae.setName(cvDto.getName());
        curriculumVitae.setCurriculum_vitae_content(cvDto.getCurriculum_vitae_content());
        return curriculumVitae;
    }

    public CvDto toDto(CurriculumVitae curriculumVitae) {
        CvDto cvDto = new CvDto();
        cvDto.setId(curriculumVitae.getId());
        cvDto.setName(curriculumVitae.getName());
        cvDto.setCurriculum_vitae_content(curriculumVitae.getCurriculum_vitae_content());
        cvDto.setCurriculum_vitae_content_suggestions(curriculumVitae.getCurriculum_vitae_content_suggestions());
        cvDto.setStatus(curriculumVitae.getStatus());
        return cvDto;
    }

}
