import api from './api';

export const vitalsService = {
  getPatientVitals: async (patientId) => {
    const response = await api.get(`/vitals/patient/${patientId}`);
    return response.data;
  },

  addPatientVitals: async (patientId, vitalsData) => {
    const response = await api.post(`/vitals/patient/${patientId}`, vitalsData);
    return response.data;
  },
};
