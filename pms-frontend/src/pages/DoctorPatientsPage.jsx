import React, { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Users, Eye, Search } from 'lucide-react';
import { AiSummaryCard } from '../components/ai/AiSummaryCard';
import { Modal } from '../components/common/Modal';

export const DoctorPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientService.getAllPatients();
      setPatients(res || []);
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
          <Users className="w-6 h-6 text-blue-600" /> Assigned Patient Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">Review medical records, allergies, existing conditions, and generate AI summaries.</p>
      </div>

      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">Code</th>
                <th className="p-4">Name</th>
                <th className="p-4">Age / Gender</th>
                <th className="p-4">Blood Group</th>
                <th className="p-4">Allergies</th>
                <th className="p-4">Existing Conditions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {patients.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600">{p.patientCode}</td>
                  <td className="p-4 font-bold text-slate-900">{p.firstName} {p.lastName}</td>
                  <td className="p-4 text-slate-700">{p.age || 'N/A'} yrs &bull; {p.gender}</td>
                  <td className="p-4 font-bold text-slate-800">{p.bloodGroup || 'N/A'}</td>
                  <td className="p-4 text-slate-600">{p.allergies || 'None'}</td>
                  <td className="p-4 text-slate-600">{p.existingConditions || 'None'}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedPatient(p);
                        setIsDetailOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" /> View Profile & AI Summary
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Patient Medical Summary: ${selectedPatient?.firstName} ${selectedPatient?.lastName}`}
        maxWidth="max-w-3xl"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <AiSummaryCard patientId={selectedPatient.id} patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`} />
          </div>
        )}
      </Modal>
    </div>
  );
};
