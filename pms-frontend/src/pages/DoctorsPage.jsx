import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import { departmentService } from '../services/departmentService';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Pagination } from '../components/common/Pagination';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import {
  UserCheck,
  Search,
  Plus,
  Edit,
  Trash2,
  Stethoscope,
  Building2,
  DollarSign,
  Clock,
  RefreshCw
} from 'lucide-react';

export const DoctorsPage = () => {
  const { showToast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [query, setQuery] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    specialization: 'Cardiology',
    departmentId: '',
    qualification: 'MD',
    experienceYears: 5,
    consultationFee: 100,
    availabilityHours: 'Mon-Fri 09:00 AM - 05:00 PM',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [page, departmentId, status]);

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getAllDepartments();
      setDepartments(res || []);
    } catch (err) {
      console.warn('Error fetching departments:', err);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await doctorService.searchDoctors({
        query,
        departmentId: departmentId || null,
        status: status || null,
        page,
        size: 10
      });
      setDoctors(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast('Failed to fetch doctors list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchDoctors();
  };

  const handleOpenCreate = () => {
    setSelectedDoctor(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'Male',
      specialization: 'Cardiology',
      departmentId: departments[0]?.id || '',
      qualification: 'MD',
      experienceYears: 5,
      consultationFee: 120,
      availabilityHours: 'Mon-Fri 09:00 AM - 05:00 PM',
      status: 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setSelectedDoctor(doc);
    setFormData({
      firstName: doc.firstName || '',
      lastName: doc.lastName || '',
      email: doc.email || '',
      phone: doc.phone || '',
      gender: doc.gender || 'Male',
      specialization: doc.specialization || '',
      departmentId: doc.departmentId || '',
      qualification: doc.qualification || '',
      experienceYears: doc.experienceYears || 0,
      consultationFee: doc.consultationFee || 0,
      availabilityHours: doc.availabilityHours || '',
      status: doc.status || 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDoctor) {
        await doctorService.updateDoctor(selectedDoctor.id, formData);
        showToast('Doctor details updated successfully!', 'success');
      } else {
        await doctorService.createDoctor(formData);
        showToast('New doctor onboarded successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchDoctors();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedDoctor) return;
    try {
      await doctorService.deleteDoctor(selectedDoctor.id);
      showToast('Doctor deleted successfully', 'success');
      fetchDoctors();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete doctor', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-600" /> Doctor & Specialist Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage physicians, medical qualifications, fees, and consultation availability.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by code (DOC001), doctor name, specialization..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 transition-colors">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          {(query || departmentId || status) && (
            <button
              onClick={() => {
                setQuery('');
                setDepartmentId('');
                setStatus('');
                setPage(0);
              }}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
              title="Clear filters"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Doctors Table */}
      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : doctors.length === 0 ? (
        <EmptyState title="No doctors found" description="No doctors recorded matching your criteria." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Doctor Code</th>
                  <th className="p-4">Doctor Name</th>
                  <th className="p-4">Department & Specialization</th>
                  <th className="p-4">Fee</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {doctors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-emerald-600">{d.doctorCode}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">Dr. {d.firstName} {d.lastName}</div>
                      <div className="text-[11px] text-slate-400">{d.qualification} &bull; {d.experienceYears} yrs exp</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-800">{d.specialization}</div>
                      <div className="text-[11px] text-slate-500">{d.departmentName || 'General'}</div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">${d.consultationFee}</td>
                    <td className="p-4 text-slate-600 text-[11px]">{d.availabilityHours}</td>
                    <td className="p-4">
                      <Badge status={d.status} />
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(d)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Doctor"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDoctor(d);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Doctor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={(newPage) => setPage(newPage)} />
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedDoctor ? `Edit Doctor: ${selectedDoctor.doctorCode}` : 'Add New Doctor'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Specialization *</label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                placeholder="Cardiology, Dermatology, etc."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department *</label>
              <select
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="MD, MBBS, PhD"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Experience (Years)</label>
              <input
                type="number"
                min="0"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Consultation Fee ($)</label>
              <input
                type="number"
                min="0"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: parseFloat(e.target.value) || 0 })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Availability Hours</label>
              <input
                type="text"
                value={formData.availabilityHours}
                onChange={(e) => setFormData({ ...formData, availabilityHours: e.target.value })}
                placeholder="Mon-Fri 09:00 AM - 05:00 PM"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-md">
              Save Doctor Profile
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Doctor Account?"
        message={`Are you sure you want to remove Dr. ${selectedDoctor?.firstName} ${selectedDoctor?.lastName}?`}
      />
    </div>
  );
};
