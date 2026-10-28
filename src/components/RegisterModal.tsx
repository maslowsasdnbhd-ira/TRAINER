import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';

interface RegisterModalProps {
  role: 'trainer' | 'client';
  existingUsers: UserProfile[];
  onRegisterSubmit: (newUser: UserProfile) => void;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  onRoleChange?: (role: 'trainer' | 'client') => void;
}

export function RegisterModal({
  role,
  existingUsers,
  onRegisterSubmit,
  onClose,
  onSwitchToLogin,
  onRoleChange,
}: RegisterModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = telephone.trim().replace(/[-\s]/g, '');
    const cleanIc = icNumber.trim().replace(/[-\s]/g, '').toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check for duplicate telephone, IC number, or email
    const duplicatePhone = existingUsers.some(
      (u) => u.telephone.trim().replace(/[-\s]/g, '') === cleanPhone
    );
    const duplicateIc = existingUsers.some(
      (u) => u.icNumber.trim().replace(/[-\s]/g, '').toUpperCase() === cleanIc
    );
    const duplicateEmail = existingUsers.some(
      (u) => u.email.trim().toLowerCase() === cleanEmail
    );

    if (duplicatePhone) {
      setError('This telephone number is already registered. Please log in or use a unique number.');
      return;
    }

    if (duplicateIc) {
      setError('This IC / Passport number is already registered in our system.');
      return;
    }

    if (duplicateEmail) {
      setError('This email address is already registered. Please log in or use another email.');
      return;
    }

    // Generate unique ID based on role
    const prefix = role === 'trainer' ? 'TR-' : 'CL-';
    let uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    let newId = `${prefix}${uniqueNumber}`;
    // Ensure uniqueness
    while (existingUsers.some((u) => u.id === newId)) {
      uniqueNumber = Math.floor(1000 + Math.random() * 9000);
      newId = `${prefix}${uniqueNumber}`;
    }

    const newUser: UserProfile = {
      id: newId,
      role,
      fullName: fullName.trim(),
      email: cleanEmail,
      telephone: telephone.trim(),
      icNumber: icNumber.trim(),
      status: 'pending', // Requires admin approval
      createdAt: new Date().toISOString(),
    };

    setGeneratedId(newId);
    onRegisterSubmit(newUser);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Role Switcher Pill Bar (if onRoleChange provided) */}
        {!success && (
          <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => onRoleChange && onRoleChange('trainer')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                role === 'trainer'
                  ? 'bg-white text-[#A14646] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Trainer Registration
            </button>
            <button
              type="button"
              onClick={() => onRoleChange && onRoleChange('client')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                role === 'client'
                  ? 'bg-white text-[#A14646] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Client Registration
            </button>
          </div>
        )}

        <div className="mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#DA6556]" />
            <h2 className="text-xl font-bold text-slate-900">
              Register as {role === 'trainer' ? 'Trainer' : 'Client'}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'trainer'
              ? 'Join Maslow SA verified trainers pool with unique TR-ID & credential auditing.'
              : 'Register your corporate or school account with unique CL-ID for HRD Corp courses.'}
          </p>
        </div>

        {success ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Registration Submitted!</h3>
              <p className="text-xs text-slate-500">
                Assigned ID: <span className="font-extrabold text-[#A14646] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{generatedId}</span>
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Next Steps (Admin Approval Flow):</p>
              <p>
                1. Your profile is queued in the <strong>Admin Approval Portal</strong>.
              </p>
              <p>
                2. Once approved, an official activation confirmation will be dispatched via email to <strong className="text-slate-900">{email}</strong>.
              </p>
              <p>
                3. You can then log in using your ID or username with password <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">1234</code>.
              </p>
            </div>

            <button 
              type="button"
              onClick={() => {
                if (onSwitchToLogin) onSwitchToLogin();
                else onClose();
              }}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition cursor-pointer"
            >
              Proceed to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3.5">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Aiman Zulkifli / Sarah Lee"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Email Address
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Telephone Number (Unique)
              </label>
              <input 
                type="tel" 
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="e.g. 0126687300 or +60 12-441 9982"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                required
              />
              <span className="text-[10px] text-slate-400">Checked against existing accounts to prevent duplicates.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                IC Number / Passport (Unique)
              </label>
              <input 
                type="text" 
                value={icNumber}
                onChange={(e) => setIcNumber(e.target.value)}
                placeholder="e.g. 900101-14-5521 or A12345678"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                required
              />
              <span className="text-[10px] text-slate-400">Malaysian NRIC or valid passport identification.</span>
            </div>

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A14646] to-[#DA6556] text-white font-semibold text-sm shadow-md hover:opacity-95 transition mt-2 cursor-pointer"
            >
              Submit Registration for Approval →
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onSwitchToLogin) onSwitchToLogin();
                  else onClose();
                }}
                className="text-xs text-slate-500 hover:text-[#A14646] font-semibold transition"
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
