import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, Send, ShieldCheck, UserCheck, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  existingUsers: UserProfile[];
  onRegisterSubmit: (newUser: UserProfile) => void;
  onLogin: (role: 'admin' | 'trainer' | 'client', username: string, userProfile?: UserProfile) => void;
  isOpen?: boolean;
  onClose?: () => void;
  canClose?: boolean;
  onOpenForgotPassword?: () => void;
}

export function AuthModal({
  existingUsers,
  onRegisterSubmit,
  onLogin,
  isOpen = true,
  onClose,
  canClose = false,
  onOpenForgotPassword,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(true); // Default to Sign Up first as requested
  const [roleChoice, setRoleChoice] = useState<'trainer' | 'client'>('trainer');

  // Sign Up Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [icNumber, setIcNumber] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In Form States
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanPhone = telephone.trim().replace(/[-\s]/g, '');
    const cleanIc = icNumber.trim().replace(/[-\s]/g, '').toUpperCase();
    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate telephone or IC
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
      setError('This IC number / Passport is already registered in our system.');
      return;
    }

    if (duplicateEmail) {
      setError('This email address is already registered in our system.');
      return;
    }

    // Generate unique ID
    const prefix = roleChoice === 'trainer' ? 'TR-' : 'CL-';
    let uniqueNumber = Math.floor(1000 + Math.random() * 9000);
    let newId = `${prefix}${uniqueNumber}`;
    while (existingUsers.some((u) => u.id === newId)) {
      uniqueNumber = Math.floor(1000 + Math.random() * 9000);
      newId = `${prefix}${uniqueNumber}`;
    }

    const newUser: UserProfile = {
      id: newId,
      role: roleChoice,
      fullName: fullName.trim(),
      email: cleanEmail,
      telephone: telephone.trim(),
      icNumber: icNumber.trim(),
      status: 'pending', // Pending admin approval
      createdAt: new Date().toISOString(),
      password: '1234',
    };

    onRegisterSubmit(newUser);

    // Simulate sending email notification to admin info@maslowsa.com
    console.log(
      `[Email Notification Sent to info@maslowsa.com]: New ${roleChoice} registration pending review for ${fullName} (${newId})`
    );

    setSuccessMsg(
      `Registration successful! Your ID is ${newId}. An email notification has been sent to admin (info@maslowsa.com) for review.`
    );

    // Clear form
    setFullName('');
    setEmail('');
    setTelephone('');
    setIcNumber('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = loginId.trim().toLowerCase();

    // Find user by ID, email, or telephone
    const foundUser = existingUsers.find(
      (u) =>
        u.id.toLowerCase() === cleanInput ||
        u.email.toLowerCase() === cleanInput ||
        u.telephone.replace(/[-\s]/g, '') === cleanInput.replace(/[-\s]/g, '') ||
        u.fullName.toLowerCase() === cleanInput
    );

    // Master admin check
    if (cleanInput === 'admin') {
      const adminPass = foundUser?.password || '1234';
      if (loginPassword !== adminPass) {
        setError('Invalid password. Please try again.');
        return;
      }
      onLogin('admin', 'Admin');
      return;
    }

    // Quick demo role accounts (if not customized)
    if (!foundUser && (cleanInput === 'trainer' || cleanInput === 'client')) {
      if (loginPassword !== '1234') {
        setError('Invalid password. Please try again.');
        return;
      }
      onLogin(cleanInput, cleanInput.charAt(0).toUpperCase() + cleanInput.slice(1));
      return;
    }

    if (!foundUser) {
      setError('User ID, email, or telephone not found. Please sign up first.');
      return;
    }

    // Check password against stored user password
    const userPassword = foundUser.password || '1234';
    if (loginPassword !== userPassword) {
      setError('Invalid password. Please try again.');
      return;
    }

    if (foundUser.status !== 'approved') {
      setError('Your account is currently pending review by admin (info@maslowsa.com). Please wait for approval.');
      return;
    }

    onLogin(foundUser.role, foundUser.fullName, foundUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100 max-h-[92vh] overflow-y-auto">
        
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
          <div className="flex justify-center mb-1">
            <img 
              src="/assets/maslow-logo.png" 
              alt="Maslow SA Sdn Bhd Logo" 
              className="h-14 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = '/assets/maslow-logo.svg';
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Maslow SA Sdn Bhd Portal</h2>
          <p className="text-xs text-slate-500 font-medium">Helping You Reach Self-Actualisation</p>
        </div>

        {/* Tab Switcher: Sign Up appears first as requested */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign Up (New User)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
              !isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200 text-center leading-relaxed">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200 text-left leading-relaxed space-y-2">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">{successMsg}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 mt-1">
                  <Send className="w-3 h-3" /> Notification queued to: <strong>info@maslowsa.com</strong>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-emerald-200/60 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);
                  setSuccessMsg('');
                }}
                className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
              >
                Go to Sign In →
              </button>
            </div>
          </div>
        )}

        {isSignUp ? (
          /* Sign Up Form (Appears First) */
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Registering As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRoleChoice('trainer')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    roleChoice === 'trainer'
                      ? 'border-[#A14646] bg-red-50/50 text-[#A14646]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Trainer
                </button>
                <button
                  type="button"
                  onClick={() => setRoleChoice('client')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    roleChoice === 'client'
                      ? 'border-[#A14646] bg-red-50/50 text-[#A14646]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Client
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
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
                placeholder="name@example.com"
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
                placeholder="e.g. 0126687300"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                IC Number / Passport (Unique)
              </label>
              <input 
                type="text" 
                value={icNumber}
                onChange={(e) => setIcNumber(e.target.value)}
                placeholder="e.g. 900101-14-5521"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#A14646] to-[#DA6556] text-white font-semibold text-sm shadow-md hover:opacity-95 transition mt-2 cursor-pointer flex items-center justify-center gap-1.5"
            >
              Submit Sign Up (Notify info@maslowsa.com) →
            </button>
          </form>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                User ID, Email, or Telephone
              </label>
              <input 
                type="text" 
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="e.g. TR-1042, email, or phone"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Password
                </label>
                {onOpenForgotPassword && (
                  <button
                    type="button"
                    onClick={onOpenForgotPassword}
                    className="text-xs font-semibold text-[#A14646] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showLoginPassword ? 'text' : 'password'} 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#A14646] bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#A14646] to-[#DA6556] text-white font-semibold text-sm shadow-md hover:opacity-95 transition mt-2 cursor-pointer"
            >
              Sign In →
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
