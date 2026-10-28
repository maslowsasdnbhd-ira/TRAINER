import React, { useState } from 'react';
import { Menu, X, ShieldAlert } from 'lucide-react';
import { AuthState } from '../types';

export interface NavbarProps {
  currentTab?: 'directory' | 'matchmaker' | 'onboarding' | 'approvals';
  setCurrentTab?: (tab: 'directory' | 'matchmaker' | 'onboarding' | 'approvals') => void;
  trainerCount?: number;
  rfpCount?: number;
  pendingApprovalsCount?: number;
  onOpenRfps?: () => void;
  auth?: AuthState;
  onSignOut?: () => void;
  onOpenLogin?: () => void;
}

export function Navbar({
  currentTab = 'directory',
  setCurrentTab,
  pendingApprovalsCount = 0,
  auth,
}: NavbarProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const role = auth?.role || 'admin';

  const handleNavigate = (tab: 'directory' | 'matchmaker' | 'onboarding' | 'approvals') => {
    setCurrentTab?.(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const el = document.getElementById('about-us');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        
        {/* Official Logo (Including Name & Reg No inside the graphic) */}
        <div className="flex items-center">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              if (role === 'trainer') {
                handleNavigate('onboarding');
              } else {
                handleNavigate('directory');
              }
            }}
            className="flex items-center py-2"
          >
            <img 
              src="/assets/maslow-logo.png" 
              alt="Maslow SA Sdn Bhd Logo" 
              className="h-16 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.src = '/assets/maslow-logo.svg';
              }}
            />
          </a>
        </div>

        {/* Formal Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          {role !== 'trainer' && (
            <>
              <a 
                href="#course-catalog" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('directory');
                  const el = document.getElementById('course-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`transition ${currentTab === 'directory' ? 'text-[#A14646] font-semibold' : 'hover:text-[#A14646]'}`}
              >
                Courses
              </a>
              <a 
                href="#course-catalog" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('directory');
                  const el = document.getElementById('course-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="hover:text-[#A14646] transition"
              >
                Public Training
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('matchmaker');
                }}
                className={`transition ${currentTab === 'matchmaker' ? 'text-[#A14646] font-semibold' : 'hover:text-[#A14646]'}`}
              >
                In-House
              </a>
            </>
          )}
          {role === 'admin' && (
            <>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('onboarding');
                }}
                className={`transition ${currentTab === 'onboarding' ? 'text-[#A14646] font-semibold' : 'hover:text-[#A14646]'}`}
              >
                Trainer Portal
              </a>
              <a 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate('approvals');
                }}
                className={`transition relative flex items-center gap-1.5 ${currentTab === 'approvals' ? 'text-[#A14646] font-bold' : 'hover:text-[#A14646]'}`}
              >
                Approvals
                {pendingApprovalsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A14646] text-white">
                    {pendingApprovalsCount}
                  </span>
                )}
              </a>
            </>
          )}
          {role === 'trainer' && (
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                handleNavigate('onboarding');
              }}
              className={`transition ${currentTab === 'onboarding' ? 'text-[#A14646] font-semibold' : 'hover:text-[#A14646]'}`}
            >
              Upload CV / Certs
            </a>
          )}
          <a 
            href="#about-us" 
            onClick={handleAboutClick}
            className="hover:text-[#A14646] transition"
          >
            About Us
          </a>
        </nav>

        {/* Right Action Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a 
            href="mailto:sales@maslowsa.com"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A14646] to-[#DA6556] text-white font-semibold text-sm shadow-sm hover:opacity-95 transition"
          >
            Contact Us
          </a>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Responsive Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {role !== 'trainer' && (
            <>
              <button
                type="button"
                onClick={() => {
                  handleNavigate('directory');
                  const el = document.getElementById('course-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                  currentTab === 'directory' ? 'bg-[#A14646]/10 text-[#A14646] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Courses
              </button>
              <button
                type="button"
                onClick={() => {
                  handleNavigate('directory');
                  const el = document.getElementById('course-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Public Training
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('matchmaker')}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                  currentTab === 'matchmaker' ? 'bg-[#A14646]/10 text-[#A14646] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                In-House Training
              </button>
            </>
          )}
          {role === 'admin' && (
            <>
              <button
                type="button"
                onClick={() => handleNavigate('onboarding')}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                  currentTab === 'onboarding' ? 'bg-[#A14646]/10 text-[#A14646] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Trainer Portal
              </button>
              <button
                type="button"
                onClick={() => handleNavigate('approvals')}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-between ${
                  currentTab === 'approvals' ? 'bg-[#A14646]/10 text-[#A14646] font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Admin Approvals</span>
                {pendingApprovalsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#A14646] text-white">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>
            </>
          )}
          {role === 'trainer' && (
            <button
              type="button"
              onClick={() => handleNavigate('onboarding')}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium ${
                currentTab === 'onboarding' ? 'bg-[#A14646]/10 text-[#A14646] font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Upload CV / Certs
            </button>
          )}
          <a
            href="#about-us"
            onClick={handleAboutClick}
            className="block w-full py-2 px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            About Us
          </a>
          <div className="pt-2">
            <a
              href="mailto:sales@maslowsa.com"
              className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#A14646] to-[#DA6556] text-white font-semibold text-sm shadow-sm"
            >
              Contact Us: sales@maslowsa.com
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
