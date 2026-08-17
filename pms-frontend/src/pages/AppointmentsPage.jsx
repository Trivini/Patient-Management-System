import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { Pagination } from '../components/common/Pagination';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Calendar, Search, Filter, RefreshCw, Clock, User, CheckCircle, XCircle } from 'lucide-react';

export const AppointmentsPage = () => {
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Status Change Modal
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedApt, setSelectedApt] = useState(null);
  const [newStatus, setNewStatus] = useState('CONFIRMED');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [page, status, doctorId, fromDate, toDate]);

  const fetchDoctors = async () => {
    try {
      const res = await doctorService.getAllDoctors();
      setDoctors(res || []);
    } catch (err) {
      console.warn('Error loading doctors:', err);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.searchAppointments({
        query,
        status: status || null,
        doctorId: doctorId || null,
        fromDate: fromDate || null,
        toDate: toDate || null,
        page,
        size: 10
      });
      setAppointments(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchAppointments();
  };

  const handleOpenStatus = (apt) => {
    setSelectedApt(apt);
    setNewStatus(apt.status || 'CONFIRMED');
    setIsStatusOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApt) return;
    try {
      await appointmentService.updateAppointmentStatus(selectedApt.id, newStatus);
      showToast(`Appointment ${selectedApt.appointmentCode} updated to ${newStatus}!`, 'success');
      setIsStatusOpen(false);
      fetchAppointments();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-600" /> Appointment Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review, confirm, complete, or reschedule patient bookings across all clinic departments.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search code (APT001), patient, doctor..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 transition-colors">
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full lg:w-auto">
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="BOOKED">BOOKED</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            value={doctorId}
            onChange={(e) => { setDoctorId(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700"
          >
            <option value="">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700"
            title="From Date"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setPage(0); }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700"
            title="To Date"
          />
        </div>

        {(query || status || doctorId || fromDate || toDate) && (
          <button
            onClick={() => {
              setQuery(''); setStatus(''); setDoctorId(''); setFromDate(''); setToDate(''); setPage(0);
            }}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
            title="Clear filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments found" description="No appointment records match your criteria." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Appt Code</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor & Dept</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Reason</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {appointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-600">{apt.appointmentCode}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-400">{apt.patientCode} &bull; {apt.patientPhone}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{apt.departmentName}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      <div>{apt.appointmentDate}</div>
                      <div className="text-[11px] text-blue-600">{apt.appointmentTime}</div>
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs truncate">{apt.reason}</td>
                    <td className="p-4">
                      <Badge status={apt.status} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenStatus(apt)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                      >
                        Update Status
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

      {/* Update Status Modal */}
      <Modal
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        title={`Update Status: ${selectedApt?.appointmentCode}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Appointment Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
            >
              <option value="BOOKED">BOOKED (Pending)</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="NO_SHOW">NO_SHOW</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsStatusOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold shadow-md">
              Save Status
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
