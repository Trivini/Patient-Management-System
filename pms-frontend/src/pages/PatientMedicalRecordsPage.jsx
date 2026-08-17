import React, { useState, useEffect } from 'react';
import { medicalRecordService } from '../services/medicalRecordService';
import { useAuth } from '../context/AuthContext';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { AiSummaryCard } from '../components/ai/AiSummaryCard';
import { FileText } from 'lucide-react';

export const PatientMedicalRecordsPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await medicalRecordService.getMedicalRecordsByPatientId(user?.patientId || 1);
      setRecords(res || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-teal-600" /> My Medical Records
        </h1>
        <p className="text-xs text-slate-500 mt-1">Review recorded clinical visit diagnoses, doctor treatments, and follow-up notes.</p>
      </div>

      {/* AI Summary Card for Patient */}
      <AiSummaryCard patientId={user?.patientId || 1} patientName={user?.fullName} />

      {loading ? (
        <LoadingSkeleton count={4} type="table" />
      ) : records.length === 0 ? (
        <EmptyState title="No medical records found" description="You have no recorded clinical visits." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">Record Code</th>
                <th className="p-4">Visit Date</th>
                <th className="p-4">Attending Doctor</th>
                <th className="p-4">Symptoms</th>
                <th className="p-4">Diagnosis</th>
                <th className="p-4">Treatment Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-teal-600">{r.recordCode}</td>
                  <td className="p-4 text-slate-600">{r.visitDate}</td>
                  <td className="p-4 font-bold text-slate-900">{r.doctorName}</td>
                  <td className="p-4 text-slate-700 max-w-xs">{r.symptoms}</td>
                  <td className="p-4 font-bold text-slate-900 max-w-xs">{r.diagnosis}</td>
                  <td className="p-4 text-slate-700 max-w-xs">{r.treatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
