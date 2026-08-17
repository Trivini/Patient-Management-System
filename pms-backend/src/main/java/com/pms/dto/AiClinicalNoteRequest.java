package com.pms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiClinicalNoteRequest {
    private Long patientId;
    private String rawNotes; // Symptoms, raw observations entered by doctor
}
