import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Bot,
  LogOut,
  Menu,
  User,
  ChevronDown,
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  Calendar,
  FileText,
  Pill,
  ShieldAlert,
  Stethoscope,
  PlusCircle,
  Settings,
  HeartPulse
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NotificationBell } from '../NotificationBell';

export const Navbar = ({ onToggleSidebar, onOpenAiModal }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getRoleInfo = (role) => {
    switch (role) {
      case 'ROLE_ADMIN':
        return {
          label: 'Admin Portal',
          badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          activeTab: 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-xs',
          navItems: [
            { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
            { label: 'Patients', path: '/admin/patients', icon: Users },
            { label: 'Doctors', path: '/admin/doctors', icon: UserCheck },
            { label: 'Departments', path: '/admin/departments', icon: Building2 },
            { label: 'Appointments', path: '/admin/appointments', icon: Calendar },
            { label: 'EMR Records', path: '/admin/medical-records', icon: FileText },
            { label: 'Prescriptions', path: '/admin/prescriptions', icon: Pill },
            { label: 'Users', path: '/admin/users', icon: User },
            { label: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert },
          ]
        };
      case 'ROLE_DOCTOR':
        return {
          label: 'Physician Workspace',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          activeTab: 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/80 shadow-xs',
          navItems: [
            { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
            { label: 'Today Schedule', path: '/doctor/appointments', icon: Calendar },
            { label: 'Assigned Patients', path: '/doctor/patients', icon: Users },
            { label: 'EMR Records', path: '/doctor/medical-records', icon: FileText },
            { label: 'e-Prescriptions', path: '/doctor/prescriptions', icon: Pill },
            { label: 'AI Copilot', path: '/doctor/ai-assistant', icon: Bot },
          ]
        };
      case 'ROLE_RECEPTIONIST':
        return {
          label: 'Front-Desk Portal',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
          activeTab: 'bg-amber-50 text-amber-700 font-bold border border-amber-200/80 shadow-xs',
          navItems: [
            { label: 'Dashboard', path: '/receptionist/dashboard', icon: LayoutDashboard },
            { label: 'Patient Intake', path: '/receptionist/patients', icon: Users },
            { label: 'Appointments', path: '/receptionist/appointments', icon: Calendar },
            { label: 'Doctor Availability', path: '/receptionist/doctors', icon: Stethoscope },
            { label: 'AI Slot Search', path: '/receptionist/ai-assistant', icon: Bot },
          ]
        };
      case 'ROLE_PATIENT':
        return {
          label: 'Patient Portal',
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
          activeTab: 'bg-blue-50 text-blue-700 font-bold border border-blue-200/80 shadow-xs',
          navItems: [
            { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
            { label: 'Book Appointment', path: '/patient/book-appointment', icon: PlusCircle },
            { label: 'My Appointments', path: '/patient/appointments', icon: Calendar },
            { label: 'Medical History', path: '/patient/medical-records', icon: FileText },
            { label: 'Prescriptions', path: '/patient/prescriptions', icon: Pill },
            { label: 'AI Support', path: '/patient/ai-assistant', icon: Bot },
          ]
        };
      default:
        return {
          label: 'MediFlow Portal',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
          activeTab: 'bg-blue-50 text-blue-700 font-bold',
          navItems: []
        };
    }
  };

  const roleConfig = getRoleInfo(user?.role);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left Side: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
            title="Toggle Sidebar Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => {
              if (user?.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
              else if (user?.role === 'ROLE_DOCTOR') navigate('/doctor/dashboard');
              else if (user?.role === 'ROLE_RECEPTIONIST') navigate('/receptionist/dashboard');
              else if (user?.role === 'ROLE_PATIENT') navigate('/patient/dashboard');
              else navigate('/');
            }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                MediFlow <span className="text-blue-600">PMS</span>
              </span>
              <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded-md border ${roleConfig.badgeBg}`}>
                {roleConfig.label}
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Role-Specific Top Navbar Links (Visible on XL screens) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {roleConfig.navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? roleConfig.activeTab
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Side: AI Launcher & User Account Dropdown */}
        <div className="flex items-center gap-2.5">
          {/* AI Assistant Launcher */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-xs shadow-md shadow-purple-500/20 hover:opacity-95 transition-all transform hover:-translate-y-0.5"
          >
            <Bot className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

          <NotificationBell />

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80 bg-slate-50/50"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.fullName ? user.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden md:block text-left pr-1">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.fullName || 'User'}
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {user?.email}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                  <div className="font-bold text-slate-900 text-xs">{user?.fullName}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                  <div className="mt-1.5">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${roleConfig.badgeBg}`}>
                      {roleConfig.label}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      if (user?.role === 'ROLE_PATIENT') navigate('/patient/profile');
                      else if (user?.role === 'ROLE_DOCTOR') navigate('/doctor/profile');
                      else if (user?.role === 'ROLE_RECEPTIONIST') navigate('/receptionist/profile');
                      else navigate('/admin/settings');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile & Settings
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
