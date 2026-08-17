import api from './api';

export const aiService = {
  chat: async (prompt, conversationId = null) => {
    const res = await api.post('/ai/chat', { prompt, conversationId });
    return res.data;
  },

  getPatientSummary: async (patientId) => {
    const res = await api.post('/ai/patient-summary', { patientId });
    return res.data;
  },

  recommendSlots: async (queryData) => {
    const res = await api.post('/ai/appointment-assistant', queryData);
    return res.data;
  },

  doctorCopilot: async (rawNotes, patientId = null) => {
    const res = await api.post('/ai/doctor-copilot', { rawNotes, patientId });
    return res.data;
  }
};
