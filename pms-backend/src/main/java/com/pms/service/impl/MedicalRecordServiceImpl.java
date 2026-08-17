package com.pms.service.impl;

import com.pms.dto.MedicalRecordDto;
import com.pms.entity.Appointment;
import com.pms.entity.Doctor;
import com.pms.entity.MedicalRecord;
import com.pms.entity.Patient;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.AppointmentRepository;
import com.pms.repository.DoctorRepository;
import com.pms.repository.MedicalRecordRepository;
import com.pms.repository.PatientRepository;
import com.pms.service.MedicalRecordService;
import com.pms.util.IdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public MedicalRecordDto createMedicalRecord(MedicalRecordDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        Appointment appointment = null;
        if (dto.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(dto.getAppointmentId()).orElse(null);
            if (appointment != null) {
                appointment.setStatus("COMPLETED");
                appointmentRepository.save(appointment);
            }
        }

        MedicalRecord record = MedicalRecord.builder()
                .recordCode(IdGenerator.generateRecordCode(System.currentTimeMillis() % 1000))
                .patient(patient)
                .doctor(doctor)
                .appointment(appointment)
                .visitDate(dto.getVisitDate() != null ? dto.getVisitDate() : LocalDate.now())
                .symptoms(dto.getSymptoms())
                .diagnosis(dto.getDiagnosis())
                .treatment(dto.getTreatment())
                .notes(dto.getNotes())
                .followUpDate(dto.getFollowUpDate())
                .build();

        record = medicalRecordRepository.save(record);
        record.setRecordCode(IdGenerator.generateRecordCode(record.getId()));
        record = medicalRecordRepository.save(record);

        return mapToDto(record);
    }

    @Override
    @Transactional
    public MedicalRecordDto updateMedicalRecord(Long id, MedicalRecordDto dto) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));

        record.setSymptoms(dto.getSymptoms());
        record.setDiagnosis(dto.getDiagnosis());
        record.setTreatment(dto.getTreatment());
        record.setNotes(dto.getNotes());
        record.setFollowUpDate(dto.getFollowUpDate());

        return mapToDto(medicalRecordRepository.save(record));
    }

    @Override
    public MedicalRecordDto getMedicalRecordById(Long id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found with id: " + id));
        return mapToDto(record);
    }

    @Override
    public List<MedicalRecordDto> getMedicalRecordsByPatientId(Long patientId) {
        return medicalRecordRepository.findByPatientIdOrderByVisitDateDesc(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<MedicalRecordDto> getMedicalRecordsByDoctorId(Long doctorId) {
        return medicalRecordRepository.findByDoctorIdOrderByVisitDateDesc(doctorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<MedicalRecordDto> searchMedicalRecords(Long patientId, Long doctorId, String query, Pageable pageable) {
        return medicalRecordRepository.searchMedicalRecords(patientId, doctorId, query, pageable)
                .map(this::mapToDto);
    }

    private MedicalRecordDto mapToDto(MedicalRecord r) {
        return MedicalRecordDto.builder()
                .id(r.getId())
                .recordCode(r.getRecordCode())
                .patientId(r.getPatient().getId())
                .patientName(r.getPatient().getFirstName() + " " + r.getPatient().getLastName())
                .patientCode(r.getPatient().getPatientCode())
                .doctorId(r.getDoctor().getId())
                .doctorName("Dr. " + r.getDoctor().getFirstName() + " " + r.getDoctor().getLastName())
                .appointmentId(r.getAppointment() != null ? r.getAppointment().getId() : null)
                .visitDate(r.getVisitDate())
                .symptoms(r.getSymptoms())
                .diagnosis(r.getDiagnosis())
                .treatment(r.getTreatment())
                .notes(r.getNotes())
                .followUpDate(r.getFollowUpDate())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
