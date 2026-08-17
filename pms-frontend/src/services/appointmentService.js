import api from './api';

export const appointmentService = {
  searchAppointments: async (params = {}) => {
    const res = await api.get('/appointments', { params });
    return res.data;
  },

  getAppointmentById: async (id) => {
    const res = await api.get(`/appointments/${id}`);
    return res.data;
  },

  getAppointmentsByPatientId: async (patientId) => {
    const res = await api.get(`/appointments/patient/${patientId}`);
    return res.data;
  },

  getAppointmentsByDoctorId: async (doctorId) => {
    const res = await api.get(`/appointments/doctor/${doctorId}`);
    return res.data;
  },

  getAvailableSlots: async (doctorId, date) => {
    const res = await api.get('/appointments/available-slots', { params: { doctorId, date } });
    return res.data;
  },

  createAppointment: async (data) => {
    const res = await api.post('/appointments', data);
    return res.data;
  },

  updateAppointment: async (id, data) => {
    const res = await api.put(`/appointments/${id}`, data);
    return res.data;
  },

  updateAppointmentStatus: async (id, status) => {
    const res = await api.patch(`/appointments/${id}/status`, { status });
    return res.data;
  },

  cancelAppointment: async (id) => {
    const res = await api.delete(`/appointments/${id}`);
    return res.data;
  }
};
