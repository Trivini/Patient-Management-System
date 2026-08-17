import React, { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';
import { Calendar, FileText, Pill, PlusCircle, Clock, ChevronRight, Stethoscope, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PatientVitalsWidget } from '../components/PatientVitalsWidget';
import { LabReportsSection } from '../components/LabReportsSection';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getPatientDashboard(user?.patientId);
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
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-sky-950 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Welcome, {user?.fullName}!</h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1">
            Patient Portal &bull; Patient ID: <span className="font-mono font-bold text-white">{data?.patientInfo?.patientCode || 'PAT001'}</span>
          </p>
        </div>

        <Link
          to="/patient/book-appointment"
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Book Appointment</span>
        </Link>
      </div>

      {/* Next Upcoming Appointment Widget */}
      {data?.nextUpcomingAppointment ? (
        <div className="bg-white p-5 rounded-3xl border-2 border-blue-500/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest">Next Upcoming Appointment</span>
              <h3 className="text-base font-bold text-slate-900">{data.nextUpcomingAppointment.doctorName}</h3>
              <p className="text-xs text-slate-500">{data.nextUpcomingAppointment.departmentName} &bull; {data.nextUpcomingAppointment.reason}</p>
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-900">{data.nextUpcomingAppointment.appointmentDate}</div>
            <div className="text-xs font-bold text-blue-600">{data.nextUpcomingAppointment.appointmentTime}</div>
            <Badge status={data.nextUpcomingAppointment.status} />
          </div>
        </div>
      ) : (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between text-xs text-slate-600">
          <span>You have no upcoming appointments scheduled.</span>
          <Link to="/patient/book-appointment" className="font-bold text-blue-600 hover:underline">
            Book Now &rarr;
          </Link>
        </div>
      )}

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Appointments" value={data?.totalAppointments ?? 0} icon={Calendar} color="blue" description="All-time visits" />
        <StatCard title="Medical Records" value={data?.medicalRecordCount ?? 0} icon={FileText} color="teal" description="Clinical record entries" />
        <StatCard title="Prescriptions" value={data?.prescriptionCount ?? 0} icon={Pill} color="rose" description="Prescribed medications" />
      </div>

      {/* Patient Vitals & Lab Attachments */}
      {data?.patientInfo?.id && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatientVitalsWidget patientId={data.patientInfo.id} />
          <LabReportsSection patientId={data.patientInfo.id} />
        </div>
      )}

      {/* Recent Records & Prescriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Medical History */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">My Medical Records</h3>
            <Link to="/patient/medical-records" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
              View Records <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentRecords?.slice(0, 3).map((r) => (
              <div key={r.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-900">{r.recordCode} &bull; {r.visitDate}</div>
                <div className="text-slate-600">Diagnosis: <span className="font-semibold text-slate-900">{r.diagnosis}</span></div>
                <div className="text-slate-500 text-[11px]">Doctor: {r.doctorName}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Active Prescriptions</h3>
            <Link to="/patient/prescriptions" className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1">
              My Prescriptions <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data?.activePrescriptions?.slice(0, 3).map((pres) => (
              <div key={pres.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs space-y-1">
                <div className="font-bold text-slate-900">{pres.medicineName}</div>
                <div className="text-slate-600">{pres.dosage} &bull; {pres.frequency} ({pres.duration})</div>
                <div className="text-[11px] text-slate-400">Prescribed: {pres.prescriptionDate}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
