import React from 'react';
import { Award, Sparkles, UserPlus, BookOpen, FileCheck, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  currentTab: 'directory' | 'matchmaker' | 'onboarding';
  setCurrentTab: (tab: 'directory' | 'matchmaker' | 'onboarding') => void;
  trainerCount: number;
  rfpCount: number;
  onOpenRfps: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  trainerCount,
  rfpCount,
  onOpenRfps,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('directory')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  TrainMatch<span className="text-blue-600">.ai</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                  TTT Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Certified Train-the-Trainer Marketplace
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentTab('directory')}
              className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'directory'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-1.5 text-blue-600" />
              Directory
              <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold border border-slate-200">
                {trainerCount}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('matchmaker')}
              className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'matchmaker'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-indigo-600" />
              AI Matchmaker
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                Gemini
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('onboarding')}
              className={`flex items-center px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                currentTab === 'onboarding'
                  ? 'bg-white text-amber-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <UserPlus className="w-4 h-4 mr-1.5 text-amber-600" />
              Trainer Portal
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 font-bold border border-amber-200">
                AI Parser
              </span>
            </button>
          </nav>

          {/* Right Action / RFP Tracker */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenRfps}
              className="relative flex items-center px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <FileCheck className="w-4 h-4 mr-1.5 text-slate-600" />
              <span className="hidden sm:inline">Training Proposals</span>
              <span className="sm:hidden">RFPs</span>
              {rfpCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                  {rfpCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('onboarding')}
              className="hidden lg:flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
            >
              Upload Credentials
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
