import React, { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import { useToast } from '../context/ToastContext';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Pagination } from '../components/common/Pagination';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { AiSummaryCard } from '../components/ai/AiSummaryCard';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  FileText,
  Pill,
  MapPin,
  Heart
} from 'lucide-react';
import { medicalRecordService } from '../services/medicalRecordService';
import { prescriptionService } from '../services/prescriptionService';
import { appointmentService } from '../services/appointmentService';

export const PatientsPage = () => {
  const { showToast } = useToast();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);

  // Detailed View Tab State
  const [activeTab, setActiveTab] = useState('overview'); // overview, appointments, records, prescriptions
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [patientAppointments, setPatientAppointments] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '1995-01-01',
    bloodGroup: 'O+',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    allergies: '',
    existingConditions: '',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchPatients();
  }, [page, status, gender]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await patientService.searchPatients({
        query,
        status,
        gender,
        page,
        size: 10
      });
      setPatients(res.content || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      showToast('Failed to fetch patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchPatients();
  };

  const handleOpenCreate = () => {
    setSelectedPatient(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'Male',
      dateOfBirth: '1995-01-01',
      bloodGroup: 'O+',
      address: '',
      city: '',
      state: '',
      pincode: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      allergies: '',
      existingConditions: '',
      status: 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (p) => {
    setSelectedPatient(p);
    setFormData({
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      email: p.email || '',
      phone: p.phone || '',
      gender: p.gender || 'Male',
      dateOfBirth: p.dateOfBirth || '',
      bloodGroup: p.bloodGroup || 'O+',
      address: p.address || '',
      city: p.city || '',
      state: p.state || '',
      pincode: p.pincode || '',
      emergencyContactName: p.emergencyContactName || '',
      emergencyContactPhone: p.emergencyContactPhone || '',
      allergies: p.allergies || '',
      existingConditions: p.existingConditions || '',
      status: p.status || 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const handleOpenDetail = async (p) => {
    setSelectedPatient(p);
    setActiveTab('overview');
    setIsDetailOpen(true);

    try {
      const [recs, pres, apps] = await Promise.all([
        medicalRecordService.getMedicalRecordsByPatientId(p.id),
        prescriptionService.getPrescriptionsByPatientId(p.id),
        appointmentService.getAppointmentsByPatientId(p.id)
      ]);
      setPatientRecords(recs || []);
      setPatientPrescriptions(pres || []);
      setPatientAppointments(apps || []);
    } catch (err) {
      console.warn('Error loading patient sub-history:', err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPatient) {
        await patientService.updatePatient(selectedPatient.id, formData);
        showToast('Patient updated successfully!', 'success');
      } else {
        await patientService.createPatient(formData);
        showToast('New patient registered successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchPatients();
    } catch (err) {
      showToast(err.response?.data?.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedPatient) return;
    try {
      await patientService.deletePatient(selectedPatient.id);
      showToast('Patient deleted successfully', 'success');
      fetchPatients();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete patient', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Patient Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage patient profiles, registration, history, and medical records.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Patient</span>
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
              placeholder="Search by code (PAT001), name, email, phone..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-semibold hover:bg-slate-800 transition-colors">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
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

          <select
            value={gender}
            onChange={(e) => {
              setGender(e.target.value);
              setPage(0);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-700"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {(query || status || gender) && (
            <button
              onClick={() => {
                setQuery('');
                setStatus('');
                setGender('');
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

      {/* Patients Table */}
      {loading ? (
        <LoadingSkeleton count={5} type="table" />
      ) : patients.length === 0 ? (
        <EmptyState title="No patients found" description="No patient records match your current search or filter rules." />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="p-4">Patient Code</th>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Age / Gender</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {patients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-600">{p.patientCode}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{p.firstName} {p.lastName}</div>
                      <div className="text-[11px] text-slate-400">{p.email}</div>
                    </td>
                    <td className="p-4 text-slate-700">
                      {p.age != null ? `${p.age} yrs` : 'N/A'} &bull; {p.gender}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{p.bloodGroup || 'N/A'}</td>
                    <td className="p-4 text-slate-600">{p.phone}</td>
                    <td className="p-4">
                      <Badge status={p.status} />
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenDetail(p)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Detailed Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit Patient"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPatient(p);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Patient"
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
        title={selectedPatient ? `Edit Patient: ${selectedPatient.patientCode}` : 'Register New Patient'}
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
              <label className="block font-semibold text-slate-700 mb-1">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
              <input
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Known Allergies</label>
            <input
              type="text"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              placeholder="e.g. Penicillin, Peanuts"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Existing Conditions</label>
            <input
              type="text"
              value={formData.existingConditions}
              onChange={(e) => setFormData({ ...formData, existingConditions: e.target.value })}
              placeholder="e.g. Hypertension, Asthma"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button type="submit" className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-md">
              Save Patient Record
            </button>
          </div>
        </form>
      </Modal>

      {/* Detailed Patient Profile Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Patient Profile: ${selectedPatient?.firstName} ${selectedPatient?.lastName} (${selectedPatient?.patientCode})`}
        maxWidth="max-w-4xl"
      >
        {selectedPatient && (
          <div className="space-y-6">
            {/* AI Medical Record Summarizer Component */}
            <AiSummaryCard
              patientId={selectedPatient.id}
              patientName={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
            />

            {/* Profile Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
              {['overview', 'appointments', 'records', 'prescriptions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                    Personal Information
                  </div>
                  <div><span className="font-semibold text-slate-500">Code:</span> {selectedPatient.patientCode}</div>
                  <div><span className="font-semibold text-slate-500">Gender:</span> {selectedPatient.gender}</div>
                  <div><span className="font-semibold text-slate-500">Age:</span> {selectedPatient.age} yrs</div>
                  <div><span className="font-semibold text-slate-500">Blood Group:</span> {selectedPatient.bloodGroup}</div>
                  <div><span className="font-semibold text-slate-500">DOB:</span> {selectedPatient.dateOfBirth}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
                    Contact & Emergency
                  </div>
                  <div><span className="font-semibold text-slate-500">Email:</span> {selectedPatient.email}</div>
                  <div><span className="font-semibold text-slate-500">Phone:</span> {selectedPatient.phone}</div>
                  <div><span className="font-semibold text-slate-500">Emergency Contact:</span> {selectedPatient.emergencyContactName} ({selectedPatient.emergencyContactPhone})</div>
                  <div><span className="font-semibold text-slate-500">Allergies:</span> {selectedPatient.allergies || 'None'}</div>
                  <div><span className="font-semibold text-slate-500">Conditions:</span> {selectedPatient.existingConditions || 'None'}</div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-3">
                {patientAppointments.length === 0 ? (
                  <EmptyState title="No appointment history" description="This patient has no booked appointments yet." />
                ) : (
                  patientAppointments.map((apt) => (
                    <div key={apt.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{apt.doctorName} &bull; {apt.departmentName}</div>
                        <div className="text-slate-500">{apt.appointmentDate} at {apt.appointmentTime} &bull; Reason: {apt.reason}</div>
                      </div>
                      <Badge status={apt.status} />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'records' && (
              <div className="space-y-3">
                {patientRecords.length === 0 ? (
                  <EmptyState title="No medical records" description="No clinical visits recorded for this patient." />
                ) : (
                  patientRecords.map((r) => (
                    <div key={r.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{r.recordCode} &bull; Visit Date: {r.visitDate}</span>
                        <span className="text-blue-600">{r.doctorName}</span>
                      </div>
                      <div><span className="font-semibold text-slate-700">Diagnosis:</span> {r.diagnosis}</div>
                      <div><span className="font-semibold text-slate-700">Treatment:</span> {r.treatment}</div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div className="space-y-3">
                {patientPrescriptions.length === 0 ? (
                  <EmptyState title="No active prescriptions" description="No medicines prescribed yet." />
                ) : (
                  patientPrescriptions.map((pres) => (
                    <div key={pres.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="font-bold text-slate-900">{pres.medicineName} &bull; {pres.dosage}</div>
                      <div className="text-slate-600">Frequency: {pres.frequency} &bull; Duration: {pres.duration}</div>
                      <div className="text-slate-500 italic">Instructions: {pres.instructions}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Patient Record?"
        message={`Are you sure you want to permanently delete patient ${selectedPatient?.firstName} ${selectedPatient?.lastName}? This action cannot be undone.`}
      />
    </div>
  );
};
