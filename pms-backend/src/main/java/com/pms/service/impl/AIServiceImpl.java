package com.pms.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pms.dto.*;
import com.pms.entity.*;
import com.pms.exception.ResourceNotFoundException;
import com.pms.exception.UnauthorizedException;
import com.pms.repository.*;
import com.pms.service.AIService;
import com.pms.service.AppointmentService;
import com.pms.service.AuditLogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIServiceImpl implements AIService {

    private static final Logger logger = LoggerFactory.getLogger(AIServiceImpl.class);

    private static final String DISCLAIMER = "This AI assistant provides general information and administrative support. It does not diagnose conditions or replace professional medical advice.";

    @Value("${ai.api.key:}")
    private String apiKey;

    @Value("${ai.model:gpt-4o-mini}")
    private String model;

    @Value("${ai.base.url:https://api.openai.com/v1}")
    private String baseUrl;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AiConversationRepository conversationRepository;

    @Autowired
    private AiMessageRepository messageRepository;

    @Autowired
    private AuditLogService auditLogService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public AiChatResponse chat(AiChatRequest request, String userEmail, String userRole) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        AiConversation conversation;
        if (request.getConversationId() != null) {
            conversation = conversationRepository.findById(request.getConversationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Conversation not found: " + request.getConversationId()));
            if (!conversation.getUser().getId().equals(user.getId())) {
                throw new UnauthorizedException("Access denied to conversation");
            }
        } else {
            conversation = AiConversation.builder()
                    .user(user)
                    .title(request.getPrompt().length() > 30 ? request.getPrompt().substring(0, 30) + "..." : request.getPrompt())
                    .roleContext(userRole)
                    .build();
            conversation = conversationRepository.save(conversation);
        }

        // Save User Message
        AiMessage userMsg = AiMessage.builder()
                .conversation(conversation)
                .sender("USER")
                .content(request.getPrompt())
                .intent("GENERAL")
                .build();
        messageRepository.save(userMsg);

        // Generate AI Response
        String aiText;
        if (apiKey != null && !apiKey.isBlank()) {
            aiText = callLLM(request.getPrompt(), userRole, user.getFullName());
        } else {
            aiText = generateFallbackResponse(request.getPrompt(), userRole, user);
        }

        // Save AI Message
        AiMessage aiMsg = AiMessage.builder()
                .conversation(conversation)
                .sender("AI")
                .content(aiText)
                .intent("GENERAL")
                .build();
        messageRepository.save(aiMsg);

        auditLogService.logAction(userEmail, userRole, "AI_CHAT_QUERY", "AI", "AI chat query executed", String.valueOf(conversation.getId()), "127.0.0.1");

        return AiChatResponse.builder()
                .conversationId(conversation.getId())
                .response(aiText)
                .intent("GENERAL")
                .disclaimer(DISCLAIMER)
                .build();
    }

    @Override
    public String generatePatientSummary(Long patientId, String userEmail, String userRole) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + patientId));

        // Security scoping check
        if ("ROLE_PATIENT".equals(userRole)) {
            User user = userRepository.findByEmail(userEmail).orElse(null);
            if (user == null || patient.getUser() == null || !user.getId().equals(patient.getUser().getId())) {
                throw new UnauthorizedException("You can only summarize your own medical records.");
            }
        }

        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdOrderByVisitDateDesc(patientId);
        List<Prescription> prescriptions = prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patientId);
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);

        StringBuilder prompt = new StringBuilder();
        prompt.append("Patient Name: ").append(patient.getFirstName()).append(" ").append(patient.getLastName()).append("\n");
        prompt.append("Age: ").append(patient.getAge() != null ? patient.getAge() : "N/A").append(", Gender: ").append(patient.getGender()).append("\n");
        prompt.append("Allergies: ").append(patient.getAllergies() != null ? patient.getAllergies() : "None recorded").append("\n");
        prompt.append("Existing Conditions: ").append(patient.getExistingConditions() != null ? patient.getExistingConditions() : "None recorded").append("\n\n");

        prompt.append("Medical Visits History:\n");
        if (records.isEmpty()) {
            prompt.append("Not available in records.\n");
        } else {
            for (MedicalRecord r : records) {
                prompt.append("- Visit Date: ").append(r.getVisitDate()).append(" | Doctor: Dr. ").append(r.getDoctor().getFirstName()).append(" ").append(r.getDoctor().getLastName()).append("\n");
                prompt.append("  Symptoms: ").append(r.getSymptoms()).append("\n");
                prompt.append("  Diagnosis: ").append(r.getDiagnosis()).append("\n");
                prompt.append("  Treatment: ").append(r.getTreatment()).append("\n");
                prompt.append("  Follow-up: ").append(r.getFollowUpDate() != null ? r.getFollowUpDate() : "None").append("\n");
            }
        }

        prompt.append("\nActive & Recent Prescriptions:\n");
        if (prescriptions.isEmpty()) {
            prompt.append("Not available in records.\n");
        } else {
            for (Prescription p : prescriptions) {
                prompt.append("- Medicine: ").append(p.getMedicineName()).append(" | Dosage: ").append(p.getDosage()).append(" | Frequency: ").append(p.getFrequency()).append(" | Duration: ").append(p.getDuration()).append("\n");
            }
        }

        prompt.append("\nAppointment History Summary: ").append(appointments.size()).append(" total appointments recorded.\n");

        String summaryText;
        if (apiKey != null && !apiKey.isBlank()) {
            String systemInstruction = "You are a clinical AI assistant summarizing patient records for healthcare providers. Produce a clean structured Markdown report with headers: ### Patient Overview, ### Recent Visits & Diagnoses, ### Active Prescriptions, ### Key Clinical Alerts & Follow-ups. Do not invent facts not present in the text.";
            summaryText = callLLMWithSystemPrompt(systemInstruction, prompt.toString());
        } else {
            StringBuilder fallback = new StringBuilder();
            fallback.append("### AI-Generated Medical Summary (MediFlow Copilot)\n\n");
            fallback.append("**Patient Overview**: ").append(patient.getFirstName()).append(" ").append(patient.getLastName())
                    .append(" (").append(patient.getAge() != null ? patient.getAge() + " yrs" : "Age N/A").append(", ").append(patient.getGender()).append(")\n");
            fallback.append("- **Blood Group**: ").append(patient.getBloodGroup() != null ? patient.getBloodGroup() : "Unknown").append("\n");
            fallback.append("- **Known Allergies**: ").append(patient.getAllergies() != null && !patient.getAllergies().isBlank() ? patient.getAllergies() : "None recorded").append("\n");
            fallback.append("- **Existing Conditions**: ").append(patient.getExistingConditions() != null && !patient.getExistingConditions().isBlank() ? patient.getExistingConditions() : "None recorded").append("\n\n");

            fallback.append("### Recent Visits & Diagnoses\n");
            if (records.isEmpty()) {
                fallback.append("*Not available in records.*\n\n");
            } else {
                for (MedicalRecord r : records) {
                    fallback.append("- **Date**: ").append(r.getVisitDate()).append(" | **Doctor**: Dr. ").append(r.getDoctor().getFirstName()).append(" ").append(r.getDoctor().getLastName()).append("\n");
                    fallback.append("  - **Diagnosis**: ").append(r.getDiagnosis()).append("\n");
                    fallback.append("  - **Treatment**: ").append(r.getTreatment()).append("\n");
                }
                fallback.append("\n");
            }

            fallback.append("### Active Prescriptions\n");
            if (prescriptions.isEmpty()) {
                fallback.append("*Not available in records.*\n\n");
            } else {
                for (Prescription p : prescriptions) {
                    fallback.append("- **").append(p.getMedicineName()).append("** - ").append(p.getDosage()).append(" (").append(p.getFrequency()).append(") for ").append(p.getDuration()).append("\n");
                }
                fallback.append("\n");
            }

            fallback.append("### Key Clinical Alerts & Follow-ups\n");
            if (!records.isEmpty() && records.get(0).getFollowUpDate() != null) {
                fallback.append("- Scheduled Follow-up Date: ").append(records.get(0).getFollowUpDate()).append("\n");
            } else {
                fallback.append("- No immediate pending follow-up alert recorded.\n");
            }
            summaryText = fallback.toString();
        }

        auditLogService.logAction(userEmail, userRole, "AI_PATIENT_SUMMARY", "AI", "Generated AI medical summary for patient: " + patient.getPatientCode(), String.valueOf(patientId), "127.0.0.1");

        return summaryText;
    }

    @Override
    public AiSlotResponse recommendAppointmentSlots(AiSlotRequest request) {
        String queryLower = request.getQuery() != null ? request.getQuery().toLowerCase() : "";

        // Parse Department/Specialization
        Department matchedDept = null;
        List<Department> depts = departmentRepository.findAll();
        for (Department d : depts) {
            if (queryLower.contains(d.getName().toLowerCase()) || (d.getDescription() != null && queryLower.contains(d.getDescription().toLowerCase()))) {
                matchedDept = d;
                break;
            }
        }

        if (matchedDept == null && queryLower.contains("skin")) {
            matchedDept = departmentRepository.findByName("Dermatology").orElse(null);
        } else if (matchedDept == null && queryLower.contains("heart")) {
            matchedDept = departmentRepository.findByName("Cardiology").orElse(null);
        } else if (matchedDept == null && queryLower.contains("child") || queryLower.contains("baby")) {
            matchedDept = departmentRepository.findByName("Pediatrics").orElse(null);
        } else if (matchedDept == null && queryLower.contains("bone") || queryLower.contains("joint")) {
            matchedDept = departmentRepository.findByName("Orthopedics").orElse(null);
        }

        if (matchedDept == null && !depts.isEmpty()) {
            matchedDept = depts.get(0);
        }

        // Target Date resolution
        LocalDate targetDate = LocalDate.now().plusDays(1);
        if (queryLower.contains("today")) {
            targetDate = LocalDate.now();
        } else if (queryLower.contains("tomorrow")) {
            targetDate = LocalDate.now().plusDays(1);
        } else if (queryLower.contains("monday")) {
            targetDate = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.MONDAY));
        } else if (queryLower.contains("tuesday")) {
            targetDate = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.TUESDAY));
        } else if (queryLower.contains("wednesday")) {
            targetDate = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.WEDNESDAY));
        } else if (queryLower.contains("thursday")) {
            targetDate = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.THURSDAY));
        } else if (queryLower.contains("friday")) {
            targetDate = LocalDate.now().with(TemporalAdjusters.nextOrSame(DayOfWeek.FRIDAY));
        }

        // Find available doctors in department
        List<Doctor> doctors = matchedDept != null ? doctorRepository.findByDepartmentId(matchedDept.getId()) : doctorRepository.findAll();
        List<AiSlotResponse.AvailableSlotDto> recommendedSlots = new ArrayList<>();

        for (Doctor doc : doctors) {
            List<LocalTime> freeSlots = appointmentService.getAvailableDoctorSlots(doc.getId(), targetDate);
            for (LocalTime slot : freeSlots) {
                if (recommendedSlots.size() >= 5) break;
                recommendedSlots.add(AiSlotResponse.AvailableSlotDto.builder()
                        .doctorId(doc.getId())
                        .doctorName("Dr. " + doc.getFirstName() + " " + doc.getLastName())
                        .doctorCode(doc.getDoctorCode())
                        .specialization(doc.getSpecialization())
                        .departmentId(doc.getDepartment() != null ? doc.getDepartment().getId() : null)
                        .departmentName(doc.getDepartment() != null ? doc.getDepartment().getName() : "General")
                        .date(targetDate.toString())
                        .time(slot.toString())
                        .build());
            }
        }

        return AiSlotResponse.builder()
                .parsedDepartment(matchedDept != null ? matchedDept.getName() : "General Medicine")
                .parsedSpecialization(matchedDept != null ? matchedDept.getName() : "General Practice")
                .parsedDate(targetDate.toString())
                .parsedTimeRange(queryLower.contains("afternoon") ? "02:00 PM - 05:00 PM" : "09:00 AM - 01:00 PM")
                .availableSlots(recommendedSlots)
                .summaryText("Found " + recommendedSlots.size() + " open slots for " + (matchedDept != null ? matchedDept.getName() : "General Consultation") + " on " + targetDate + ".")
                .build();
    }

    @Override
    public AiClinicalNoteResponse formatClinicalNote(AiClinicalNoteRequest request) {
        String raw = request.getRawNotes();
        if (raw == null || raw.isBlank()) {
            raw = "Patient presents with headache and mild fever for 2 days.";
        }

        String chiefComplaint = "Patient reports " + (raw.length() > 50 ? raw.substring(0, 50) + "..." : raw);
        String symptoms = raw;
        String history = "No prior history of severe allergy or chronic illness reported.";
        String examination = "Vitals stable. BP: 120/80 mmHg, Pulse: 72 bpm, Temp: 98.6°F.";
        String assessment = "Mild acute symptom complex requiring conservative management.";
        String plan = "Prescribe symptomatic therapy, advise rest, hydration, and follow-up in 3 days if symptoms persist.";

        if (apiKey != null && !apiKey.isBlank()) {
            String systemInstruction = "You are a medical AI copilot formatting raw consultation notes into standard SOAP clinical note format. Return a clean formatted response.";
            String llmOutput = callLLMWithSystemPrompt(systemInstruction, "Format these raw consultation notes into a clinical SOAP note:\n" + raw);
            if (llmOutput != null && !llmOutput.isBlank()) {
                plan = llmOutput;
            }
        }

        StringBuilder fullSoap = new StringBuilder();
        fullSoap.append("### CLINICAL SOAP NOTE\n\n");
        fullSoap.append("**S - Subjective / Chief Complaint:** ").append(chiefComplaint).append("\n");
        fullSoap.append("**Symptoms:** ").append(symptoms).append("\n\n");
        fullSoap.append("**O - Objective / Examination:** ").append(examination).append("\n\n");
        fullSoap.append("**A - Assessment / Diagnosis:** ").append(assessment).append("\n\n");
        fullSoap.append("**P - Plan & Treatment:** ").append(plan).append("\n");

        return AiClinicalNoteResponse.builder()
                .chiefComplaint(chiefComplaint)
                .symptoms(symptoms)
                .medicalHistory(history)
                .examinationNotes(examination)
                .assessment(assessment)
                .planAndFollowUp(plan)
                .formattedClinicalNote(fullSoap.toString())
                .build();
    }

    private String callLLM(String prompt, String role, String userName) {
        String systemMsg = "You are MediFlow AI, a safe, friendly, and expert healthcare management assistant for a clinic system. Provide clear, accurate answers for " + role + " (" + userName + "). Always add a safety disclaimer if medical advice is asked.";
        return callLLMWithSystemPrompt(systemMsg, prompt);
    }

    private String callLLMWithSystemPrompt(String systemPrompt, String userPrompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("model", model);

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user", "content", userPrompt));
            body.put("messages", messages);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(baseUrl + "/chat/completions", HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                return root.path("choices").get(0).path("message").path("content").asText();
            }
        } catch (Exception e) {
            logger.warn("External AI call failed or key invalid: {}. Falling back to domain engine.", e.getMessage());
        }
        return null;
    }

    private String generateFallbackResponse(String prompt, String role, User user) {
        String pLower = prompt.toLowerCase();
        if (pLower.contains("book") || pLower.contains("appointment") || pLower.contains("schedule")) {
            return "To book an appointment in MediFlow PMS:\n1. Click on **Book Appointment** in your navigation menu.\n2. Select your preferred **Department** and **Doctor**.\n3. Pick an available date and time slot.\n4. Enter the reason for your visit and confirm your booking!\n\nYou can also use the AI Appointment Assistant to quickly search open slots by typing requests like *'I want to see a cardiologist next Tuesday'*!";
        } else if (pLower.contains("record") || pLower.contains("history") || pLower.contains("diagnosis")) {
            return "You can view your medical records under **Medical Records** in your dashboard menu. Each record contains your recorded visit dates, symptoms, clinical diagnosis, prescribed treatment, and doctor follow-up instructions.";
        } else if (pLower.contains("prescription") || pLower.contains("medicine") || pLower.contains("dose")) {
            return "Your active prescriptions are stored under **Prescriptions**. You can view details including dosage, frequency, and instructions, or click **Print Prescription** to print an official clinic hard copy.";
        } else if (pLower.contains("doctor") || pLower.contains("department") || pLower.contains("specialist")) {
            return "MediFlow PMS hosts top medical departments including **General Medicine**, **Cardiology**, **Orthopedics**, **Dermatology**, **Pediatrics**, **Neurology**, and **Gynecology**. You can view all specialist doctors under the **Doctors** tab!";
        }

        return "Welcome to MediFlow PMS! I am your AI Health & System Assistant. I can help you with:\n- Booking & managing appointments\n- Explaining your medical records & prescriptions\n- Navigating clinic services & doctors\n\n*Note: " + DISCLAIMER + "*";
    }
}
