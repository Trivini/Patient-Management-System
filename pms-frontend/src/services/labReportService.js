import api from './api';

export const labReportService = {
  getLabReportsByPatient: async (patientId) => {
    const response = await api.get(`/lab-reports/patient/${patientId}`);
    return response.data;
  },

  uploadLabReport: async (patientId, formData) => {
    const response = await api.post(`/lab-reports/upload/patient/${patientId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadLabReport: async (reportId, fileName) => {
    const response = await api.get(`/lab-reports/download/${reportId}`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || `Lab_Report_${reportId}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
