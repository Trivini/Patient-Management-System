import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { User, Shield, Search } from 'lucide-react';

export const UsersPage = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch users list or fallback demo list
      const res = await api.get('/audit-logs/recent');
      // For demo, list default system roles
      setUsers([
        { id: 1, email: 'admin@pms.com', fullName: 'Rajesh Kulkarni (System Admin)', role: 'ROLE_ADMIN', status: 'ACTIVE' },
        { id: 2, email: 'doctor@pms.com', fullName: 'Dr. Ananya Deshmukh', role: 'ROLE_DOCTOR', status: 'ACTIVE' },
        { id: 3, email: 'rohit.pawar@pms.com', fullName: 'Dr. Rohit Pawar', role: 'ROLE_DOCTOR', status: 'ACTIVE' },
        { id: 4, email: 'receptionist@pms.com', fullName: 'Pooja Shinde', role: 'ROLE_RECEPTIONIST', status: 'ACTIVE' },
        { id: 5, email: 'patient@pms.com', fullName: 'Aarav Patil', role: 'ROLE_PATIENT', status: 'ACTIVE' }
      ]);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" /> User Accounts & Authorization
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage system user credentials and Spring Security role assignments.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4 font-bold text-slate-900">{u.fullName}</td>
                <td className="p-4 text-slate-600">{u.email}</td>
                <td className="p-4">
                  <Badge status={u.role} />
                </td>
                <td className="p-4">
                  <Badge status={u.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
