import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../services/prescriptionService';
import { patientService } from '../services/patientService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { PrintablePrescription } from '../components/prescription/PrintablePrescription';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Pill, Plus, Printer } from 'lucide-react';

export const DoctorPrescriptionsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientId: '',
    medicineName: '',
    dosage: '1 Tablet',
    frequency: 'Twice daily after meals',
    duration: '7 Days',
    instructions: 'Take with plenty of water.',
    prescriptionDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchPatients();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await prescriptionService.getPrescriptionsByDoctorId(user?.doctorId || 1);
      setPrescriptions(res || []);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.medicineName) {
      showToast('Please select a patient and enter medicine name', 'warning');
      return;
    }

    try {
      await prescriptionService.createPrescription({
        ...formData,
        doctorId: user?.doctorId || 1
      });
      showToast('Prescription issued successfully!', 'success');
      setIsModalOpen(false);
      fetchPrescriptions();
    } catch (err) {
      showToast('Failed to create prescription', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-rose-600" /> Issue Prescriptions
          </h1>
          <p className="text-xs text-slate-500 mt-1">Prescribe medication, dosage, frequency, and generate printable clinic hard-copies.</p>
        </div>

        <button
          onClick={() => {
            setFormData({
              patientId: patients[0]?.id || '',
              medicineName: '',
              dosage: '1 Tablet',
              frequency: 'Twice daily after meals',
              duration: '7 Days',
              instructions: 'Take with plenty of water.',
              prescriptionDate: new Date().toISOString().split('T')[0]
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Prescription</span>
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">Rx Code</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Medicine Name</th>
                <th className="p-4">Dosage & Frequency</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {prescriptions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-rose-600">{p.prescriptionCode}</td>
                  <td className="p-4 font-bold text-slate-900">{p.patientName}</td>
                  <td className="p-4 font-bold text-slate-800">{p.medicineName}</td>
                  <td className="p-4 text-slate-600">{p.dosage} &bull; {p.frequency}</td>
                  <td className="p-4 font-semibold text-blue-600">{p.duration}</td>
                  <td className="p-4 text-slate-500">{p.prescriptionDate}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedPrescription(p);
                        setIsPrintOpen(true);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Rx
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue New Prescription"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
            <label className="block font-semibold text-slate-700 mb-1">Medicine Name *</label>
            <input
              type="text"
              required
              value={formData.medicineName}
              onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
              placeholder="e.g. Amoxicillin 500mg"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Dosage</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
              <input
                type="text"
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              placeholder="e.g. 5 Days, 1 Month"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Special Instructions</label>
            <textarea
              rows={2}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold shadow-md">
              Issue Prescription
            </button>
          </div>
        </form>
      </Modal>

      {/* Printable Prescription Modal */}
      <Modal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        title="Printable Prescription"
        maxWidth="max-w-4xl"
      >
        <PrintablePrescription prescription={selectedPrescription} onClose={() => setIsPrintOpen(false)} />
      </Modal>
    </div>
  );
};
