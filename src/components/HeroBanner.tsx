import React from 'react';
import { Sparkles, ShieldCheck, UploadCloud, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onOpenMatchmaker: () => void;
  onOpenTrainerPortal: () => void;
  trainerCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenMatchmaker,
  onOpenTrainerPortal,
  trainerCount,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-900 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        {/* Top Badges */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Maslow SA Sdn Bhd • Powered by Google AI Studio</span>
          <span className="text-blue-400">•</span>
          <span className="text-emerald-300 font-semibold flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified TTT Directory
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Match Your Organization with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-sky-200 to-amber-300">
            Certified TTT Trainers
          </span>
        </h1>

        {/* Description */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
          Maslow SA Sdn Bhd bridges corporate organizations, GLCs, and SMEs with top certified
          Train-the-Trainer (TTT) professionals. Backed by Google AI Studio multimodal verification
          and HRD Corp claimable syllabus alignment.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenMatchmaker}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/20 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 mr-2 text-slate-950" />
            Try AI Natural Language Matchmaker
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>

          <button
            onClick={onOpenTrainerPortal}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <UploadCloud className="w-4 h-4 mr-2 text-blue-300" />
            Upload TTT Credentials (AI Onboarding)
          </button>
        </div>

        {/* Live Metrics bar */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center text-amber-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> HRD Corp & TTT
            </div>
            <div className="text-xl font-bold text-white mt-1">100% Verified</div>
            <div className="text-[11px] text-slate-400">Official registry check</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center text-blue-300 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 mr-1" /> Active Instructors
            </div>
            <div className="text-xl font-bold text-white mt-1">{trainerCount}+ Trainers</div>
            <div className="text-[11px] text-slate-400">APAC & International</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> AI Parsing
            </div>
            <div className="text-xl font-bold text-white mt-1">&lt; 30 Seconds</div>
            <div className="text-[11px] text-slate-400">Zero manual form entry</div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center text-purple-300 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Grant Eligibility
            </div>
            <div className="text-xl font-bold text-white mt-1">Claimable</div>
            <div className="text-[11px] text-slate-400">Levy claim supported</div>
          </div>
        </div>
      </div>
    </div>
  );
};
