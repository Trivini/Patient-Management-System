import api from './api';

export const exportService = {
  downloadPrescriptionPdf: async (id) => {
    const response = await api.get(`/export/prescriptions/${id}/pdf`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Prescription_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  downloadMedicalRecordPdf: async (id) => {
    const response = await api.get(`/export/medical-records/${id}/pdf`, {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `MedicalRecord_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  downloadAppointmentsExcel: async () => {
    const response = await api.get('/export/appointments/excel', {
      responseType: 'blob',
    });
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Appointments_Report.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
