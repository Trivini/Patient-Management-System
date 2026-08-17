package com.pms.service.impl;

import com.pms.dto.PrescriptionDto;
import com.pms.entity.Doctor;
import com.pms.entity.MedicalRecord;
import com.pms.entity.Patient;
import com.pms.entity.Prescription;
import com.pms.exception.ResourceNotFoundException;
import com.pms.repository.DoctorRepository;
import com.pms.repository.MedicalRecordRepository;
import com.pms.repository.PatientRepository;
import com.pms.repository.PrescriptionRepository;
import com.pms.service.PrescriptionService;
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
public class PrescriptionServiceImpl implements PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Override
    @Transactional
    public PrescriptionDto createPrescription(PrescriptionDto dto) {
        Patient patient = patientRepository.findById(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + dto.getPatientId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + dto.getDoctorId()));

        MedicalRecord record = null;
        if (dto.getMedicalRecordId() != null) {
            record = medicalRecordRepository.findById(dto.getMedicalRecordId()).orElse(null);
        }

        Prescription prescription = Prescription.builder()
                .prescriptionCode(IdGenerator.generatePrescriptionCode(System.currentTimeMillis() % 1000))
                .patient(patient)
                .doctor(doctor)
                .medicalRecord(record)
                .medicineName(dto.getMedicineName())
                .dosage(dto.getDosage())
                .frequency(dto.getFrequency())
                .duration(dto.getDuration())
                .instructions(dto.getInstructions())
                .prescriptionDate(dto.getPrescriptionDate() != null ? dto.getPrescriptionDate() : LocalDate.now())
                .build();

        prescription = prescriptionRepository.save(prescription);
        prescription.setPrescriptionCode(IdGenerator.generatePrescriptionCode(prescription.getId()));
        prescription = prescriptionRepository.save(prescription);

        return mapToDto(prescription);
    }

    @Override
    @Transactional
    public PrescriptionDto updatePrescription(Long id, PrescriptionDto dto) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));

        prescription.setMedicineName(dto.getMedicineName());
        prescription.setDosage(dto.getDosage());
        prescription.setFrequency(dto.getFrequency());
        prescription.setDuration(dto.getDuration());
        prescription.setInstructions(dto.getInstructions());

        return mapToDto(prescriptionRepository.save(prescription));
    }

    @Override
    public PrescriptionDto getPrescriptionById(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription not found with id: " + id));
        return mapToDto(prescription);
    }

    @Override
    public List<PrescriptionDto> getPrescriptionsByPatientId(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patientId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionDto> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptionRepository.findByDoctorIdOrderByPrescriptionDateDesc(doctorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<PrescriptionDto> searchPrescriptions(Long patientId, Long doctorId, String query, Pageable pageable) {
        return prescriptionRepository.searchPrescriptions(patientId, doctorId, query, pageable)
                .map(this::mapToDto);
    }

    private PrescriptionDto mapToDto(Prescription p) {
        return PrescriptionDto.builder()
                .id(p.getId())
                .prescriptionCode(p.getPrescriptionCode())
                .patientId(p.getPatient().getId())
                .patientName(p.getPatient().getFirstName() + " " + p.getPatient().getLastName())
                .patientCode(p.getPatient().getPatientCode())
                .patientAge(p.getPatient().getAge() != null ? String.valueOf(p.getPatient().getAge()) : "N/A")
                .patientGender(p.getPatient().getGender())
                .doctorId(p.getDoctor().getId())
                .doctorName("Dr. " + p.getDoctor().getFirstName() + " " + p.getDoctor().getLastName())
                .doctorSpecialization(p.getDoctor().getSpecialization())
                .medicalRecordId(p.getMedicalRecord() != null ? p.getMedicalRecord().getId() : null)
                .medicineName(p.getMedicineName())
                .dosage(p.getDosage())
                .frequency(p.getFrequency())
                .duration(p.getDuration())
                .instructions(p.getInstructions())
                .prescriptionDate(p.getPrescriptionDate())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
