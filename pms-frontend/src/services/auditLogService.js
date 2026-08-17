import api from './api';

export const auditLogService = {
  getRecentLogs: async () => {
    const res = await api.get('/audit-logs/recent');
    return res.data;
  },

  searchLogs: async (params = {}) => {
    const res = await api.get('/audit-logs', { params });
    return res.data;
  }
};
