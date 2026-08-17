import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../services/prescriptionService';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/common/Modal';
import { PrintablePrescription } from '../components/prescription/PrintablePrescription';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Pill, Printer } from 'lucide-react';

export const PatientPrescriptionsPage = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await prescriptionService.getPrescriptionsByPatientId(user?.patientId || 1);
      setPrescriptions(res || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (pres) => {
    setSelectedPrescription(pres);
    setIsPrintOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Pill className="w-6 h-6 text-rose-600" /> My Prescriptions
        </h1>
        <p className="text-xs text-slate-500 mt-1">View active medication instructions or print official hard-copies.</p>
      </div>

      {loading ? (
        <LoadingSkeleton count={4} type="table" />
      ) : prescriptions.length === 0 ? (
        <EmptyState title="No active prescriptions" description="You have no recorded prescriptions." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">Rx Code</th>
                <th className="p-4">Prescribing Doctor</th>
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
                  <td className="p-4 font-bold text-slate-900">{p.doctorName}</td>
                  <td className="p-4 font-bold text-slate-800">{p.medicineName}</td>
                  <td className="p-4 text-slate-600">{p.dosage} &bull; {p.frequency}</td>
                  <td className="p-4 font-semibold text-blue-600">{p.duration}</td>
                  <td className="p-4 text-slate-500">{p.prescriptionDate}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handlePrint(p)}
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
