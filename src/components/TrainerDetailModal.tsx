import React from 'react';
import {
  X,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  BookOpen,
  CheckCircle2,
  Mail,
  Phone,
  Globe,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Trainer, CourseOffering } from '../types';

interface TrainerDetailModalProps {
  trainer: Trainer | null;
  onClose: () => void;
  onRequestBooking: (trainer: Trainer, course?: CourseOffering) => void;
}

export const TrainerDetailModal: React.FC<TrainerDetailModalProps> = ({
  trainer,
  onClose,
  onRequestBooking,
}) => {
  if (!trainer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-maslow-darkRed via-maslow-terracotta to-maslow-peach text-white p-6 sm:p-8 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={trainer.avatar}
                alt={trainer.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {trainer.name}
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified TTT
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-snug">
                {trainer.headline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                <span className="flex items-center text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  {trainer.rating.toFixed(2)} ({trainer.reviewCount} corporate evaluations)
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {trainer.yearsExperience} Years Industry &amp; Training Exp
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {trainer.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1 text-slate-700">
          {/* Official Accreditation Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center">
              <Award className="w-4 h-4 mr-1.5 text-amber-600" />
              Audited Train-the-Trainer (TTT) Certifications
            </h3>

            <div className="space-y-3">
              {trainer.certifications.map((cert) => (
                <div
                  key={cert.id || cert.title}
                  className="bg-white rounded-xl p-3.5 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{cert.title}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {cert.badgeLevel || 'Certified'}
                      </span>
                    </div>
                    <div className="text-slate-600 font-medium">
                      Issuing Body: <span className="text-slate-900 font-semibold">{cert.issuer}</span>
                    </div>
                    {cert.credentialId && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        Credential ID: <span className="text-slate-800 font-bold">{cert.credentialId}</span>
                      </div>
                    )}
                    {cert.verificationNotes && (
                      <div className="text-[11px] text-emerald-700 flex items-center font-medium pt-0.5">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 shrink-0" />
                        {cert.verificationNotes}
                      </div>
                    )}
                  </div>

                  <div className="text-right sm:self-center shrink-0">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Active Status
                    </span>
                    {cert.validUntil && (
                      <div className="text-[10px] text-slate-400 mt-1">
                        Valid thru {cert.validUntil}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2">
              Professional Background &amp; Delivery Methodology
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {trainer.bio}
            </p>
          </div>

          {/* Core Expertise Tags */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1 text-indigo-600" />
              Core Competencies &amp; Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {trainer.expertiseAreas.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200/80"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Course Syllabus Offerings */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center">
                <BookOpen className="w-4 h-4 mr-1.5 text-blue-600" />
                Available Corporate Training Modules ({trainer.coursesOffered.length})
              </h3>
              <span className="text-xs text-slate-500">Customizable for your team</span>
            </div>

            <div className="space-y-4">
              {trainer.coursesOffered.map((course) => (
                <div
                  key={course.id}
                  className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                        <span className="font-semibold text-blue-600">{course.category}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.duration}
                        </span>
                        <span>•</span>
                        <span>Level: {course.level}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {course.claimable && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          HRD Corp Claimable
                        </span>
                      )}
                      <button
                        onClick={() => {
                          onClose();
                          onRequestBooking(trainer, course);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors flex items-center"
                      >
                        Request This Course
                        <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{course.description}</p>

                  {course.keyOutcomes && course.keyOutcomes.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/80">
                      <div className="font-semibold text-slate-700 text-[11px] mb-1">
                        Key Learning Outcomes:
                      </div>
                      <ul className="space-y-1">
                        {course.keyOutcomes.map((outcome, oi) => (
                          <li key={oi} className="flex items-start text-slate-600 text-[11px]">
                            <CheckCircle2 className="w-3 h-3 mr-1.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase">
              Corporate Daily Rate
            </div>
            <div className="text-lg font-black text-[#A14646]">
              RM {(trainer.dailyRateUSD * 4.4).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs text-slate-500 font-normal ml-1">/ day (MYR, exclusive of SST)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestBooking(trainer);
              }}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-maslow-terracotta to-maslow-peach hover:from-maslow-darkRed hover:to-maslow-terracotta text-white text-xs font-bold shadow-md shadow-maslow-terracotta/20 transition-all flex items-center justify-center"
            >
              Inquire / Book Training Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
