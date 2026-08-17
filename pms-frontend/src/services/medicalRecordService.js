import api from './api';

export const medicalRecordService = {
  searchMedicalRecords: async (params = {}) => {
    const res = await api.get('/medical-records', { params });
    return res.data;
  },

  getMedicalRecordById: async (id) => {
    const res = await api.get(`/medical-records/${id}`);
    return res.data;
  },

  getMedicalRecordsByPatientId: async (patientId) => {
    const res = await api.get(`/medical-records/patient/${patientId}`);
    return res.data;
  },

  createMedicalRecord: async (data) => {
    const res = await api.post('/medical-records', data);
    return res.data;
  },

  updateMedicalRecord: async (id, data) => {
    const res = await api.put(`/medical-records/${id}`, data);
    return res.data;
  }
};
