import api from './api';

export const prescriptionService = {
  searchPrescriptions: async (params = {}) => {
    const res = await api.get('/prescriptions', { params });
    return res.data;
  },

  getPrescriptionById: async (id) => {
    const res = await api.get(`/prescriptions/${id}`);
    return res.data;
  },

  getPrescriptionsByPatientId: async (patientId) => {
    const res = await api.get(`/prescriptions/patient/${patientId}`);
    return res.data;
  },

  createPrescription: async (data) => {
    const res = await api.post('/prescriptions', data);
    return res.data;
  },

  updatePrescription: async (id, data) => {
    const res = await api.put(`/prescriptions/${id}`, data);
    return res.data;
  }
};
