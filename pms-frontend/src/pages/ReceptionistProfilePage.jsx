import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';

export const ReceptionistProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-amber-600" /> Front-Desk Receptionist Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage your account profile and credentials.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold">
            R
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.fullName}</h2>
            <p className="text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-2 text-slate-700">
          <div><span className="font-semibold text-slate-500">Role Authorization:</span> RECEPTIONIST / FRONT-DESK</div>
          <div><span className="font-semibold text-slate-500">System Status:</span> ACTIVE</div>
        </div>
      </div>
    </div>
  );
};
