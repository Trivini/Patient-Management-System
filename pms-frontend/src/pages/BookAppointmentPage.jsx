import React, { useState, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Stethoscope, Building2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const BookAppointmentPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  // AI Assistant Search Query State
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDeptId) {
      fetchDoctorsByDept(selectedDeptId);
    } else {
      fetchAllDoctors();
    }
  }, [selectedDeptId]);

  useEffect(() => {
    if (selectedDoctorId && appointmentDate) {
      fetchAvailableSlots(selectedDoctorId, appointmentDate);
    }
  }, [selectedDoctorId, appointmentDate]);

  const fetchDepartments = async () => {
    try {
      const res = await departmentService.getAllDepartments();
      setDepartments(res || []);
      if (res && res.length > 0) setSelectedDeptId(res[0].id);
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchAllDoctors = async () => {
    try {
      const res = await doctorService.getAllDoctors();
      setDoctors(res || []);
      if (res && res.length > 0) setSelectedDoctorId(res[0].id);
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchDoctorsByDept = async (deptId) => {
    try {
      const res = await doctorService.getAllDoctors();
      const filtered = res.filter((d) => String(d.departmentId) === String(deptId));
      setDoctors(filtered);
      if (filtered.length > 0) setSelectedDoctorId(filtered[0].id);
      else setSelectedDoctorId('');
    } catch (err) {
      console.warn(err);
    }
  };

  const fetchAvailableSlots = async (docId, dateStr) => {
    setLoadingSlots(true);
    try {
      const slots = await appointmentService.getAvailableSlots(docId, dateStr);
      setAvailableSlots(slots || []);
      if (slots && slots.length > 0) setSelectedTime(slots[0]);
      else setSelectedTime('');
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleAiSlotSearch = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    try {
      const res = await aiService.recommendSlots({ query: aiQuery });
      if (res.availableSlots && res.availableSlots.length > 0) {
        const top = res.availableSlots[0];
        if (top.departmentId) setSelectedDeptId(top.departmentId);
        if (top.doctorId) setSelectedDoctorId(top.doctorId);
        if (top.date) setAppointmentDate(top.date);
        if (top.time) setSelectedTime(top.time);
        showToast(`AI matched top slot with ${top.doctorName} on ${top.date}!`, 'success');
      } else {
        showToast('No matching AI slots found for query.', 'info');
      }
    } catch (err) {
      showToast('AI slot search failed.', 'error');
    } finally {
      setAiLoading(false);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !appointmentDate || !selectedTime || !reason) {
      showToast('Please complete all required fields', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      await appointmentService.createAppointment({
        patientId: user?.patientId || 1,
        doctorId: selectedDoctorId,
        departmentId: selectedDeptId,
        appointmentDate,
        appointmentTime: selectedTime,
        reason,
        status: 'BOOKED'
      });
      showToast('Appointment booked successfully! Double-booking check passed.', 'success');
      navigate('/patient/appointments');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment. Slot may be unavailable.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" /> Book an Appointment
        </h1>
        <p className="text-xs text-slate-500 mt-1">Select department, doctor, date, and verified open consultation slot.</p>
      </div>

      {/* AI Assistant Quick Search Box */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-5 rounded-3xl text-white shadow-md border border-purple-800/40">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-bold uppercase tracking-wider text-purple-200">AI Natural Slot Assistant</span>
        </div>
        <form onSubmit={handleAiSlotSearch} className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Type naturally e.g. 'I want to see a cardiologist next Monday morning'..."
            className="flex-1 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs sm:text-sm text-white placeholder-purple-200/60 focus:outline-none"
          />
          <button
            type="submit"
            disabled={aiLoading || !aiQuery.trim()}
            className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
          >
            {aiLoading ? 'Searching...' : 'AI Search'}
          </button>
        </form>
      </div>

      {/* Booking Form Card */}
      <form onSubmit={handleBookingSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">1. Select Medical Department *</label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">2. Select Doctor / Specialist *</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold"
            >
              {doctors.length === 0 ? (
                <option value="">No doctors available in this department</option>
              ) : (
                doctors.map((d) => (
                  <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName} ({d.specialization} - ${d.consultationFee})</option>
                ))
              )}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">3. Select Appointment Date *</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-medium"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">4. Select Available Time Slot *</label>
            {loadingSlots ? (
              <div className="p-3 bg-slate-50 rounded-2xl border text-slate-400">Loading open slots...</div>
            ) : availableSlots.length === 0 ? (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200">
                No slots available on this date. Please pick another date.
              </div>
            ) : (
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-blue-600"
              >
                {availableSlots.map((time, idx) => (
                  <option key={idx} value={time}>{time}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">5. Reason for Visit *</label>
          <textarea
            rows={3}
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe your health symptoms or visit purpose..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            * Real-time backend validation prevents double-booking.
          </div>

          <button
            type="submit"
            disabled={submitting || !selectedTime}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {submitting ? 'Confirming Booking...' : 'Confirm Appointment Booking'}
          </button>
        </div>
      </form>
    </div>
  );
};
