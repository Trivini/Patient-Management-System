import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Auth Guard Components
import { ProtectedRoute, RoleRoute } from '../components/auth/ProtectedRoute';

// Public Landing & Auth Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// Admin Pages
import { AdminDashboard } from '../pages/AdminDashboard';
import { PatientsPage } from '../pages/PatientsPage';
import { DoctorsPage } from '../pages/DoctorsPage';
import { DepartmentsPage } from '../pages/DepartmentsPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { MedicalRecordsPage } from '../pages/MedicalRecordsPage';
import { PrescriptionsPage } from '../pages/PrescriptionsPage';
import { UsersPage } from '../pages/UsersPage';
import { AuditLogsPage } from '../pages/AuditLogsPage';
import { SettingsPage } from '../pages/SettingsPage';

// Doctor Pages
import { DoctorDashboard } from '../pages/DoctorDashboard';
import { DoctorAppointmentsPage } from '../pages/DoctorAppointmentsPage';
import { DoctorPatientsPage } from '../pages/DoctorPatientsPage';
import { DoctorMedicalRecordsPage } from '../pages/DoctorMedicalRecordsPage';
import { DoctorPrescriptionsPage } from '../pages/DoctorPrescriptionsPage';
import { DoctorAiAssistantPage } from '../pages/DoctorAiAssistantPage';
import { DoctorProfilePage } from '../pages/DoctorProfilePage';

// Receptionist Pages
import { ReceptionistDashboard } from '../pages/ReceptionistDashboard';
import { ReceptionistPatientsPage } from '../pages/ReceptionistPatientsPage';
import { ReceptionistAppointmentsPage } from '../pages/ReceptionistAppointmentsPage';
import { ReceptionistDoctorsPage } from '../pages/ReceptionistDoctorsPage';
import { ReceptionistAiAssistantPage } from '../pages/ReceptionistAiAssistantPage';
import { ReceptionistProfilePage } from '../pages/ReceptionistProfilePage';

// Patient Pages
import { PatientDashboard } from '../pages/PatientDashboard';
import { PatientProfilePage } from '../pages/PatientProfilePage';
import { PatientAppointmentsPage } from '../pages/PatientAppointmentsPage';
import { BookAppointmentPage } from '../pages/BookAppointmentPage';
import { PatientMedicalRecordsPage } from '../pages/PatientMedicalRecordsPage';
import { PatientPrescriptionsPage } from '../pages/PatientPrescriptionsPage';
import { PatientAiAssistantPage } from '../pages/PatientAiAssistantPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route path="/access-denied" element={<UnauthorizedPage />} />

      {/* Protected Routes inside Dashboard Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Admin Role Routes */}
          <Route element={<RoleRoute allowedRoles="ROLE_ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/patients" element={<PatientsPage />} />
            <Route path="/admin/doctors" element={<DoctorsPage />} />
            <Route path="/admin/departments" element={<DepartmentsPage />} />
            <Route path="/admin/appointments" element={<AppointmentsPage />} />
            <Route path="/admin/medical-records" element={<MedicalRecordsPage />} />
            <Route path="/admin/prescriptions" element={<PrescriptionsPage />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/ai-assistant" element={<PatientAiAssistantPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogsPage />} />
            <Route path="/admin/settings" element={<SettingsPage />} />
          </Route>

          {/* Doctor Role Routes */}
          <Route element={<RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_DOCTOR']} />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointmentsPage />} />
            <Route path="/doctor/patients" element={<DoctorPatientsPage />} />
            <Route path="/doctor/medical-records" element={<DoctorMedicalRecordsPage />} />
            <Route path="/doctor/prescriptions" element={<DoctorPrescriptionsPage />} />
            <Route path="/doctor/ai-assistant" element={<DoctorAiAssistantPage />} />
            <Route path="/doctor/profile" element={<DoctorProfilePage />} />
          </Route>

          {/* Receptionist Role Routes */}
          <Route element={<RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_RECEPTIONIST']} />}>
            <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
            <Route path="/receptionist/patients" element={<ReceptionistPatientsPage />} />
            <Route path="/receptionist/appointments" element={<ReceptionistAppointmentsPage />} />
            <Route path="/receptionist/doctors" element={<ReceptionistDoctorsPage />} />
            <Route path="/receptionist/ai-assistant" element={<ReceptionistAiAssistantPage />} />
            <Route path="/receptionist/profile" element={<ReceptionistProfilePage />} />
          </Route>

          {/* Patient Role Routes */}
          <Route element={<RoleRoute allowedRoles={['ROLE_ADMIN', 'ROLE_PATIENT']} />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/profile" element={<PatientProfilePage />} />
            <Route path="/patient/appointments" element={<PatientAppointmentsPage />} />
            <Route path="/patient/book-appointment" element={<BookAppointmentPage />} />
            <Route path="/patient/medical-records" element={<PatientMedicalRecordsPage />} />
            <Route path="/patient/prescriptions" element={<PatientPrescriptionsPage />} />
            <Route path="/patient/ai-assistant" element={<PatientAiAssistantPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
