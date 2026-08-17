import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Calendar,
  FileText,
  Pill,
  Bot,
  ShieldAlert,
  Settings,
  LogOut,
  User,
  PlusCircle,
  Stethoscope,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case 'ROLE_ADMIN':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Patients', path: '/admin/patients', icon: Users },
          { label: 'Doctors', path: '/admin/doctors', icon: UserCheck },
          { label: 'Departments', path: '/admin/departments', icon: Building2 },
          { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
          { label: 'Medical Records', path: '/admin/medical-records', icon: FileText },
          { label: 'Prescriptions', path: '/admin/prescriptions', icon: Pill },
          { label: 'Users', path: '/admin/users', icon: User },
          { label: 'AI Assistant', path: '/admin/ai-assistant', icon: Bot },
          { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
          { label: 'Settings', path: '/admin/settings', icon: Settings },
        ];
      case 'ROLE_DOCTOR':
        return [
          { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
          { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
          { label: 'Assigned Patients', path: '/doctor/patients', icon: Users },
          { label: 'Medical Records', path: '/doctor/medical-records', icon: FileText },
          { label: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
          { label: 'AI Doctor Copilot', path: '/doctor/ai-assistant', icon: Bot },
          { label: 'Profile', path: '/doctor/profile', icon: User },
        ];
      case 'ROLE_RECEPTIONIST':
        return [
          { label: 'Dashboard', path: '/receptionist/dashboard', icon: LayoutDashboard },
          { label: 'Patients Intake', path: '/receptionist/patients', icon: Users },
          { label: 'Appointments', path: '/receptionist/appointments', icon: Calendar },
          { label: 'Doctors List', path: '/receptionist/doctors', icon: Stethoscope },
          { label: 'AI Slot Assistant', path: '/receptionist/ai-assistant', icon: Bot },
          { label: 'Profile', path: '/receptionist/profile', icon: User },
        ];
      case 'ROLE_PATIENT':
        return [
          { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
          { label: 'My Profile', path: '/patient/profile', icon: User },
          { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
          { label: 'Book Appointment', path: '/patient/book-appointment', icon: PlusCircle },
          { label: 'Medical Records', path: '/patient/medical-records', icon: FileText },
          { label: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
          { label: 'AI Health Assistant', path: '/patient/ai-assistant', icon: Bot },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        ></div>
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            MediFlow Navigation
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info Header */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Current Navigation Context
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-700 capitalize">
              {user?.role ? user.role.replace('ROLE_', '') + ' Panel' : 'User'}
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>

          <div className="mt-3 text-center text-[10px] text-slate-400">
            MediFlow PMS v1.0.0 &copy; 2026
          </div>
        </div>
      </aside>
    </>
  );
};
