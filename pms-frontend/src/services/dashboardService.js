import api from './api';

export const dashboardService = {
  getAdminDashboard: async () => {
    const res = await api.get('/dashboard/admin');
    return res.data;
  },

  getDoctorDashboard: async (doctorId = null) => {
    const res = await api.get('/dashboard/doctor', { params: doctorId ? { doctorId } : {} });
    return res.data;
  },

  getReceptionistDashboard: async () => {
    const res = await api.get('/dashboard/receptionist');
    return res.data;
  },

  getPatientDashboard: async (patientId = null) => {
    const res = await api.get('/dashboard/patient', { params: patientId ? { patientId } : {} });
    return res.data;
  }
};
