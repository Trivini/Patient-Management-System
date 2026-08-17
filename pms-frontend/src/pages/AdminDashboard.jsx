import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import {
  Users,
  UserCheck,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Link } from 'react-router-dom';
import { exportService } from '../services/exportService';
import { Download, FileSpreadsheet } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await dashboardService.getAdminDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton count={4} type="card" />;
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 p-6 rounded-3xl text-white shadow-xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Admin Executive Command Center</h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            Real database analytics, system audit logs, and operational clinic workload metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportService.downloadAppointmentsExcel()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel Audit</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>System Health: 100%</span>
          </div>
        </div>
      </div>

      {/* Top 8 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Patients" value={data?.totalPatients ?? 0} icon={Users} color="blue" description="Registered patient database" />
        <StatCard title="Active Doctors" value={data?.totalDoctors ?? 0} icon={UserCheck} color="emerald" description="Staff & specialists" />
        <StatCard title="Total Appointments" value={data?.totalAppointments ?? 0} icon={Calendar} color="purple" description="Lifetime bookings" />
        <StatCard title="Today's Intake" value={data?.todaysAppointments ?? 0} icon={Clock} color="amber" description="Scheduled today" />
        <StatCard title="Active Patients" value={data?.activePatients ?? 0} icon={Activity} color="indigo" description="Current active status" />
        <StatCard title="Pending Bookings" value={data?.pendingAppointments ?? 0} icon={Clock} color="amber" description="Awaiting confirmation" />
        <StatCard title="Completed Consults" value={data?.completedAppointments ?? 0} icon={CheckCircle} color="emerald" description="Finished appointments" />
        <StatCard title="Cancelled" value={data?.cancelledAppointments ?? 0} icon={XCircle} color="rose" description="Cancelled or no-show" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Appointment Trend Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Monthly Appointment Velocity
              </h3>
              <p className="text-xs text-slate-500">Recorded bookings across calendar months (Current Year)</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.monthlyAppointments || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor Workload Bar Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Doctor Workload Distribution</h3>
            <p className="text-xs text-slate-500">Consultation volume by doctor</p>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.doctorWorkload || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="doctorName" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={90} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="appointmentCount" fill="#4f46e5" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables: Recent Appointments & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Recent Appointments</h3>
            <Link to="/admin/appointments" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Doctor</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recentAppointments?.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-mono font-semibold text-slate-900">{apt.appointmentCode}</td>
                    <td className="p-3 font-medium text-slate-800">{apt.patientName}</td>
                    <td className="p-3 text-slate-600">{apt.doctorName}</td>
                    <td className="p-3 text-slate-500">{apt.appointmentDate}</td>
                    <td className="p-3">
                      <Badge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit Activity */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Recent Audit Logs</h3>
            <Link to="/admin/audit-logs" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Audit Logs <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentAuditLogs?.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span className="text-blue-600">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ''}</span>
                </div>
                <div className="text-slate-600 truncate">{log.details}</div>
                <div className="text-[10px] text-slate-400">By: {log.userEmail} ({log.userRole})</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
