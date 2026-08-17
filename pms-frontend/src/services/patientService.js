import api from './api';

export const patientService = {
  getAllPatients: async () => {
    const res = await api.get('/patients');
    return res.data;
  },

  searchPatients: async (params = {}) => {
    const res = await api.get('/patients/search', { params });
    return res.data;
  },

  getPatientById: async (id) => {
    const res = await api.get(`/patients/${id}`);
    return res.data;
  },

  getPatientByUserId: async (userId) => {
    const res = await api.get(`/patients/user/${userId}`);
    return res.data;
  },

  createPatient: async (data) => {
    const res = await api.post('/patients', data);
    return res.data;
  },

  updatePatient: async (id, data) => {
    const res = await api.put(`/patients/${id}`, data);
    return res.data;
  },

  deletePatient: async (id) => {
    const res = await api.delete(`/patients/${id}`);
    return res.data;
  }
};
