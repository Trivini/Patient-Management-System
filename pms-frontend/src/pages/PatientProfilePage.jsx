import React, { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Heart, ShieldAlert, Calendar } from 'lucide-react';

export const PatientProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (user?.patientId) {
        const res = await patientService.getPatientById(user.patientId);
        setProfile(res);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" /> Patient Personal Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">Personal health information, contact details, and emergency contacts.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold border border-blue-200">
            {profile?.firstName ? profile.firstName.charAt(0) : 'P'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.fullName}</h2>
            <p className="text-xs text-blue-600 font-mono font-semibold">Patient Code: {profile?.patientCode || 'PAT001'}</p>
            <p className="text-xs text-slate-400 mt-0.5">{profile?.email || user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Demographics</span>
            <div><span className="font-semibold text-slate-600">Gender:</span> {profile?.gender || 'Male'}</div>
            <div><span className="font-semibold text-slate-600">Age:</span> {profile?.age || 30} Years</div>
            <div><span className="font-semibold text-slate-600">Blood Group:</span> {profile?.bloodGroup || 'O+'}</div>
            <div><span className="font-semibold text-slate-600">DOB:</span> {profile?.dateOfBirth || '1995-01-01'}</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Contact & Emergency</span>
            <div><span className="font-semibold text-slate-600">Phone:</span> {profile?.phone || '+1 555-0105'}</div>
            <div><span className="font-semibold text-slate-600">Emergency Contact:</span> {profile?.emergencyContactName || 'N/A'} ({profile?.emergencyContactPhone || 'N/A'})</div>
            <div><span className="font-semibold text-slate-600">Allergies:</span> {profile?.allergies || 'None recorded'}</div>
            <div><span className="font-semibold text-slate-600">Conditions:</span> {profile?.existingConditions || 'None recorded'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
