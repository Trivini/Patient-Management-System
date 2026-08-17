import React, { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Calendar, PlusCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PatientAppointmentsPage = () => {
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
      const res = await appointmentService.getAppointmentsByPatientId(user?.patientId || 1);
      setAppointments(res || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      await appointmentService.cancelAppointment(id);
      showToast('Appointment cancelled successfully.', 'info');
      fetchAppointments();
    } catch (err) {
      showToast('Failed to cancel appointment', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" /> My Booked Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">View appointment schedule and cancel active bookings.</p>
        </div>

        <Link
          to="/patient/book-appointment"
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book New Appointment</span>
        </Link>
      </div>

      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments booked" description="You have no appointments recorded." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
              <tr>
                <th className="p-4">Appt Code</th>
                <th className="p-4">Doctor & Specialization</th>
                <th className="p-4">Department</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Reason</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600">{apt.appointmentCode}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{apt.doctorName}</div>
                    <div className="text-[11px] text-slate-400">{apt.specialization}</div>
                  </td>
                  <td className="p-4 text-slate-700">{apt.departmentName}</td>
                  <td className="p-4 font-semibold text-slate-800">
                    <div>{apt.appointmentDate}</div>
                    <div className="text-[11px] text-blue-600">{apt.appointmentTime}</div>
                  </td>
                  <td className="p-4 text-slate-600 max-w-xs">{apt.reason}</td>
                  <td className="p-4">
                    <Badge status={apt.status} />
                  </td>
                  <td className="p-4 text-right">
                    {apt.status === 'BOOKED' || apt.status === 'CONFIRMED' ? (
                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="px-3 py-1 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold"
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">No actions available</span>
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
