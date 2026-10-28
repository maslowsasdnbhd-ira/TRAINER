import React from 'react';

interface TopBarProps {
  role: string;
  username: string;
  onSignOut: () => void;
}

export function TopBar({ role, username, onSignOut }: TopBarProps) {
  // Capitalize role display nicely
  const formattedRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';

  return (
    <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between text-sm shadow-sm">
      
      {/* Left Side: Current Signed-In User & Role */}
      <div className="flex items-center gap-3">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 text-xs sm:text-sm">Signed in as:</span>
          <span className="font-semibold text-white text-xs sm:text-sm">{username}</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#A14646]/30 text-[#FDB773] text-xs font-medium border border-[#A14646]/40">
            Role: {formattedRole}
          </span>
        </div>
      </div>

      {/* Right Side: Sign Out Button Only */}
      <div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-medium border border-slate-700 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>

    </div>
  );
}
