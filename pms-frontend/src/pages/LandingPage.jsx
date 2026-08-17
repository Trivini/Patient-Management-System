import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  Stethoscope,
  Building2,
  Calendar,
  Users,
  Award,
  HeartPulse,
  Activity,
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  ChevronRight,
  ShieldAlert,
  Microscope,
  Ambulance,
  Star,
  FileText,
  Pill,
  UserCheck,
  Search,
  X
} from 'lucide-react';

const specialistsData = [
  {
    id: 1,
    name: 'Dr. Ananya Deshmukh',
    title: 'Senior Interventional Cardiologist',
    department: 'Cardiology',
    code: 'DOC001',
    qualification: 'MD, DM (Cardiology) - KEM Hospital, Mumbai',
    experience: 15,
    fee: 1200,
    rating: 4.9,
    reviews: 184,
    availability: 'Mon - Fri (09:00 AM - 05:00 PM)',
    bio: 'Pioneer in minimally invasive TAVI procedures, complex coronary angioplasty, and preventative cardiovascular care with over 15 years of clinical excellence.',
    specialties: ['Coronary Angioplasty', 'Heart Failure Management', 'TAVI Procedure', 'Echocardiography'],
    avatarBg: 'from-rose-600 to-pink-600'
  },
  {
    id: 2,
    name: 'Dr. Rohit Pawar',
    title: 'Consultant Dermatologist & Cosmetologist',
    department: 'Dermatology',
    code: 'DOC002',
    qualification: 'MD (Dermatology), DVD - BJ Medical College, Pune',
    experience: 12,
    fee: 1000,
    rating: 4.8,
    reviews: 142,
    availability: 'Mon - Thu (10:00 AM - 04:00 PM)',
    bio: 'Specialist in clinical dermatology, laser skin rejuvenation, psoriasis control, aesthetic medicine, and advanced dermato-surgery.',
    specialties: ['Laser Skin Surgery', 'Aesthetic Dermatology', 'Eczema & Psoriasis', 'Acne Treatment'],
    avatarBg: 'from-amber-500 to-orange-600'
  },
  {
    id: 3,
    name: 'Dr. Sneha Joshi',
    title: 'Senior General Physician & Diabetologist',
    department: 'General Medicine',
    code: 'DOC003',
    qualification: 'MBBS, MD (Medicine) - Grant Medical College, Mumbai',
    experience: 9,
    fee: 800,
    rating: 4.9,
    reviews: 210,
    availability: 'Mon - Fri (08:30 AM - 04:30 PM)',
    bio: 'Expert in adult internal medicine, type 2 diabetes management programs, hypertension control, and annual preventative wellness checkups.',
    specialties: ['Diabetes Care', 'Hypertension Control', 'Preventive Health', 'Infectious Diseases'],
    avatarBg: 'from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    name: 'Dr. Vikram Mane',
    title: 'Robotic Joint & Spine Surgeon',
    department: 'Orthopedics',
    code: 'DOC004',
    qualification: 'MS (Orthopedics), M.Ch - Sancheti Institute, Pune',
    experience: 14,
    fee: 1500,
    rating: 4.9,
    reviews: 195,
    availability: 'Tue - Sat (10:00 AM - 06:00 PM)',
    bio: 'Renowned orthopedic surgeon specializing in robotic total knee and hip replacements, arthroscopy, complex trauma care, and sports injuries.',
    specialties: ['Robotic Knee Replacement', 'Hip Arthroplasty', 'Arthroscopic Surgery', 'Spine Disorders'],
    avatarBg: 'from-blue-600 to-indigo-600'
  },
  {
    id: 5,
    name: 'Dr. Aditi Kulkarni',
    title: 'Consultant Pediatrician & Neonatologist',
    department: 'Pediatrics',
    code: 'DOC005',
    qualification: 'MD (Pediatrics), DCH - Nair Hospital, Mumbai',
    experience: 11,
    fee: 900,
    rating: 5.0,
    reviews: 312,
    availability: 'Mon - Sat (09:00 AM - 03:00 PM)',
    bio: 'Dedicated child healthcare specialist providing comprehensive neonatal intensive care (NICU), pediatric growth tracking, and adolescent medicine.',
    specialties: ['Neonatal ICU Care', 'Child Growth & Nutrition', 'Pediatric Asthma', 'Immunization'],
    avatarBg: 'from-sky-500 to-cyan-600'
  },
  {
    id: 6,
    name: 'Dr. Sameer Gaikwad',
    title: 'Senior Neurologist & Stroke Specialist',
    department: 'Neurology',
    code: 'DOC006',
    qualification: 'DM (Neurology), MD - JJ Hospital, Mumbai',
    experience: 16,
    fee: 1600,
    rating: 4.9,
    reviews: 168,
    availability: 'Mon - Fri (11:00 AM - 05:00 PM)',
    bio: 'Leading stroke and neurology consultant specializing in acute stroke thrombolysis, epilepsy, Parkinson\'s disease, and neuro-rehabilitation.',
    specialties: ['Stroke Thrombolysis', 'Epilepsy & Migraine', 'Parkinson\'s Disease', 'Neuro-Rehabilitation'],
    avatarBg: 'from-purple-600 to-violet-600'
  }
];

