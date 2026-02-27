package com.sms.patientmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "consultations")
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // keep simple: store appointmentId as number (no relation yet)
    @Column(nullable = false)
    private Long appointmentId;

    @Column(length = 1000)
    private String symptoms;

    @Column(length = 1000)
    private String diagnosis;

    @Column(length = 2000)
    private String prescription;

    private String createdAt; // simple string

    public Consultation() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}