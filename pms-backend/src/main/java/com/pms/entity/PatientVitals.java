package com.pms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_vitals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientVitals {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "blood_pressure")
    private String bloodPressure; // e.g. 120/80 mmHg

    @Column(name = "heart_rate")
    private Integer heartRate; // bpm

    @Column(name = "temperature")
    private Double temperature; // °C or °F

    @Column(name = "weight")
    private Double weight; // kg

    @Column(name = "height")
    private Double height; // cm

    @Column(name = "oxygen_saturation")
    private Integer oxygenSaturation; // SpO2 %

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    @PrePersist
    protected void onCreate() {
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
    }
}
