package com.pms.service;

import com.pms.dto.*;

public interface AIService {
    AiChatResponse chat(AiChatRequest request, String userEmail, String userRole);
    String generatePatientSummary(Long patientId, String userEmail, String userRole);
    AiSlotResponse recommendAppointmentSlots(AiSlotRequest request);
    AiClinicalNoteResponse formatClinicalNote(AiClinicalNoteRequest request);
}
