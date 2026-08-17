import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Upload, Download, FileText, Plus, X, Tag } from 'lucide-react';
import { labReportService } from '../services/labReportService';

export const LabReportsSection = ({ patientId, isEditable = true }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [testCategory, setTestCategory] = useState('Blood Work');
  const [summary, setSummary] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadReports = async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await labReportService.getLabReportsByPatient(patientId);
      setReports(data || []);
    } catch (err) {
      console.error('Failed to fetch lab reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [patientId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('testCategory', testCategory);
      formData.append('summary', summary);
      formData.append('file', selectedFile);

      await labReportService.uploadLabReport(patientId, formData);
      setShowUploadModal(false);
      setTitle('');
      setSummary('');
      setSelectedFile(null);
      loadReports();
    } catch (err) {
      console.error('Failed to upload report', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (reportId, fileName) => {
    labReportService.downloadLabReport(reportId, fileName);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Lab & Diagnostic Reports</h3>
            <p className="text-xs text-slate-500">Blood tests, imaging, and pathology reports</p>
          </div>
        </div>
        {isEditable && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1 transition-all shadow-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Report
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-6 text-xs text-slate-400">Loading lab reports...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
          No lab reports uploaded yet
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {reports.map((report) => (
            <div key={report.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    {report.title}
                    <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md">
                      {report.testCategory}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {report.fileName} • {report.uploadedAt ? new Date(report.uploadedAt).toLocaleDateString() : ''}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(report.id, report.fileName)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg flex items-center gap-1 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-600" />
                Upload Diagnostic Report
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="e.g. Complete Blood Count (CBC)"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Category</label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Blood Work">Blood Work</option>
                  <option value="Radiology">Radiology / X-Ray / MRI</option>
                  <option value="Pathology">Pathology</option>
                  <option value="ECG/Cardiology">ECG / Cardiology</option>
                  <option value="General">General Medical Report</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Select File (PDF, Image, Doc)</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">Summary / Observations</label>
                <textarea
                  rows="2"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Optional findings summary..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold flex items-center gap-1 shadow-xs disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
