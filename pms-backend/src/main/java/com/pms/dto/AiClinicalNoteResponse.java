package com.pms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiClinicalNoteResponse {
    private String chiefComplaint;
    private String symptoms;
    private String medicalHistory;
    private String examinationNotes;
    private String assessment;
    private String planAndFollowUp;
    private String formattedClinicalNote; // Full SOAP markdown format
}
