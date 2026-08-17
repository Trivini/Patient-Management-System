<<<<<<< HEAD
# 🏥 Patient Management System (PMS)

A full-stack healthcare management application built using **Spring Boot + MySQL** with a simple and clean UI.

This system allows hospitals and clinics to manage patients, appointments, consultation notes, and documents efficiently.

---

## 🚀 Features

✅ Add / View / Manage Patients  
✅ Book & Manage Appointments  
✅ Add Consultation Notes (Symptoms, Diagnosis, Prescription)  
✅ Upload & Download Medical Documents  
✅ REST API + Simple HTML UI  
✅ MySQL Database Integration  

---

## 🛠 Tech Stack

- Java 17
- Spring Boot
- Spring Data JPA
- MySQL
- HTML / Bootstrap
- Maven
- Git & GitHub

---

## 📂 Project Structure
=======
# MediFlow PMS - AI-Powered Patient Management System

MediFlow PMS is a production-grade, full-stack healthcare management SaaS web application built with a modern React.js frontend, a robust Java 17 + Spring Boot REST backend, Spring Security with stateless JWT authorization, JPA/Hibernate persistence (supporting MySQL & H2 fallback), and integrated AI services for patient record summarization, doctor clinical copilot SOAP drafting, and natural-language appointment slot discovery.

---

## 🌟 Key Features

### 🔐 Authentication & Role-Based Authorization
- **4 Distinct Roles**: `ADMIN`, `DOCTOR`, `RECEPTIONIST`, `PATIENT`.
- **JWT Security**: Stateless bearer authentication, BCrypt password hashing, token expiration handling, and protected API endpoints & React routes.
- **Role-Based Redirects**: Automatic dashboard routing based on authenticated user privileges.
- **Security Safeguards**: Prevents unauthorized API or manual URL access between roles.

### 📊 Real-Time Role Dashboards
- **Admin Dashboard**: Database statistics (total patients, active doctors, lifetime & today's appointments, completed vs cancelled breakdown) with interactive Recharts line & bar charts.
- **Doctor Dashboard**: Today's consultation schedule, assigned patients, completed count, and quick AI Copilot drawer trigger.
- **Receptionist Dashboard**: Today's intake stats, pending appointments, doctor availability status, and patient registration intake wizard.
- **Patient Dashboard**: Next upcoming appointment widget, record counts, active prescriptions, and multi-step appointment booking.

### 🏥 Core Clinical & Administrative Modules
- **Patient Management**: Complete CRUD, search, status filter, gender filter, age calculation, unique code generation (`PAT001`), and 4-tab patient profile modal (Overview, Appointments, Records, Prescriptions).
- **Doctor Management**: Physician CRUD, specialization, department assignment, qualification, experience, consultation fee, availability hours, and unique code (`DOC001`).
- **Department Management**: Department CRUD (`DEP001`), head physician assignment, active doctor count, and deletion safeguards when assigned doctors exist.
- **Appointment Booking & Double-Booking Prevention**: Select department, doctor, date, and open time slot. Backend validates against double-booking for the same doctor, date, and time.
- **Electronic Medical Records (EMR)**: Visit date, symptoms, diagnosis, treatment, and follow-up tracking (`REC001`).
- **e-Prescription & Printable Rx**: Prescribe medicine name, dosage, frequency, duration, special instructions, and printable hard-copy modal (`PRE001`).
- **Audit Logging**: Immutable system audit trails tracking logins, record creation, AI prompts, and administrative changes.

### 🤖 Integrated AI Layer
- **AI Patient Assistant**: Safe, non-diagnostic assistant explaining clinic services and record information with clear disclaimers.
- **AI Patient Record Summarizer**: Summarizes patient medical records, visit diagnoses, treatments, and prescriptions into a structured Markdown overview for doctors.
- **AI Doctor Copilot**: Formats raw consultation notes into standardized clinical SOAP notes with "Copy to Medical Record" capability.
- **AI Appointment Slot Search**: Parses natural-language queries (e.g. *"I want to see a cardiologist next Tuesday"*) and returns verified available open slots.
- **Resilient AI Architecture**: Calls LLM REST endpoint when `AI_API_KEY` is configured; seamlessly falls back to an internal intelligent heuristic domain engine when no key is set.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Tailwind CSS, Lucide Icons, Recharts, Vite.
- **Backend**: Java 17, Spring Boot 3.2, Spring Security, JWT (`jjwt`), Spring Data JPA, Hibernate, Bean Validation, Maven.
- **Database**: MySQL 8.x (Primary), H2 Database (Dev & Automated Test Fallback).
- **AI Service**: OpenAI REST Integration + Heuristic Fallback Engine.
- **API Documentation**: OpenAPI 3.0 / Swagger UI.

---

## 🔑 Demo Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | `Rajesh Kulkarni` | `admin@pms.com` | `Admin@123` |
| **Doctor** | `Dr. Ananya Deshmukh` | `doctor@pms.com` | `Doctor@123` |
| **Receptionist** | `Pooja Shinde` | `receptionist@pms.com` | `Reception@123` |
| **Patient** | `Aarav Patil` | `patient@pms.com` | `Patient@123` |

---

## ⚙️ Environment Variables (`.env` / `application.properties`)

```properties
# Server Port
server.port=8080

# Database Configuration (MySQL)
DATABASE_URL=jdbc:mysql://localhost:3306/pms_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=root

# Security JWT Configuration
JWT_SECRET=9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b
JWT_EXPIRATION_MS=86400000

# AI Integration
AI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4o-mini
AI_BASE_URL=https://api.openai.com/v1
```

---

## 🚀 Quick Setup & Local Execution Instructions

### 1. Run Backend Application (`pms-backend`)
```bash
cd pms-backend
mvn spring-boot:run
```
*or using the Maven wrapper:*
```bash
..\mvnw.cmd spring-boot:run
```
- Backend starts at: `http://localhost:8080`
- Swagger API Documentation: `http://localhost:8080/swagger-ui.html`
- Health Endpoint: `http://localhost:8080/api/health`

### 2. Run Frontend Application (`pms-frontend`)
```bash
cd pms-frontend
npm install
npm run dev
```
- Frontend application starts at: `http://localhost:5173`

---

## 🌐 Production Deployment Guide

- **Frontend (Netlify / Vercel)**:
  - Build command: `npm run dev` / `npm run build`
  - Output directory: `dist`
  - Set `VITE_API_BASE_URL` to your production backend URL.
- **Backend (Render / Railway / AWS Elastic Beanstalk)**:
  - Dockerized or Maven build jar execution: `java -jar target/pms-backend-1.0.0.jar`.
  - Supply production `DATABASE_URL`, `JWT_SECRET`, and `AI_API_KEY` as environment variables.
>>>>>>> 04b6957 (feat: add PDF/Excel export, notification reminders, advanced analytics, and patient vitals tracking)
