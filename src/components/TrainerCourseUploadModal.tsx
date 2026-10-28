import React, { useState } from 'react';
import { TrainingCourse } from '../data/coursesData';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Shield,
  Layers,
  Calendar,
  X,
  FileCheck
} from 'lucide-react';

export interface TrainerCourseUploadProps {
  trainerName: string;
  trainerId?: string;
  onCourseSubmit: (newCourse: TrainingCourse, fileInfo: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function TrainerCourseUpload({
  trainerName,
  trainerId = 'TR-CURRENT',
  onCourseSubmit,
  onClose,
  isModal = false,
}: TrainerCourseUploadProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Public Training' | 'Team Building' | 'In-House Training'>('Public Training');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('2 Days (14 Hours)');
  const [priceMYR, setPriceMYR] = useState('');
  const [hrdClaimable, setHrdClaimable] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
      const sizeKb = Math.round(file.size / 1024);
      setFileSizeStr(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName('');
    setFileSizeStr('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a course title.');
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      setError('Please provide a comprehensive course outline and description (at least 20 characters).');
      return;
    }
    if (!duration.trim()) {
      setError('Please specify the training duration.');
      return;
    }

    const parsedPrice = parseFloat(priceMYR.replace(/[^0-9.]/g, ''));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Please specify a valid proposed price in MYR (Malaysian Ringgit).');
      return;
    }

    setIsSubmitting(true);

    const prefix = category === 'Public Training' ? 'PUB' : category === 'Team Building' ? 'TB' : 'IH';
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCourseId = `${prefix}-${randomSuffix}`;

    const newCourse: TrainingCourse = {
      id: newCourseId,
      title: title.trim(),
      category,
      description: description.trim(),
      duration: duration.trim(),
      priceMYR: parsedPrice,
      hrdClaimable,
      assignedTrainerId: trainerId,
      leadTrainerName: trainerName,
      leadTrainerRole: 'Certified Corporate & Professional Trainer',
      leadTrainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      status: 'pending',
      syllabusFileName: fileName || 'Course-Outline.pdf',
      submittedAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onCourseSubmit(newCourse, fileName || 'Course Outline Document');
      setIsSubmitting(false);
      setSuccessMessage(true);

      // Reset form fields
      setTitle('');
      setDescription('');
      setPriceMYR('');
      setDuration('2 Days (14 Hours)');
      setHrdClaimable(true);
      setSelectedFile(null);
      setFileName('');
      setFileSizeStr('');

      // Auto dismiss success alert after 5 seconds
      setTimeout(() => {
        setSuccessMessage(false);
        if (onClose && isModal) {
          onClose();
        }
      }, 5000);
    }, 600);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${isModal ? 'max-w-2xl w-full p-6' : 'p-6 sm:p-8'}`}>
      {/* Top Banner / Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#A14646]/10 text-[#A14646]">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Trainer Course Upload Portal</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Propose new Malaysian training modules, syllabus outlines, and corporate pricing for Maslow SA review.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            Trainer: {trainerName}
          </span>
          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-sm text-emerald-800">
              ✓ Course successfully submitted and queued for admin approval!
            </p>
            <p className="mt-1 text-emerald-700 leading-relaxed">
              Your course details and syllabus have been dispatched to <strong>info@maslowsa.com</strong>. Our L&amp;D committee will verify HRD Corp alignment before publishing to the Malaysian corporate directory.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Course Title <span className="text-[#A14646]">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Executive Business Analytics & AI-Driven Decision Making"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA6556] focus:border-transparent transition"
          />
        </div>

        {/* Category & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Program Category <span className="text-[#A14646]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#DA6556] focus:border-transparent transition"
            >
              <option value="Public Training">Public Training</option>
              <option value="Team Building">Team Building</option>
              <option value="In-House Training">In-House Training</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Duration <span className="text-[#A14646]">*</span>
            </label>
            <input
              type="text"
              required
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2 Days (14 Hours) or 1 Day"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA6556] focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Proposed Price in MYR & HRD Claimable Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Proposed Course Fee (MYR) <span className="text-[#A14646]">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-500">
                RM
              </span>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={priceMYR}
                onChange={(e) => setPriceMYR(e.target.value)}
                placeholder="e.g. 1500 for public or 8500 for in-house"
                className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA6556] focus:border-transparent transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Malaysian Ringgit only. Client view enforces role-based pricing security.
            </p>
          </div>

          <div className="sm:pt-6">
            <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={hrdClaimable}
                onChange={(e) => setHrdClaimable(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#A14646] focus:ring-[#DA6556]"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">HRD Corp Claimable Course</span>
                <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                  Check if syllabus meets HRD Corp grant claim guidelines.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Description & Syllabus Outline */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Course Description &amp; Detailed Modules <span className="text-[#A14646]">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Outline the core learning objectives, target audience, key takeaways, and day-by-day modules..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#DA6556] focus:border-transparent transition"
          />
        </div>

        {/* Document Attachment (PDF or Word Syllabus) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Course Brochure / Syllabus File (Optional)
          </label>
          
          {!fileName ? (
            <label className="border-2 border-dashed border-slate-300 hover:border-[#DA6556] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 hover:bg-white transition group">
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-[#DA6556] transition mb-2" />
              <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                Click to upload PDF, Word (.docx), or Text syllabus
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Supported formats: .pdf, .docx, .doc, .txt (Max 15MB)
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-slate-800">
              <div className="flex items-center gap-3 min-w-0">
                <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{fileName}</p>
                  <p className="text-[11px] text-slate-500">{fileSizeStr} • Ready for admin review</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Remove attached file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Button & Note */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Shield className="w-4 h-4 text-[#A14646] shrink-0" />
            <span>Submitted courses will be reviewed by <strong>info@maslowsa.com</strong></span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isModal && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#A14646] to-[#DA6556] hover:from-[#8f3d3d] hover:to-[#c55648] text-white text-xs font-bold shadow-md shadow-[#A14646]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Course...</span>
              ) : (
                <>
                  <span>Submit Course for Admin Approval</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export function TrainerCourseUploadModal(props: TrainerCourseUploadProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <TrainerCourseUpload {...props} isModal={true} />
    </div>
  );
}
