import React, { useState, useEffect } from 'react';
import { medicalRecordService } from '../services/medicalRecordService';
import { exportService } from '../services/exportService';
import { useToast } from '../context/ToastContext';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { FileText, Search, RefreshCw, Calendar, User, Stethoscope, Download } from 'lucide-react';

export const MedicalRecordsPage = () => {
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecords();
  }, [page]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await medicalRecordService.searchMedicalRecords({
        query,
        page,
        size: 10
      });
      setRecords(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast('Failed to load medical records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchRecords();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" /> Electronic Medical Records (EMR)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Repository of clinical visit entries, symptoms, diagnoses, and follow-ups.</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by diagnosis, symptoms, record code (REC001), patient name..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Records Table */}
      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : records.length === 0 ? (
        <EmptyState title="No medical records found" description="No EMR clinical entries match your search." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Record Code</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Physician</th>
                  <th className="p-4">Visit Date</th>
                  <th className="p-4">Diagnosis</th>
                  <th className="p-4">Treatment</th>
                  <th className="p-4">Follow-up</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-teal-600">{r.recordCode}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{r.patientName}</div>
                      <div className="text-[11px] text-slate-400">{r.patientCode}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">{r.doctorName}</td>
                    <td className="p-4 text-slate-600">{r.visitDate}</td>
                    <td className="p-4 font-bold text-slate-900 max-w-xs">{r.diagnosis}</td>
                    <td className="p-4 text-slate-700 max-w-xs">{r.treatment}</td>
                    <td className="p-4 text-indigo-600 font-medium">{r.followUpDate || 'None'}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => exportService.downloadMedicalRecordPdf(r.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 text-xs font-semibold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
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
