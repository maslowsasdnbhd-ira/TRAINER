import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  onLogin: (role: 'admin' | 'trainer' | 'client', username: string, userProfile?: UserProfile) => void;
  isOpen?: boolean;
  onClose?: () => void;
  canClose?: boolean;
  registeredUsers?: UserProfile[];
  onOpenRegister?: (role: 'trainer' | 'client') => void;
}

export function LoginModal({
  onLogin,
  isOpen = true,
  onClose,
  canClose = false,
  registeredUsers = [],
  onOpenRegister,
}: LoginModalProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (passwordInput !== '1234') {
      setError('Invalid credentials. Password must be 1234.');
      return;
    }

    const cleanInput = usernameInput.trim().toLowerCase();

    // 1. Check if matching any registered user profile (by ID, email, or telephone)
    const matchedProfile = registeredUsers.find(
      (u) =>
        u.id.toLowerCase() === cleanInput ||
        u.email.toLowerCase() === cleanInput ||
        u.telephone.replace(/[-\s]/g, '') === cleanInput.replace(/[-\s]/g, '') ||
        u.fullName.toLowerCase() === cleanInput
    );

    if (matchedProfile) {
      if (matchedProfile.status === 'pending') {
        setError(
          `Your registration (${matchedProfile.id} - ${matchedProfile.fullName}) is currently pending admin approval. You will receive an activation email once approved.`
        );
        return;
      }
      if (matchedProfile.status === 'rejected') {
        setError(
          `Your registration request (${matchedProfile.id}) was not approved. Please contact sales@maslowsa.com.`
        );
        return;
      }
      // Approved user
      onLogin(matchedProfile.role, matchedProfile.fullName, matchedProfile);
      return;
    }

    // 2. Default standard roles
    if (cleanInput === 'admin') {
      onLogin('admin', 'Admin');
    } else if (cleanInput === 'trainer') {
      onLogin('trainer', 'Trainer');
    } else if (cleanInput === 'client') {
      onLogin('client', 'Client');
    } else {
      setError('Unrecognized user ID or account credentials. Please register below if you are new.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-100">
        
        {canClose && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Header Logo & Title */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center mb-2">
            <img 
              src="/assets/maslow-logo.png" 
              alt="Maslow SA Sdn Bhd Logo" 
              className="h-14 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = '/assets/maslow-logo.svg';
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign In to Maslow SA Portal</h2>
          <p className="text-xs text-slate-500 font-medium">Helping You Reach Self-Actualisation</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 leading-relaxed">
            {error}
          </div>
        )}

        {/* Manual Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Username or Unique ID / Phone
            </label>
            <input 
              type="text" 
              placeholder="e.g. TR-1001, CL-2001, admin, trainer, client"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#A14646] text-sm text-slate-800 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#A14646] text-sm text-slate-800 bg-white"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#A14646] to-[#DA6556] text-white font-semibold shadow-md hover:opacity-95 transition text-sm cursor-pointer"
          >
            Sign In →
          </button>
        </form>

        {/* Registration Options Footer */}
        {onOpenRegister && (
          <div className="mt-6 pt-5 border-t border-slate-100 text-center space-y-2">
            <span className="text-xs text-slate-500">Need a verified account?</span>
            <div className="flex items-center justify-center gap-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => onOpenRegister('trainer')}
                className="text-[#A14646] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" /> Register as Trainer
              </button>
              <span className="text-slate-300">•</span>
              <button
                type="button"
                onClick={() => onOpenRegister('client')}
                className="text-[#DA6556] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Register as Client
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
