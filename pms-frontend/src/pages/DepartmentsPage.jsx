import React, { useState, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Badge } from '../components/common/Badge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { Building2, Plus, Edit, Trash2, Users, ShieldAlert } from 'lucide-react';

export const DepartmentsPage = () => {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    headDoctorName: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAllDepartments();
      setDepartments(res || []);
    } catch (err) {
      showToast('Failed to load departments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedDept(null);
    setFormData({ name: '', description: '', headDoctorName: '', status: 'ACTIVE' });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({
      name: dept.name || '',
      description: dept.description || '',
      headDoctorName: dept.headDoctorName || '',
      status: dept.status || 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDept) {
        await departmentService.updateDepartment(selectedDept.id, formData);
        showToast('Department updated successfully!', 'success');
      } else {
        await departmentService.createDepartment(formData);
        showToast('New department added successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchDepartments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedDept) return;
    try {
      await departmentService.deleteDepartment(selectedDept.id);
      showToast('Department deleted successfully', 'success');
      fetchDepartments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete department', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-purple-600" /> Department Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Configure medical departments, head physicians, and active staff counts.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Department</span>
        </button>
      </div>

      {/* Grid of Department Cards */}
      {loading ? (
        <LoadingSkeleton count={6} type="card" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-100">
                    {dept.departmentCode}
                  </span>
                  <Badge status={dept.status} />
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-1">{dept.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{dept.description || 'No description provided.'}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Head Physician:</span>
                  <span className="font-bold text-slate-800">{dept.headDoctorName || 'Unassigned'}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-500" /> Assigned Doctors:
                  </span>
                  <span className="font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    {dept.doctorCount ?? 0} Doctors
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => handleOpenEdit(dept)}
                    className="p-2 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDept(dept);
                      setIsDeleteOpen(true);
                    }}
                    className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedDept ? `Edit Department: ${selectedDept.departmentCode}` : 'Add New Department'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Cardiology, Orthopedics, etc."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Head Doctor Name</label>
            <input
              type="text"
              value={formData.headDoctorName}
              onChange={(e) => setFormData({ ...formData, headDoctorName: e.target.value })}
              placeholder="Dr. Sarah Jenkins"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description of department services..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold shadow-md">
              Save Department
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Safeguard Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Department?"
        message={`Are you sure you want to delete ${selectedDept?.name}? Note: Departments with active assigned doctors cannot be deleted.`}
      />
    </div>
  );
};
