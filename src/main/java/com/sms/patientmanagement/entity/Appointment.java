package com.sms.patientmanagement.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // simple: patient name store (no relation yet)
    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String doctorName;

    @Column(nullable = false)
    private String appointmentDate; // YYYY-MM-DD

    @Column(nullable = false)
    private String appointmentTime; // HH:mm

    @Column(nullable = false)
    private String status; // BOOKED / COMPLETED / CANCELLED

    public Appointment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(String appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}