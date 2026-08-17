import React, { useState, useEffect } from 'react';
import { HeartPulse, Activity, Thermometer, Weight, Ruler, Plus, Save, X } from 'lucide-react';
import { vitalsService } from '../services/vitalsService';

export const PatientVitalsWidget = ({ patientId, isEditable = true }) => {
  const [vitalsList, setVitalsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '36.6',
    weight: '70.0',
    height: '175.0',
    oxygenSaturation: '98',
    notes: '',
  });

  const loadVitals = async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await vitalsService.getPatientVitals(patientId);
      setVitalsList(data || []);
    } catch (err) {
      console.error('Failed to load patient vitals', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVitals();
  }, [patientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await vitalsService.addPatientVitals(patientId, {
        bloodPressure: formData.bloodPressure,
        heartRate: formData.heartRate ? parseInt(formData.heartRate) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        oxygenSaturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : null,
        notes: formData.notes,
      });
      setShowModal(false);
      loadVitals();
    } catch (err) {
      console.error('Failed to save vitals', err);
    }
  };

  const latest = vitalsList.length > 0 ? vitalsList[0] : null;

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Patient Vitals Tracker</h3>
            <p className="text-xs text-slate-500">Real-time physiological parameters</p>
          </div>
        </div>
        {isEditable && (
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Vitals
          </button>
        )}
      </div>

      {/* Grid of Vitals Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span>Blood Pressure</span>
          </div>
          <div className="text-lg font-extrabold text-slate-800">
            {latest?.bloodPressure || '--/--'} <span className="text-[10px] font-normal text-slate-400">mmHg</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <HeartPulse className="w-3.5 h-3.5 text-red-500" />
            <span>Heart Rate</span>
          </div>
          <div className="text-lg font-extrabold text-slate-800">
            {latest?.heartRate || '--'} <span className="text-[10px] font-normal text-slate-400">bpm</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Thermometer className="w-3.5 h-3.5 text-amber-500" />
            <span>Body Temp</span>
          </div>
          <div className="text-lg font-extrabold text-slate-800">
            {latest?.temperature ? `${latest.temperature}°C` : '--'}
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1">
            <Weight className="w-3.5 h-3.5 text-indigo-500" />
            <span>Weight & Oxygen</span>
          </div>
          <div className="text-sm font-extrabold text-slate-800">
            {latest?.weight ? `${latest.weight} kg` : '--'} | {latest?.oxygenSaturation ? `${latest.oxygenSaturation}% SpO2` : '--'}
          </div>
        </div>
      </div>

      {/* Log Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-600" />
                Record Vital Signs
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    value={formData.bloodPressure}
                    onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="120/80"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Heart Rate (bpm)</label>
                  <input
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="72"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="36.6"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Oxygen (SpO2 %)</label>
                  <input
                    type="number"
                    value={formData.oxygenSaturation}
                    onChange={(e) => setFormData({ ...formData, oxygenSaturation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="98"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="70.0"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="175"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Clinical Notes</label>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  placeholder="Optional notes or observation..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
