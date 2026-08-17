import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../services/prescriptionService';
import { exportService } from '../services/exportService';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { Pagination } from '../components/common/Pagination';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { PrintablePrescription } from '../components/prescription/PrintablePrescription';
import { Pill, Search, Printer, Eye, Download } from 'lucide-react';

export const PrescriptionsPage = () => {
  const { showToast } = useToast();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, [page]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const res = await prescriptionService.searchPrescriptions({
        query,
        page,
        size: 10
      });
      setPrescriptions(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast('Failed to load prescriptions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPrescriptions();
  };

  const handlePrintClick = (pres) => {
    setSelectedPrescription(pres);
    setIsPrintOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-rose-600" /> Electronic Prescriptions
          </h1>
          <p className="text-xs text-slate-500 mt-1">Pharmacy medication records and printable patient hard copies.</p>
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
              placeholder="Search medicine name, prescription code (PRE001), patient..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : prescriptions.length === 0 ? (
        <EmptyState title="No prescriptions found" description="No prescription records match your query." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Rx Code</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Physician</th>
                  <th className="p-4">Medicine & Dosage</th>
                  <th className="p-4">Frequency & Duration</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {prescriptions.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-rose-600">{p.prescriptionCode}</td>
                    <td className="p-4 font-bold text-slate-900">{p.patientName}</td>
                    <td className="p-4 font-semibold text-slate-800">{p.doctorName}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{p.medicineName}</div>
                      <div className="text-[11px] text-slate-500">{p.dosage}</div>
                    </td>
                    <td className="p-4 text-slate-600">{p.frequency} &bull; {p.duration}</td>
                    <td className="p-4 text-slate-500">{p.prescriptionDate}</td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => exportService.downloadPrescriptionPdf(p.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                      <button
                        onClick={() => handlePrintClick(p)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Rx
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

      {/* Printable Modal */}
      <Modal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        title="Printable Rx Prescription"
        maxWidth="max-w-4xl"
      >
        <PrintablePrescription prescription={selectedPrescription} onClose={() => setIsPrintOpen(false)} />
      </Modal>
    </div>
  );
};
