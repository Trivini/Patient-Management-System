import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Clock, UserPlus, Calendar, CheckCircle, Stethoscope, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReceptionistDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getReceptionistDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton count={4} type="card" />;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Receptionist Front-Desk Desk</h1>
          <p className="text-xs sm:text-sm text-amber-200 mt-1">
            Patient registration intake, doctor schedule lookup, and appointment management.
          </p>
        </div>

        <Link
          to="/receptionist/patients"
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 w-fit transition-all"
        >
          <UserPlus className="w-4 h-4 text-amber-300" />
          <span>Patient Intake Registration</span>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Appointments" value={data?.todaysAppointments ?? 0} icon={Clock} color="amber" description="Intake schedule today" />
        <StatCard title="New Patients Today" value={data?.newPatientsToday ?? 0} icon={UserPlus} color="blue" description="Registered today" />
        <StatCard title="Pending Appointments" value={data?.pendingAppointments ?? 0} icon={Calendar} color="purple" description="Awaiting check-in" />
        <StatCard title="Completed Consults" value={data?.completedAppointments ?? 0} icon={CheckCircle} color="emerald" description="Finished visits" />
      </div>

      {/* Schedule & Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Intake Schedule */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Today's Patient Schedule</h3>
            <Link to="/receptionist/appointments" className="text-xs font-semibold text-amber-600 hover:underline flex items-center gap-1">
              Manage Bookings <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {data?.todaysSchedule?.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-bold text-amber-600">{apt.appointmentTime}</td>
                    <td className="p-3 font-bold text-slate-900">{apt.patientName}</td>
                    <td className="p-3 text-slate-700">{apt.doctorName}</td>
                    <td className="p-3">
                      <Badge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* On-Duty Doctors */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-600" /> Doctors On Duty
          </h3>
          <div className="space-y-3">
            {data?.availableDoctors?.map((d) => (
              <div key={d.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Dr. {d.firstName} {d.lastName}</div>
                  <div className="text-[11px] text-slate-500">{d.specialization} &bull; {d.departmentName}</div>
                </div>
                <Badge status={d.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
