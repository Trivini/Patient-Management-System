import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { LogIn, Key, Mail, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      showToast('Your session has expired. Please sign in again.', 'warning');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      const data = await login({ email, password });
      showToast(`Welcome back, ${data.fullName}!`, 'success');

      // Role-based automated redirect
      switch (data.role) {
        case 'ROLE_ADMIN':
          navigate('/admin/dashboard');
          break;
        case 'ROLE_DOCTOR':
          navigate('/doctor/dashboard');
          break;
        case 'ROLE_RECEPTIONIST':
          navigate('/receptionist/dashboard');
          break;
        case 'ROLE_PATIENT':
          navigate('/patient/dashboard');
          break;
        default:
          navigate('/admin/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In to MediFlow</h2>
        <p className="text-xs text-slate-500 mt-1">
          Enter your registered email address and password to access your portal.
        </p>
      </div>

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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">Password</label>
            <Link to="/forgot-password" className="text-xs text-blue-600 font-medium hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
        Don't have an account yet?{' '}
        <Link to="/register" className="text-blue-600 font-bold hover:underline">
          Register Patient Account
        </Link>
      </div>
    </div>
  );
};