export const LandingPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);

  const departmentsList = ['All', 'Cardiology', 'Dermatology', 'General Medicine', 'Orthopedics', 'Pediatrics', 'Neurology'];

  const filteredSpecialists = specialistsData.filter((doc) => {
    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* 24/7 Emergency Header Strip */}
      <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-red-700 text-white text-xs font-bold py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-white/20 px-2.5 py-0.5 rounded-full text-[11px] animate-pulse">
              <Ambulance className="w-3.5 h-3.5" /> 24/7 Emergency & Trauma Center Active
            </span>
            <span className="hidden md:inline">Emergency Dispatch: <a href="tel:+919822011223" className="underline font-mono text-white">+91 98220 11223</a></span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-200" /> Shivajinagar, Medical District, Pune</span>
            <span className="hidden lg:flex items-center gap-1"><Clock className="w-3 h-3 text-rose-200" /> OPD: Mon - Sat (08:00 AM - 08:00 PM)</span>
          </div>
        </div>
      </div>

      {/* Main Hospital Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-600/30">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                ApexCare <span className="text-blue-500">Super Specialty</span>
              </span>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">Hospital & Research Institute</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#centers" className="hover:text-blue-400 transition-colors">Centers of Excellence</a>
            <a href="#specialists" className="hover:text-blue-400 transition-colors">Our Specialists</a>
            <a href="#diagnostics" className="hover:text-blue-400 transition-colors">Diagnostics & Labs</a>
            <Link to="/login" className="hover:text-blue-400 transition-colors">Portal Sign In</Link>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  if (user?.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
                  else if (user?.role === 'ROLE_DOCTOR') navigate('/doctor/dashboard');
                  else if (user?.role === 'ROLE_RECEPTIONIST') navigate('/receptionist/dashboard');
                  else navigate('/patient/dashboard');
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>My Hospital Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
                >
                  Patient / Staff Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
                >
                  <span>Book Appointment</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-blue-400 backdrop-blur-md">
            <Award className="w-4 h-4 text-amber-400" />
            <span>JCI & NABH Accredited Multi-Specialty Hospital System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
            Advanced Clinical Excellence & <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">AI Patient Care</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ApexCare Super Specialty Hospital provides world-class inpatient, outpatient, and emergency services. Integrated with real-time electronic health records (EMR), e-Prescriptions, automated slot booking, and AI clinical copilot services.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#specialists"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Explore Our Specialists</span>
              <Stethoscope className="w-4 h-4 text-amber-300" />
            </a>

            <Link
              to="/login"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-800 transition-all flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Portal Sign In</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-white font-mono">500+</div>
              <div className="text-[11px] text-slate-400 mt-1">Super Specialty Beds</div>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-blue-400 font-mono">150+</div>
              <div className="text-[11px] text-slate-400 mt-1">Senior Consultants</div>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">24/7</div>
              <div className="text-[11px] text-slate-400 mt-1">Trauma & ICU Care</div>
            </div>
            <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-extrabold text-purple-400 font-mono">100%</div>
              <div className="text-[11px] text-slate-400 mt-1">AI Integrated EHR</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Our Specialists Section */}
      <section id="specialists" className="py-16 px-4 sm:px-8 bg-slate-900/90 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="w-3.5 h-3.5" /> Medical Faculty & Consultants
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Meet Our Senior Specialists</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
              Board-certified senior physicians and department heads providing comprehensive inpatient, outpatient, and surgical care.
            </p>
          </div>

          {/* Search & Specialty Filter Bar */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specialist by name, department, or qualification (e.g. Deshmukh, Cardiology, KEM Hospital)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Specialty Pill Filters */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              {departmentsList.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                    selectedDept === dept
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30'
                      : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          {/* Doctors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {filteredSpecialists.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-950 p-6 rounded-3xl border border-slate-800/80 hover:border-blue-500/50 transition-all hover:-translate-y-1 group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  {/* Doctor Header */}
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${doc.avatarBg} flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0`}>
                      {doc.name.split(' ')[1]?.[0] || 'D'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-extrabold text-white text-base group-hover:text-blue-400 transition-colors">{doc.name}</h3>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-xs text-blue-400 font-semibold mt-0.5">{doc.title}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
                        {doc.department}
                      </span>
                    </div>
                  </div>

                  {/* Qualification */}
                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-300 font-medium">
                    {doc.qualification}
                  </div>

                  {/* Rating, Experience, Fee */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800/60">
                      <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {doc.rating}
                      </div>
                      <span className="text-[10px] text-slate-500">({doc.reviews})</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800/60">
                      <div className="font-bold text-slate-200">{doc.experience}+ Yrs</div>
                      <span className="text-[10px] text-slate-500">Experience</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-800/60">
                      <div className="font-bold text-emerald-400">₹{doc.fee}</div>
                      <span className="text-[10px] text-slate-500">OPD Fee</span>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-[11px] truncate">{doc.availability}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
                  <button
                    onClick={() => setSelectedDoctorModal(doc)}
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 transition-colors"
                  >
                    View Profile
                  </button>
                  <Link
                    to="/register"
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition-colors shadow-md shadow-blue-600/20"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredSpecialists.length === 0 && (
            <div className="p-12 text-center bg-slate-950 rounded-3xl border border-slate-800 space-y-3 max-w-md mx-auto">
              <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="font-bold text-white text-base">No Specialists Found</h3>
              <p className="text-xs text-slate-400">No medical specialist matching "{searchQuery}" in {selectedDept}.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedDept('All'); }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Centers of Excellence */}
      <section id="centers" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Centers of Excellence</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Advanced medical departments staffed by senior board-certified specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {[
            { title: 'Institute of Cardiac Sciences', code: 'DEP001', desc: 'Comprehensive interventional cardiology, TAVI, cardiac surgery, and heart failure management.', icon: HeartPulse, color: 'text-rose-400' },
            { title: 'Institute of Neurosciences', code: 'DEP006', desc: 'Advanced stroke care unit, neurosurgery, epilepsy management, and brain tumor surgery.', icon: Activity, color: 'text-purple-400' },
            { title: 'Orthopedics & Joint Replacement', code: 'DEP004', desc: 'Robotic knee & hip replacements, arthroscopy, complex trauma, and pediatric orthopedics.', icon: Stethoscope, color: 'text-blue-400' },
            { title: 'Center for Dermatology & Aesthetic', code: 'DEP002', desc: 'Clinical dermatology, laser surgery, skin cancer screening, and cosmetic procedure clinic.', icon: Sparkles, color: 'text-amber-400' },
            { title: 'Internal & General Medicine', code: 'DEP003', desc: 'Multisystem disease diagnosis, hypertension, diabetes management, and preventive health.', icon: Building2, color: 'text-emerald-400' },
            { title: 'Child Health & Pediatrics', code: 'DEP005', desc: 'Pediatric intensive care (PICU), neonatal care (NICU), pediatric cardiology, and growth clinic.', icon: Users, color: 'text-sky-400' },
          ].map((c, i) => (
            <div key={i} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <c.icon className={`w-6 h-6 ${c.color}`} />
                <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-800 px-2 py-0.5 rounded">{c.code}</span>
              </div>
              <h3 className="text-base font-bold text-white">{c.title}</h3>
              <p className="text-slate-400 leading-relaxed text-[11px]">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Diagnostics & Lab Facilities */}
      <section id="diagnostics" className="py-16 px-4 sm:px-8 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
              <Microscope className="w-4 h-4 text-blue-400" /> Advanced Diagnostic Imaging
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Precision Pathology & Diagnostic Services</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Equipped with high-precision diagnostic technologies for fast and accurate clinical results. Integrated directly into the patient EMR.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 font-medium">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 3.0 Tesla Silent MRI
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> 128-Slice Cardiac CT
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Automated Pathology Lab
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Digital Mammography
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" /> Cashless Insurance & TPA Partners
            </h3>
            <p className="text-xs text-slate-400">
              Empaneled with all major health insurance providers and government health schemes for seamless cashless hospitalization.
            </p>
            <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono">
              Cashless Helpdesk: +91 98220 11223 &bull; Room 102 First Floor
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Profile Interactive Modal */}
      {selectedDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedDoctorModal(null)}
              className="absolute right-5 top-5 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${selectedDoctorModal.avatarBg} flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shrink-0`}>
                {selectedDoctorModal.name.split(' ')[1]?.[0] || 'D'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-white text-lg">{selectedDoctorModal.name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs text-blue-400 font-bold mt-0.5">{selectedDoctorModal.title}</p>
                <span className="inline-block mt-1 text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {selectedDoctorModal.department} ({selectedDoctorModal.code})
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Qualification & Affiliation</span>
                <span className="text-slate-200 font-medium">{selectedDoctorModal.qualification}</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase">Clinical Bio</span>
                <p className="text-slate-300 leading-relaxed">{selectedDoctorModal.bio}</p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">Clinical Procedures & Expertise</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDoctorModal.specialties.map((spec, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-semibold">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">OPD Consultation Fee</span>
                  <span className="text-base font-extrabold text-emerald-400">₹{selectedDoctorModal.fee}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Experience</span>
                  <span className="text-base font-extrabold text-white">{selectedDoctorModal.experience}+ Years</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedDoctorModal(null)}
                className="w-1/3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
              >
                Close
              </button>
              <Link
                to="/register"
                onClick={() => setSelectedDoctorModal(null)}
                className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs text-center transition-all shadow-lg shadow-blue-600/30"
              >
                Book Appointment with {selectedDoctorModal.name.split(' ')[1]}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-300 text-sm">ApexCare Super Specialty Hospital</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              AI-assisted healthcare management platform &mdash; for demonstration purposes.
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <Link to="/login" className="hover:text-white transition-colors">Portal Access</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
