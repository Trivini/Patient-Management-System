package com.pms.config;

import com.pms.entity.*;
import com.pms.repository.*;
import com.pms.util.IdGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private MedicalRecordRepository medicalRecordRepository;

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded. Skipping initial data population.");
            return;
        }

        logger.info("Starting initial database seeding for MediFlow PMS...");

        // 1. Seed Core Users
        User adminUser = User.builder()
                .email("admin@pms.com")
                .password(passwordEncoder.encode("Admin@123"))
                .fullName("Rajesh Kulkarni")
                .role(Role.ROLE_ADMIN)
                .phone("+91 98220 11223")
                .status("ACTIVE")
                .build();
        userRepository.save(adminUser);

        User docUser1 = User.builder()
                .email("doctor@pms.com")
                .password(passwordEncoder.encode("Doctor@123"))
                .fullName("Dr. Ananya Deshmukh")
                .role(Role.ROLE_DOCTOR)
                .phone("+91 98220 22334")
                .status("ACTIVE")
                .build();
        userRepository.save(docUser1);

        User docUser2 = User.builder()
                .email("rohit.pawar@pms.com")
                .password(passwordEncoder.encode("Doctor@123"))
                .fullName("Dr. Rohit Pawar")
                .role(Role.ROLE_DOCTOR)
                .phone("+91 98220 33445")
                .status("ACTIVE")
                .build();
        userRepository.save(docUser2);

        User docUser3 = User.builder()
                .email("sneha.joshi@pms.com")
                .password(passwordEncoder.encode("Doctor@123"))
                .fullName("Dr. Sneha Joshi")
                .role(Role.ROLE_DOCTOR)
                .phone("+91 98220 44556")
                .status("ACTIVE")
                .build();
        userRepository.save(docUser3);

        User receptionistUser = User.builder()
                .email("receptionist@pms.com")
                .password(passwordEncoder.encode("Reception@123"))
                .fullName("Pooja Shinde")
                .role(Role.ROLE_RECEPTIONIST)
                .phone("+91 98220 55667")
                .status("ACTIVE")
                .build();
        userRepository.save(receptionistUser);

        User patientUser1 = User.builder()
                .email("patient@pms.com")
                .password(passwordEncoder.encode("Patient@123"))
                .fullName("Aarav Patil")
                .role(Role.ROLE_PATIENT)
                .phone("+91 98220 66778")
                .status("ACTIVE")
                .build();
        userRepository.save(patientUser1);

        User patientUser2 = User.builder()
                .email("priya.sharma@pms.com")
                .password(passwordEncoder.encode("Patient@123"))
                .fullName("Priya Sharma")
                .role(Role.ROLE_PATIENT)
                .phone("+91 98220 77889")
                .status("ACTIVE")
                .build();
        userRepository.save(patientUser2);

        // 2. Seed Departments
        Department depCardio = Department.builder()
                .departmentCode(IdGenerator.generateDepartmentCode(1L))
                .name("Cardiology")
                .description("Comprehensive cardiovascular diagnosis, treatment, and heart care.")
                .headDoctorName("Dr. Ananya Deshmukh")
                .status("ACTIVE")
                .build();
        departmentRepository.save(depCardio);

        Department depDerm = Department.builder()
                .departmentCode(IdGenerator.generateDepartmentCode(2L))
                .name("Dermatology")
                .description("Advanced skincare, acne, eczema, and dermatological surgery.")
                .headDoctorName("Dr. Rohit Pawar")
                .status("ACTIVE")
                .build();
        departmentRepository.save(depDerm);

        Department depGen = Department.builder()
                .departmentCode(IdGenerator.generateDepartmentCode(3L))
                .name("General Medicine")
                .description("Primary adult care, health screenings, and preventative medicine.")
                .headDoctorName("Dr. Sneha Joshi")
                .status("ACTIVE")
                .build();
        departmentRepository.save(depGen);

        Department depOrtho = Department.builder()
                .departmentCode(IdGenerator.generateDepartmentCode(4L))
                .name("Orthopedics")
                .description("Bone, joint, and spinal disorder treatments.")
                .headDoctorName("Dr. Vikram Mane")
                .status("ACTIVE")
                .build();
        departmentRepository.save(depOrtho);

        Department depPeds = Department.builder()
                .departmentCode(IdGenerator.generateDepartmentCode(5L))
                .name("Pediatrics")
                .description("Specialized healthcare for infants, children, and adolescents.")
                .headDoctorName("Dr. Aditi Kulkarni")
                .status("ACTIVE")
                .build();
        departmentRepository.save(depPeds);

        Department depNeuro = Department.builder()
                .departmentCode(IdGenerator.generateDepartmentCode(6L))
                .name("Neurology")
                .description("Brain, nerve, and neurological disease management.")
                .headDoctorName("Dr. Sameer Gaikwad")
                .status("ACTIVE")
                .build();
        departmentRepository.save(depNeuro);

        Department depGyn = Department.builder()
                .departmentCode(IdGenerator.generateDepartmentCode(7L))
                .name("Gynecology")
                .description("Women's reproductive health and maternity care.")
                .headDoctorName("Dr. Sunita Bhosale")
                .status("ACTIVE")
                .build();
        departmentRepository.save(depGyn);

        // 3. Seed Doctors
        Doctor doc1 = Doctor.builder()
                .doctorCode(IdGenerator.generateDoctorCode(1L))
                .user(docUser1)
                .firstName("Ananya")
                .lastName("Deshmukh")
                .email("doctor@pms.com")
                .phone("+91 98220 22334")
                .gender("Female")
                .dateOfBirth(LocalDate.of(1982, 5, 12))
                .specialization("Cardiology")
                .department(depCardio)
                .qualification("MD, DM (Cardiology) - KEM Hospital, Mumbai")
                .experienceYears(15)
                .consultationFee(new BigDecimal("1200.00"))
                .availabilityHours("Mon-Fri 09:00 AM - 05:00 PM")
                .status("ACTIVE")
                .build();
        doctorRepository.save(doc1);

        Doctor doc2 = Doctor.builder()
                .doctorCode(IdGenerator.generateDoctorCode(2L))
                .user(docUser2)
                .firstName("Rohit")
                .lastName("Pawar")
                .email("rohit.pawar@pms.com")
                .phone("+91 98220 33445")
                .gender("Male")
                .dateOfBirth(LocalDate.of(1984, 8, 22))
                .specialization("Dermatology")
                .department(depDerm)
                .qualification("MD (Dermatology), DVD - BJ Medical College, Pune")
                .experienceYears(12)
                .consultationFee(new BigDecimal("1000.00"))
                .availabilityHours("Mon-Thu 10:00 AM - 04:00 PM")
                .status("ACTIVE")
                .build();
        doctorRepository.save(doc2);

        Doctor doc3 = Doctor.builder()
                .doctorCode(IdGenerator.generateDoctorCode(3L))
                .user(docUser3)
                .firstName("Sneha")
                .lastName("Joshi")
                .email("sneha.joshi@pms.com")
                .phone("+91 98220 44556")
                .gender("Female")
                .dateOfBirth(LocalDate.of(1988, 3, 15))
                .specialization("General Medicine")
                .department(depGen)
                .qualification("MBBS, MD (Medicine) - Grant Medical College, Mumbai")
                .experienceYears(9)
                .consultationFee(new BigDecimal("800.00"))
                .availabilityHours("Mon-Fri 08:30 AM - 04:30 PM")
                .status("ACTIVE")
                .build();
        doctorRepository.save(doc3);

        // 4. Seed Patients
        Patient pat1 = Patient.builder()
                .patientCode(IdGenerator.generatePatientCode(1L))
                .user(patientUser1)
                .firstName("Aarav")
                .lastName("Patil")
                .gender("Male")
                .dateOfBirth(LocalDate.of(1990, 6, 15))
                .age(36)
                .bloodGroup("O+")
                .phone("+91 98220 66778")
                .email("patient@pms.com")
                .address("Flat 402, Shivajinagar")
                .city("Pune")
                .state("Maharashtra")
                .pincode("411005")
                .emergencyContactName("Suresh Patil")
                .emergencyContactPhone("+91 98220 99887")
                .allergies("Penicillin")
                .existingConditions("Mild Hypertension")
                .registrationDate(LocalDate.now().minusMonths(6))
                .status("ACTIVE")
                .build();
        patientRepository.save(pat1);

        Patient pat2 = Patient.builder()
                .patientCode(IdGenerator.generatePatientCode(2L))
                .user(patientUser2)
                .firstName("Priya")
                .lastName("Sharma")
                .gender("Female")
                .dateOfBirth(LocalDate.of(1994, 4, 15))
                .age(32)
                .bloodGroup("A+")
                .phone("+91 98220 77889")
                .email("priya.sharma@pms.com")
                .address("701, Green Acres, FC Road")
                .city("Pune")
                .state("Maharashtra")
                .pincode("411004")
                .emergencyContactName("Amit Sharma")
                .emergencyContactPhone("+91 98220 88776")
                .allergies("Peanuts")
                .existingConditions("Asthma")
                .registrationDate(LocalDate.now().minusMonths(3))
                .status("ACTIVE")
                .build();
        patientRepository.save(pat2);

        // 5. Seed Appointments
        Appointment app1 = Appointment.builder()
                .appointmentCode(IdGenerator.generateAppointmentCode(1L))
                .patient(pat1)
                .doctor(doc1)
                .department(depCardio)
                .appointmentDate(LocalDate.now())
                .appointmentTime(LocalTime.of(10, 0))
                .reason("Routine Cardiovascular Assessment")
                .notes("Patient reports occasional mild chest tightness after exercise.")
                .status("CONFIRMED")
                .build();
        appointmentRepository.save(app1);

        Appointment app2 = Appointment.builder()
                .appointmentCode(IdGenerator.generateAppointmentCode(2L))
                .patient(pat2)
                .doctor(doc2)
                .department(depDerm)
                .appointmentDate(LocalDate.now().plusDays(2))
                .appointmentTime(LocalTime.of(11, 30))
                .reason("Skin Rash Evaluation")
                .notes("Persistent dry eczema patches on forearms.")
                .status("BOOKED")
                .build();
        appointmentRepository.save(app2);

        Appointment app3 = Appointment.builder()
                .appointmentCode(IdGenerator.generateAppointmentCode(3L))
                .patient(pat1)
                .doctor(doc3)
                .department(depGen)
                .appointmentDate(LocalDate.now().minusDays(10))
                .appointmentTime(LocalTime.of(9, 30))
                .reason("Annual Health Checkup")
                .notes("Completed routine wellness checkup.")
                .status("COMPLETED")
                .build();
        appointmentRepository.save(app3);

        // 6. Seed Medical Record
        MedicalRecord record1 = MedicalRecord.builder()
                .recordCode(IdGenerator.generateRecordCode(1L))
                .patient(pat1)
                .doctor(doc3)
                .appointment(app3)
                .visitDate(LocalDate.now().minusDays(10))
                .symptoms("Fatigue, mild headache, elevated BP reading 135/88")
                .diagnosis("Stage 1 Essential Hypertension")
                .treatment("Dietary sodium restriction, daily exercise, regular blood pressure monitoring")
                .notes("Advised patient to keep a daily BP log for 2 weeks.")
                .followUpDate(LocalDate.now().plusDays(14))
                .build();
        medicalRecordRepository.save(record1);

        // 7. Seed Prescription
        Prescription pres1 = Prescription.builder()
                .prescriptionCode(IdGenerator.generatePrescriptionCode(1L))
                .patient(pat1)
                .doctor(doc3)
                .medicalRecord(record1)
                .medicineName("Amlodipine 5mg")
                .dosage("1 Tablet")
                .frequency("Once daily in the morning")
                .duration("30 Days")
                .instructions("Take with water after breakfast. Avoid grapefruit juice.")
                .prescriptionDate(LocalDate.now().minusDays(10))
                .build();
        prescriptionRepository.save(pres1);

        logger.info("MediFlow PMS database seeding completed successfully!");
        logger.info("Demo User Credentials:");
        logger.info("Admin: admin@pms.com / Admin@123");
        logger.info("Doctor: doctor@pms.com / Doctor@123");
        logger.info("Receptionist: receptionist@pms.com / Reception@123");
        logger.info("Patient: patient@pms.com / Patient@123");
    }
}
