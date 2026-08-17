import React from 'react';
import { Printer, Pill, Stethoscope, Building2, Calendar, FileText } from 'lucide-react';

export const PrintablePrescription = ({ prescription, onClose }) => {
  if (!prescription) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden during print) */}
      <div className="no-print flex items-center justify-between p-4 bg-slate-100 rounded-2xl border border-slate-200">
        <span className="text-xs font-semibold text-slate-700">Official Electronic Health Prescription</span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Prescription</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div
        id="printable-prescription"
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 max-w-3xl mx-auto"
      >
        {/* Clinic Header */}
        <div className="flex items-center justify-between border-b-2 border-blue-600 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
              M
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">MediFlow Healthcare Center</h1>
              <p className="text-xs text-slate-500">100 Health Boulevard, Medical District, NY 10001 &bull; Tel: +1 555-0100</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">Rx Prescription</div>
            <div className="text-xs font-mono font-semibold text-slate-700 mt-1">{prescription.prescriptionCode}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Date: {prescription.prescriptionDate}</div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Patient Information</span>
            <div className="font-bold text-slate-900 text-sm">{prescription.patientName}</div>
            <div className="text-slate-600">ID: {prescription.patientCode} &bull; Age: {prescription.patientAge || 'N/A'} yrs &bull; Gender: {prescription.patientGender}</div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Prescribing Doctor</span>
            <div className="font-bold text-slate-900 text-sm">{prescription.doctorName}</div>
            <div className="text-slate-600">{prescription.doctorSpecialization || 'General Physician'}</div>
          </div>
        </div>

        {/* Rx Symbol & Medication Table */}
        <div>
          <div className="text-2xl font-serif font-bold text-blue-600 mb-3 font-mono">Rx</div>
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Medicine Name</th>
                  <th className="p-3">Dosage</th>
                  <th className="p-3">Frequency</th>
                  <th className="p-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="bg-white">
                  <td className="p-3 font-bold text-slate-900">{prescription.medicineName}</td>
                  <td className="p-3">{prescription.dosage}</td>
                  <td className="p-3">{prescription.frequency}</td>
                  <td className="p-3 font-semibold text-blue-700">{prescription.duration}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Special Instructions */}
        {prescription.instructions && (
          <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl text-xs text-amber-900">
            <span className="font-bold block mb-1 uppercase tracking-wider text-[11px] text-amber-800">Special Instructions</span>
            <p className="leading-relaxed">{prescription.instructions}</p>
          </div>
        )}

        {/* Doctor Signature Line */}
        <div className="pt-12 flex items-end justify-between text-xs">
          <div className="text-[11px] text-slate-400">
            * This is a computer-generated prescription valid under MediFlow PMS.
          </div>
          <div className="text-center">
            <div className="w-48 border-b-2 border-slate-400 mb-1 font-serif italic text-slate-700 text-sm">
              {prescription.doctorName}
            </div>
            <span className="text-[11px] font-semibold text-slate-500">Authorized Physician Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};
