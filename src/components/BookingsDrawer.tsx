import React from 'react';
import { X, FileCheck, CheckCircle2, Calendar, Building, Clock, DollarSign, Download } from 'lucide-react';
import { BookingRFP } from '../types';

interface BookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRFP[];
}

export const BookingsDrawer: React.FC<BookingsDrawerProps> = ({
  isOpen,
  onClose,
  bookings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="font-bold text-base">Corporate RFPs &amp; Proposals</h3>
                <p className="text-[11px] text-slate-400">
                  {bookings.length} active training request{bookings.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <FileCheck className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                <p className="font-semibold text-slate-600">No proposals submitted yet</p>
                <p className="text-[11px] max-w-xs mx-auto">
                  Browse the trainer directory or use the AI Matchmaker to generate your first corporate training proposal.
                </p>
              </div>
            ) : (
              bookings.map((rfp) => (
                <div
                  key={rfp.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {rfp.id}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      {rfp.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rfp.courseTitle}</h4>
                    <p className="text-slate-600 text-[11px] font-medium mt-0.5">
                      Trainer: <strong className="text-slate-800">{rfp.trainerName}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span className="truncate">{rfp.organization}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>{rfp.tentativeDate}</span>
                    </div>
                    <div>
                      Format: <strong className="text-slate-700">{rfp.deliveryMode}</strong>
                    </div>
                    <div>
                      Participants: <strong className="text-slate-700">{rfp.participantsCount} pax</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Budget:</span>{' '}
                      <span className="font-extrabold text-[#A14646]">RM {rfp.estimatedBudget.toLocaleString('en-MY', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      HRD Claimable
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-xl text-xs transition-colors"
            >
              Close Drawer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
