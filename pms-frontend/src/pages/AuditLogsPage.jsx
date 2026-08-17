import React, { useState, useEffect } from 'react';
import { auditLogService } from '../services/auditLogService';
import { useToast } from '../context/ToastContext';
import { Pagination } from '../components/common/Pagination';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ShieldAlert, Search, RefreshCw, Filter } from 'lucide-react';

export const AuditLogsPage = () => {
  const { showToast } = useToast();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [module, setModule] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [page, module]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await auditLogService.searchLogs({
        module: module || null,
        query: query || null,
        page,
        size: 15
      });
      setLogs(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast('Failed to fetch audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchLogs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" /> System Audit & Security Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">Immutable audit trails tracking logins, record creation, AI prompts, and admin changes.</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by action, user email, IP address, details..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 transition-colors">
            Search
          </button>
        </form>

        <select
          value={module}
          onChange={(e) => { setModule(e.target.value); setPage(0); }}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700 w-full sm:w-auto"
        >
          <option value="">All Modules</option>
          <option value="AUTH">AUTH</option>
          <option value="AI">AI</option>
          <option value="PATIENT">PATIENT</option>
          <option value="APPOINTMENT">APPOINTMENT</option>
        </select>
      </div>

      {/* Logs Table */}
      {loading ? (
        <LoadingSkeleton count={6} type="table" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Details</th>
                  <th className="p-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono text-slate-500">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{log.userEmail}</div>
                      <div className="text-[10px] text-slate-400">{log.userRole}</div>
                    </td>
                    <td className="p-4 font-bold text-blue-600">{log.action}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] text-slate-700">
                        {log.module}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 max-w-xs truncate">{log.details}</td>
                    <td className="p-4 font-mono text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
        </div>
      )}
    </div>
  );
};
