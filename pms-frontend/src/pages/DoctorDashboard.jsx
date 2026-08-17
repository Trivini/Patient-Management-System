import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, CheckCircle, Clock, Stethoscope, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getDoctorDashboard(user?.doctorId);
      setData(res);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Welcome, {data?.doctorName || user?.fullName}!</h1>
          <p className="text-xs sm:text-sm text-teal-200 mt-1">
            Specialization: <span className="font-semibold text-white">{data?.specialization}</span> &bull; Clinical Practice Workspace
          </p>
        </div>

        <Link
          to="/doctor/ai-assistant"
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 w-fit transition-all"
        >
          <Stethoscope className="w-4 h-4 text-emerald-400" />
          <span>Open AI Clinical Copilot</span>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Appointments" value={data?.todaysAppointments ?? 0} icon={Clock} color="amber" description="Consultations scheduled today" />
        <StatCard title="Upcoming Bookings" value={data?.upcomingAppointments ?? 0} icon={Calendar} color="purple" description="Upcoming schedule" />
        <StatCard title="Assigned Patients" value={data?.assignedPatientsCount ?? 0} icon={Users} color="blue" description="Under your care" />
        <StatCard title="Completed Consults" value={data?.completedConsultations ?? 0} icon={CheckCircle} color="emerald" description="Finished visits" />
      </div>

      {/* Today's Schedule & Patient List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Today's Consultation Schedule</h3>
            <Link to="/doctor/appointments" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1">
              View Schedule <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {data?.todaysAppointmentsList?.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No appointments scheduled for today.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Patient</th>
                    <th className="p-3">Reason</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {data?.todaysAppointmentsList?.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-bold text-emerald-600">{apt.appointmentTime}</td>
                      <td className="p-3 font-bold text-slate-900">{apt.patientName}</td>
                      <td className="p-3 text-slate-600 max-w-xs truncate">{apt.reason}</td>
                      <td className="p-3">
                        <Badge status={apt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Assigned Patients Summary */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Recent Patients</h3>
          <div className="space-y-3">
            {data?.recentAssignedPatients?.map((p) => (
              <div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-900">{p.firstName} {p.lastName}</div>
                <div className="text-[11px] text-slate-500">Age: {p.age || 'N/A'} yrs &bull; Blood: {p.bloodGroup || 'N/A'}</div>
                <div className="text-[11px] text-slate-400">{p.phone} &bull; {p.email}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
