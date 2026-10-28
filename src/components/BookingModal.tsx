import React, { useState } from 'react';
import {
  X,
  Calendar,
  Building,
  User,
  Mail,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileText,
  Loader2,
} from 'lucide-react';
import { Trainer, CourseOffering, BookingRFP } from '../types';

interface BookingModalProps {
  trainer: Trainer | null;
  selectedCourse?: CourseOffering;
  onClose: () => void;
  onBookingCreated: (rfp: BookingRFP) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  trainer,
  selectedCourse,
  onClose,
  onBookingCreated,
}) => {
  if (!trainer) return null;

  const [clientName, setClientName] = useState('');
  const [organization, setOrganization] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [courseTitle, setCourseTitle] = useState(
    selectedCourse?.title || trainer.coursesOffered[0]?.title || 'Customized Corporate Program'
  );
  const [durationDays, setDurationDays] = useState(2);
  const [participantsCount, setParticipantsCount] = useState(20);
  const [deliveryMode, setDeliveryMode] = useState<'In-Person' | 'Virtual' | 'Hybrid'>('In-Person');
  const [tentativeDate, setTentativeDate] = useState('2026-11-15');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittedRfp, setSubmittedRfp] = useState<BookingRFP | null>(null);

  // Calculate live estimate
  const baseRate = trainer.dailyRateUSD;
  const deliveryMultiplier = deliveryMode === 'Virtual' ? 0.9 : 1.0;
  const estimatedBudget = Math.round(baseRate * durationDays * deliveryMultiplier);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !organization) return;

    setLoading(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerId: trainer.id,
          trainerName: trainer.name,
          clientName,
          organization,
          clientEmail,
          courseTitle,
          tentativeDate,
          deliveryMode,
          participantsCount,
          specialRequirements,
          estimatedBudget,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit booking');

      const data = await res.json();
      setSubmittedRfp(data.booking);
      onBookingCreated(data.booking);
    } catch (err: any) {
      // In-memory fallback
      const fallbackRfp: BookingRFP = {
        id: `rfp-${Date.now().toString(36).toUpperCase()}`,
        trainerId: trainer.id,
        trainerName: trainer.name,
        clientName,
        organization,
        clientEmail,
        courseTitle,
        tentativeDate,
        deliveryMode,
        participantsCount,
        specialRequirements,
        estimatedBudget,
        status: 'Pending Review',
        createdAt: new Date().toISOString(),
      };
      setSubmittedRfp(fallbackRfp);
      onBookingCreated(fallbackRfp);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <img
              src={trainer.avatar}
              alt={trainer.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white/20 shadow-xs"
            />
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-blue-200">
                Corporate Training Request / RFP
              </div>
              <h2 className="text-xl font-extrabold text-white">
                Book {trainer.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 text-xs">
          {submittedRfp ? (
            <div className="text-center py-6 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  Training Proposal Submitted!
                </h3>
                <p className="text-slate-600 max-w-md mx-auto text-xs">
                  Your corporate RFP has been registered with reference ID{' '}
                  <strong className="text-blue-600 font-mono">{submittedRfp.id}</strong>.
                  A formal syllabus quotation &amp; HRD Corp grant pre-approval invoice from Maslow SA Sdn Bhd will be emailed to{' '}
                  <strong>{submittedRfp.clientEmail}</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Instructor:</span>
                  <span className="font-bold text-slate-900">{submittedRfp.trainerName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Selected Module:</span>
                  <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">
                    {submittedRfp.courseTitle}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Delivery Format:</span>
                  <span className="font-semibold text-slate-800">{submittedRfp.deliveryMode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Target Date:</span>
                  <span className="font-semibold text-slate-800">{submittedRfp.tentativeDate}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-700 font-semibold">Estimated Budget:</span>
                  <span className="font-extrabold text-blue-700 text-sm">
                    ${submittedRfp.estimatedBudget.toLocaleString()} USD
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                >
                  Return to Platform
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Name / Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Nurul Hidayah"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Organization / Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Axiata Digital / Maybank"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Corporate Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="e.g. nurul.h@company.com"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Course Module
                  </label>
                  <select
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                  >
                    {trainer.coursesOffered.map((c) => (
                      <option key={c.id} value={c.title}>
                        {c.title} ({c.duration})
                      </option>
                    ))}
                    <option value="Customized Corporate Syllabus">
                      Customized Corporate Syllabus (Tailored for Team)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Delivery Format
                  </label>
                  <select
                    value={deliveryMode}
                    onChange={(e) => setDeliveryMode(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  >
                    <option value="In-Person">In-Person (On-Site Client Office)</option>
                    <option value="Hybrid">Hybrid (Classroom + Zoom)</option>
                    <option value="Virtual">Virtual Live Interactive</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Workshop Duration (Days)
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  >
                    <option value={1}>1 Day (7 Hours)</option>
                    <option value={2}>2 Days (14 Hours) - Recommended</option>
                    <option value={3}>3 Days (21 Hours)</option>
                    <option value={5}>5 Days (Bootcamp)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Expected Headcount (Pax)
                  </label>
                  <input
                    type="number"
                    value={participantsCount}
                    min={5}
                    max={200}
                    onChange={(e) => setParticipantsCount(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tentative Start Date
                  </label>
                  <input
                    type="date"
                    value={tentativeDate}
                    onChange={(e) => setTentativeDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Special Training Objectives or Context (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    placeholder="e.g. Focus on financial services case studies; need HRD Corp claim documents prepared..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Instant Quotation Summary Box */}
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-blue-900">
                    Estimated Corporate Quotation:
                  </div>
                  <div className="text-base font-black text-blue-700">
                    ${estimatedBudget.toLocaleString()} USD
                    <span className="text-[11px] font-normal text-slate-500 ml-1.5">
                      ({durationDays} days @ ${baseRate}/day)
                    </span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-emerald-700 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> HRD Corp Claim Eligible
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 transition-all flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating Proposal...
                    </>
                  ) : (
                    <>Submit Corporate RFP</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
