import React from 'react';

interface HeroBannerProps {
  onOpenMatchmaker?: () => void;
  onOpenTrainerPortal?: () => void;
  trainerCount?: number;
}

export function HeroBanner({
  onOpenMatchmaker,
  onOpenTrainerPortal,
  trainerCount,
}: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#A14646] via-[#DA6556] to-[#EB895B] text-white py-20 px-6 sm:px-12 border-b border-[#A14646]/30 shadow-inner">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        
        {/* Formal Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-[#FDB773] text-xs font-semibold uppercase tracking-widest border border-white/20">
          Maslow SA Sdn Bhd • Professional Corporate &amp; Educational Development
        </span>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
          Empowering Excellence Through <span className="text-[#FDB773] underline decoration-[#FDB773]/40">Self-Actualisation</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-white/90 max-w-3xl mx-auto font-normal leading-relaxed">
          Elevate organizational performance and professional capabilities with our accredited public courses, bespoke in-house corporate training, and specialized educator advancement programs.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <button
            type="button"
            onClick={onOpenMatchmaker}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FDB773] text-slate-900 font-bold text-sm shadow-lg hover:bg-white transition flex items-center justify-center gap-2 cursor-pointer"
          >
            ✨ AI Training Consultant &amp; Matchmaker →
          </button>
          <button
            type="button"
            onClick={onOpenTrainerPortal}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/15 border border-white/30 text-white font-semibold text-sm backdrop-blur-md hover:bg-white/25 transition cursor-pointer"
          >
            Upload Trainer Credentials
          </button>
        </div>

        {/* Key Metrics / Highlights Footer Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 mt-12 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left">
            <div className="text-xs font-semibold text-[#FDB773] uppercase tracking-wider">HRD Corp Claimable</div>
            <div className="text-lg font-bold text-white mt-1">100% Eligible</div>
            <div className="text-[11px] text-white/80">Approved grant courses</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left">
            <div className="text-xs font-semibold text-[#FDB773] uppercase tracking-wider">Verified Experts</div>
            <div className="text-lg font-bold text-white mt-1">
              {trainerCount ? `${trainerCount}+ Certified` : 'Certified Trainers'}
            </div>
            <div className="text-[11px] text-white/80">Educators &amp; corporate leaders</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left">
            <div className="text-xs font-semibold text-[#FDB773] uppercase tracking-wider">Smart Matching</div>
            <div className="text-lg font-bold text-white mt-1">Instant Results</div>
            <div className="text-[11px] text-white/80">Tailored syllabus planning</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-left">
            <div className="text-xs font-semibold text-[#FDB773] uppercase tracking-wider">Core Domains</div>
            <div className="text-lg font-bold text-white mt-1">Schools &amp; SMEs</div>
            <div className="text-[11px] text-white/80">In-house &amp; public sessions</div>
          </div>
        </div>

      </div>
    </section>
  );
}
