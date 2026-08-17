import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ForgotPasswordPage = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Password reset instructions sent to your email!', 'success');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
        <p className="text-xs text-slate-500 mt-1">Enter your registered email address to receive password reset instructions.</p>
      </div>

      {submitted ? (
        <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs sm:text-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Reset Link Dispatched</span>
          </div>
          <p>We have sent reset instructions to <span className="font-semibold">{email}</span>. Please check your inbox.</p>
          <Link to="/login" className="inline-block pt-2 font-bold text-blue-600 hover:underline">
            &larr; Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@clinic.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
          >
            Send Reset Instructions
          </button>

          <div className="text-center">
            <Link to="/login" className="text-xs text-slate-500 font-medium hover:text-slate-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
