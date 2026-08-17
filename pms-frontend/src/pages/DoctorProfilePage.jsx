import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Stethoscope, Clock, Award } from 'lucide-react';

export const DoctorProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (user?.doctorId) {
        const doc = await doctorService.getDoctorById(user.doctorId);
        setProfile(doc);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-600" /> Physician Profile & Credentials
        </h1>
        <p className="text-xs text-slate-500 mt-1">Your registered medical credentials, consultation fee, and availability.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold border border-emerald-200">
            Dr
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile?.firstName ? `Dr. ${profile.firstName} ${profile.lastName}` : user?.fullName}</h2>
            <p className="text-xs text-emerald-700 font-semibold">{profile?.specialization || 'Physician Specialist'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{profile?.email || user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Qualifications & Experience</span>
            <div><span className="font-semibold text-slate-600">Degrees:</span> {profile?.qualification || 'MD'}</div>
            <div><span className="font-semibold text-slate-600">Experience:</span> {profile?.experienceYears || 10} Years</div>
            <div><span className="font-semibold text-slate-600">Department:</span> {profile?.departmentName || 'Cardiology'}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Consultation Info</span>
            <div><span className="font-semibold text-slate-600">Fee:</span> ${profile?.consultationFee || 150}</div>
            <div><span className="font-semibold text-slate-600">Hours:</span> {profile?.availabilityHours || 'Mon-Fri 09:00 AM - 05:00 PM'}</div>
            <div><span className="font-semibold text-slate-600">Phone:</span> {profile?.phone || '+1 555-0101'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
