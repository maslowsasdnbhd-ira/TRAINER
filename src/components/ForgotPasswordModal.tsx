import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, KeyRound, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface ForgotPasswordModalProps {
  users: UserProfile[];
  onPasswordReset: (identifier: string, newPass: string) => void;
  onClose: () => void;
}

export function ForgotPasswordModal({ users, onPasswordReset, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<'verify' | 'reset'>('verify');
  const [identifier, setIdentifier] = useState('');
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  
  // Password states & visibility toggles
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = identifier.trim().toLowerCase();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanInput ||
        u.telephone.replace(/[-\s]/g, '') === cleanInput.replace(/[-\s]/g, '') ||
        u.id.toLowerCase() === cleanInput
    );

    // Support standard admin/trainer/client quick credentials as well
    if (!found && cleanInput !== 'admin' && cleanInput !== 'trainer' && cleanInput !== 'client') {
      setError('No account found matching this email, telephone, or ID.');
      return;
    }

    if (found) {
      setMatchedUser(found);
    }
    setStep('reset');
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please confirm your new password.');
      return;
    }

    onPasswordReset(identifier, newPassword);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#A14646]" />
            <h2 className="text-xl font-bold text-slate-900">Reset Password</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="space-y-4 text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Password Updated Successfully!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your new password has been saved. You can now sign in with your updated credentials.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition cursor-pointer"
            >
              Proceed to Sign In
            </button>
          </div>
        ) : step === 'verify' ? (
          <form onSubmit={handleVerify} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 text-center">
                {error}
              </div>
            )}
            <p className="text-xs text-slate-600 leading-relaxed">
              Enter your registered Email, Telephone number, or User ID (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">TR-1001</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">CL-2001</code>) to verify your account identity.
            </p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Account Identifier
              </label>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email, Phone, or ID"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#A14646] text-white font-semibold text-sm shadow-md hover:opacity-95 transition cursor-pointer"
            >
              Verify Account →
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 text-center">
                {error}
              </div>
            )}
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Account verified for <strong>{matchedUser?.fullName || identifier}</strong> ({matchedUser?.id || identifier}).
              </span>
            </div>
            
            {/* New Password Field with Show/Hide toggle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                New Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field with Show/Hide toggle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm shadow-md hover:bg-emerald-700 transition cursor-pointer"
            >
              Update Password &amp; Confirm →
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
