import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DirectoryView } from './components/DirectoryView';
import { AIMatchmakerView } from './components/AIMatchmakerView';
import { TrainerUploadPortal } from './components/TrainerUploadPortal';
import { TrainerDetailModal } from './components/TrainerDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingsDrawer } from './components/BookingsDrawer';
import { INITIAL_TRAINERS } from './data/initialTrainers';
import { Trainer, CourseOffering, BookingRFP } from './types';
import { ShieldCheck, Sparkles, Award, Heart, HelpCircle, ExternalLink } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'directory' | 'matchmaker' | 'onboarding'>('directory');
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [bookingTrainer, setBookingTrainer] = useState<Trainer | null>(null);
  const [bookingCourse, setBookingCourse] = useState<CourseOffering | undefined>(undefined);
  const [bookings, setBookings] = useState<BookingRFP[]>([]);
  const [isRfpsDrawerOpen, setIsRfpsDrawerOpen] = useState(false);

  // Fetch trainers and bookings from server
  useEffect(() => {
    fetch('/api/trainers')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTrainers(data);
        }
      })
      .catch((err) => console.log('Using seeded trainers'));

    fetch('/api/bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        }
      })
      .catch(() => {});
  }, []);

  // When a newly parsed trainer profile is published
  const handleProfilePublished = (newTrainer: Trainer) => {
    setTrainers((prev) => [newTrainer, ...prev.filter((t) => t.id !== newTrainer.id)]);
  };

  // When a corporate RFP is submitted
  const handleBookingCreated = (newRfp: BookingRFP) => {
    setBookings((prev) => [newRfp, ...prev]);
  };

  const handleOpenBooking = (trainer: Trainer, course?: CourseOffering) => {
    setBookingTrainer(trainer);
    setBookingCourse(course);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        trainerCount={trainers.length}
        rfpCount={bookings.length}
        onOpenRfps={() => setIsRfpsDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero banner shown on Directory view */}
        {currentTab === 'directory' && (
          <HeroBanner
            onOpenMatchmaker={() => setCurrentTab('matchmaker')}
            onOpenTrainerPortal={() => setCurrentTab('onboarding')}
            trainerCount={trainers.length}
          />
        )}

        {/* Tab 1: Directory */}
        {currentTab === 'directory' && (
          <DirectoryView
            trainers={trainers}
            onSelectTrainer={(t) => setSelectedTrainer(t)}
            onRequestBooking={handleOpenBooking}
            onOpenMatchmaker={() => setCurrentTab('matchmaker')}
            onOpenTrainerPortal={() => setCurrentTab('onboarding')}
          />
        )}

        {/* Tab 2: AI Matchmaker */}
        {currentTab === 'matchmaker' && (
          <AIMatchmakerView
            trainers={trainers}
            onSelectTrainer={(t) => setSelectedTrainer(t)}
            onRequestBooking={handleOpenBooking}
          />
        )}

        {/* Tab 3: Trainer Upload & AI Onboarding Portal */}
        {currentTab === 'onboarding' && (
          <TrainerUploadPortal
            onProfilePublished={handleProfilePublished}
            onNavigateToDirectory={() => setCurrentTab('directory')}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <TrainerDetailModal
        trainer={selectedTrainer}
        onClose={() => setSelectedTrainer(null)}
        onRequestBooking={handleOpenBooking}
      />

      <BookingModal
        trainer={bookingTrainer}
        selectedCourse={bookingCourse}
        onClose={() => {
          setBookingTrainer(null);
          setBookingCourse(undefined);
        }}
        onBookingCreated={handleBookingCreated}
      />

      <BookingsDrawer
        isOpen={isRfpsDrawerOpen}
        onClose={() => setIsRfpsDrawerOpen(false)}
        bookings={bookings}
      />

      {/* Platform Footer */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                  <Award className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  TrainMatch<span className="text-blue-400">.ai</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Empowering enterprise learning &amp; development teams with verified Train-the-Trainer
                (TTT) experts through Google AI Studio multimodal document verification and semantic
                matching.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
                Accreditation Standards
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white transition-colors">HRD Corp TTT Certification</li>
                <li className="hover:text-white transition-colors">ISO 14064 &amp; 45001 Lead Auditor</li>
                <li className="hover:text-white transition-colors">IASSC Lean Six Sigma Master Black Belt</li>
                <li className="hover:text-white transition-colors">Cambridge International Training</li>
                <li className="hover:text-white transition-colors">ATD Master Facilitator</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
                Platform Capabilities
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li className="hover:text-white transition-colors flex items-center">
                  <Sparkles className="w-3 h-3 mr-1.5 text-amber-400" />
                  Gemini 3.8 Flash Multimodal OCR
                </li>
                <li className="hover:text-white transition-colors">Automated Structured JSON Output</li>
                <li className="hover:text-white transition-colors">Natural Language Matchmaker</li>
                <li className="hover:text-white transition-colors">Instant RFP &amp; Budget Quotations</li>
                <li className="hover:text-white transition-colors">Registry Audit Trail</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider mb-3">
                For Organizations &amp; Trainers
              </h4>
              <p className="text-slate-400 text-xs mb-3">
                Need to conduct a 100% HRD Corp levy-claimable training for your corporate team?
              </p>
              <button
                onClick={() => setCurrentTab('matchmaker')}
                className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center text-xs"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-300" />
                Launch AI Search
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2">
            <div>
              © 2026 TrainMatch AI. Built in accordance with AI Studio Trainer &amp; Course Matching PRD.
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                Enterprise Security &amp; Official Registries
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
