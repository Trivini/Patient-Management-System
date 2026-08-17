import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export const DoctorAppointmentsPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getAppointmentsByDoctorId(user?.doctorId || 1);
      setAppointments(res || []);
    } catch (err) {
      showToast('Failed to fetch doctor appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status);
      showToast(`Appointment status updated to ${status}!`, 'success');
      fetchAppointments();
    } catch (err) {
      showToast('Failed to update appointment status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-emerald-600" /> My Doctor Schedule & Bookings
        </h1>
        <p className="text-xs text-slate-500 mt-1">Review assigned patient appointments and update consultation status.</p>
      </div>

      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments found" description="You have no assigned appointments." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">Appt Code</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Reason for Visit</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-600">{apt.appointmentCode}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{apt.patientName}</div>
                    <div className="text-[11px] text-slate-400">{apt.patientPhone}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-800">
                    <div>{apt.appointmentDate}</div>
                    <div className="text-[11px] text-blue-600">{apt.appointmentTime}</div>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs">{apt.reason}</td>
                  <td className="p-4">
                    <Badge status={apt.status} />
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {apt.status !== 'COMPLETED' && (
                      <button
                        onClick={() => handleStatusChange(apt.id, 'COMPLETED')}
                        className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-xs"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
