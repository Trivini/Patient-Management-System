import React, { useState, useEffect } from 'react';
import { medicalRecordService } from '../services/medicalRecordService';
import { patientService } from '../services/patientService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { AiCopilotDrawer } from '../components/ai/AiCopilotDrawer';
import { FileText, Plus, Search, Sparkles } from 'lucide-react';

export const DoctorMedicalRecordsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    visitDate: new Date().toISOString().split('T')[0],
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    followUpDate: ''
  });

  useEffect(() => {
    fetchRecords();
    fetchPatients();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await medicalRecordService.getMedicalRecordsByDoctorId(user?.doctorId || 1);
      setRecords(res || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await patientService.getAllPatients();
      setPatients(res || []);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleApplyAiDraft = (draftData) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: draftData.symptoms || prev.symptoms,
      diagnosis: draftData.diagnosis || prev.diagnosis,
      treatment: draftData.treatment || prev.treatment,
      notes: draftData.notes || prev.notes
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.diagnosis || !formData.symptoms) {
      showToast('Please fill in required fields (Patient, Symptoms, Diagnosis)', 'warning');
      return;
    }

    try {
      await medicalRecordService.createMedicalRecord({
        ...formData,
        doctorId: user?.doctorId || 1
      });
      showToast('Medical record created successfully!', 'success');
      setIsModalOpen(false);
      fetchRecords();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save medical record', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" /> Create & Manage Medical Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">Record clinical observations, diagnoses, treatments, and follow-up dates.</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              patientId: patients[0]?.id || '',
              visitDate: new Date().toISOString().split('T')[0],
              symptoms: '',
              diagnosis: '',
              treatment: '',
              notes: '',
              followUpDate: ''
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-500/20 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Clinical Entry</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">Record Code</th>
                <th className="p-4">Patient</th>
                <th className="p-4">Visit Date</th>
                <th className="p-4">Symptoms</th>
                <th className="p-4">Diagnosis</th>
                <th className="p-4">Treatment</th>
                <th className="p-4">Follow-up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-teal-600">{r.recordCode}</td>
                  <td className="p-4 font-bold text-slate-900">{r.patientName}</td>
                  <td className="p-4 text-slate-600">{r.visitDate}</td>
                  <td className="p-4 text-slate-700 max-w-xs truncate">{r.symptoms}</td>
                  <td className="p-4 font-bold text-slate-900 max-w-xs">{r.diagnosis}</td>
                  <td className="p-4 text-slate-700 max-w-xs">{r.treatment}</td>
                  <td className="p-4 font-semibold text-blue-600">{r.followUpDate || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Medical Record Modal with AI Copilot Drawer */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Clinical Medical Record"
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          {/* Embedded AI Copilot Assistant */}
          <AiCopilotDrawer patientId={formData.patientId} onApplyToRecord={handleApplyAiDraft} />

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  required
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="">Choose Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.patientCode})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Visit Date *</label>
                <input
                  type="date"
                  required
                  value={formData.visitDate}
                  onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Symptoms *</label>
              <textarea
                rows={2}
                required
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                placeholder="Observed symptoms & chief complaints..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Diagnosis *</label>
              <input
                type="text"
                required
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                placeholder="e.g. Acute Bronchitis, Essential Hypertension"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prescribed Treatment / Advice</label>
              <textarea
                rows={2}
                value={formData.treatment}
                onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                placeholder="Treatment plan, advice, diet..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
              >
                Cancel
              </button>
              <button type="submit" className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold shadow-md">
                Save Medical Record
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
