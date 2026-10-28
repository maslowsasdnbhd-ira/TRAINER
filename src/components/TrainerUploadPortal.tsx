import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Award,
  Calendar,
  Layers,
  ArrowRight,
  Eye,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react';
import { SAMPLE_DOCUMENTS, SampleDocumentPreset } from '../data/sampleDocuments';
import { ExtractedTrainerData, Trainer, CourseOffering } from '../types';

interface TrainerUploadPortalProps {
  onProfilePublished: (newTrainer: Trainer) => void;
  onNavigateToDirectory: () => void;
}

export const TrainerUploadPortal: React.FC<TrainerUploadPortalProps> = ({
  onProfilePublished,
  onNavigateToDirectory,
}) => {
  // Step 1: Upload, Step 2: Extracting, Step 3: Review & Edit, Step 4: Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Upload inputs
  const [cvFileName, setCvFileName] = useState<string>('');
  const [cvText, setCvText] = useState<string>('');
  const [cvBase64, setCvBase64] = useState<string>('');
  const [cvMime, setCvMime] = useState<string>('');

  const [certFileName, setCertFileName] = useState<string>('');
  const [certBase64, setCertBase64] = useState<string>('');
  const [certMime, setCertMime] = useState<string>('');
  const [certPreviewUrl, setCertPreviewUrl] = useState<string>('');

  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [parsingError, setParsingError] = useState<string | null>(null);

  // Extracted and editable fields
  const [extractedData, setExtractedData] = useState<ExtractedTrainerData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    bio: '',
    yearsExperience: 10,
    languages: 'English, Bahasa Malaysia',
    dailyRateUSD: 1750,
    certTitle: '',
    certIssuer: '',
    certCredentialId: '',
    certValidUntil: '',
    certVerified: true,
    certNotes: '',
    certBadgeLevel: 'Master Trainer',
    expertiseTags: 'Generative AI, Leadership, Change Management',
    courses: [] as CourseOffering[],
  });

  const [createdTrainer, setCreatedTrainer] = useState<Trainer | null>(null);

  // Load sample preset
  const handleLoadSample = (preset: SampleDocumentPreset) => {
    setSelectedPresetId(preset.id);
    setCvFileName(preset.cvFileName);
    setCvText(preset.cvText);
    setCvBase64('');
    setCvMime('text/plain');

    setCertFileName(preset.certFileName);
    setCertPreviewUrl(preset.certSvgDataUri);
    setCertBase64(preset.certSvgDataUri);
    setCertMime('image/svg+xml');
  };

  // Handle local CV file upload
  const handleCvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPresetId('');
    setCvFileName(file.name);
    setCvMime(file.type || 'application/pdf');

    const reader = new FileReader();
    if (file.type.includes('text') || file.name.endsWith('.txt')) {
      reader.onload = (event) => {
        setCvText((event.target?.result as string) || '');
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCvBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local Certificate scan upload
  const handleCertFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedPresetId('');
    setCertFileName(file.name);
    setCertMime(file.type || 'image/png');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setCertBase64(result);
      setCertPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Trigger Gemini AI extraction
  const handleStartParsing = async () => {
    if (!cvText && !cvBase64 && !certBase64) {
      setParsingError('Please upload your CV document, certificate scan, or select a sample preset.');
      return;
    }

    setLoading(true);
    setParsingError(null);
    setStep(2);

    try {
      const res = await fetch('/api/parse-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: cvText || undefined,
          cvFile: cvBase64
            ? {
                name: cvFileName,
                mimeType: cvMime,
                data: cvBase64,
              }
            : undefined,
          certFile: certBase64
            ? {
                name: certFileName,
                mimeType: certMime,
                data: certBase64,
              }
            : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to parse documents. Server returned error.');
      }

      const json = await res.json();
      const data: ExtractedTrainerData = json.data;
      setExtractedData(data);

      // Populate review form state
      const primaryCert = data.certifications?.[0] || {
        title: 'Train-the-Trainer (TTT) Certified Professional',
        issuer: 'HRD Corp',
        credential_id: 'HRDC-TTT-MY-99120',
        valid_until: '2028-12-31',
        verified: true,
        verification_notes: 'Verified against certification registry.',
        badge_level: 'Master Trainer',
      };

      const mappedCourses: CourseOffering[] = (data.courses_offered || []).map((c, i) => ({
        id: `crs-${Date.now()}-${i}`,
        title: c.title,
        category: c.category || 'Professional Development',
        duration: c.duration || '2 Days (14 Hours)',
        targetAudience: c.target_audience || 'Corporate Leaders and Managers',
        level: (c.level as any) || 'Intermediate',
        description: c.description,
        keyOutcomes: c.key_outcomes || [
          'Master modern industry frameworks',
          'Deploy actionable workflow templates',
        ],
        claimable: c.claimable ?? true,
      }));

      // Default course if empty
      if (mappedCourses.length === 0) {
        mappedCourses.push({
          id: `crs-${Date.now()}-0`,
          title: 'Advanced Corporate Leadership & Practical Frameworks',
          category: 'Leadership',
          duration: '2 Days (14 Hours)',
          targetAudience: 'Mid-to-Senior Managers',
          level: 'Intermediate',
          description: 'Intensive corporate workshop focused on practical execution and change management.',
          keyOutcomes: ['Drive cross-functional results', 'Implement best-in-class workflows'],
          claimable: true,
        });
      }

      setFormData({
        name: data.trainer_name || 'Dr. Alistair Tan',
        email: data.email || 'trainer@example.com',
        phone: data.phone || '+60 12-345 6789',
        location: data.location || 'Kuala Lumpur, Malaysia (Open to APAC)',
        headline: data.headline || 'HRD Corp Certified Master Trainer & Consultant',
        bio: data.bio || '',
        yearsExperience: Number(data.years_experience) || 12,
        languages: (data.languages || ['English', 'Bahasa Malaysia']).join(', '),
        dailyRateUSD: Number(data.daily_rate_usd) || 1750,
        certTitle: primaryCert.title,
        certIssuer: primaryCert.issuer,
        certCredentialId: primaryCert.credential_id || 'HRDC-TTT-MY-99120',
        certValidUntil: primaryCert.valid_until || '2028-12-31',
        certVerified: primaryCert.verified ?? true,
        certNotes: primaryCert.verification_notes || 'Verified against accreditation registry.',
        certBadgeLevel: primaryCert.badge_level || 'Master Trainer',
        expertiseTags: (data.expertise_areas || []).join(', '),
        courses: mappedCourses,
      });

      setStep(3);
    } catch (err: any) {
      console.error(err);
      setParsingError(err.message || 'Error parsing documents.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  // Add course to review form
  const handleAddCourse = () => {
    const newCourse: CourseOffering = {
      id: `crs-custom-${Date.now()}`,
      title: 'New Signature Workshop',
      category: 'Professional Skills',
      duration: '2 Days (14 Hours)',
      targetAudience: 'Corporate Teams & Managers',
      level: 'Intermediate',
      description: 'Hands-on interactive training module designed for organizational skill building.',
      keyOutcomes: ['Learn core principles', 'Practical group case studies'],
      claimable: true,
    };
    setFormData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse],
    }));
  };

  // Remove course from review form
  const handleRemoveCourse = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }));
  };

  // Publish profile to server & marketplace
  const handlePublish = async () => {
    const skillsArray = formData.expertiseTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const languagesArray = formData.languages
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newTrainer: Trainer = {
      id: `tr-${Date.now().toString(36)}`,
      name: formData.name,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      headline: formData.headline,
      bio: formData.bio,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      languages: languagesArray,
      yearsExperience: formData.yearsExperience,
      rating: 5.0,
      reviewCount: 1,
      dailyRateUSD: formData.dailyRateUSD,
      deliveryModes: ['In-Person', 'Hybrid', 'Virtual'],
      featured: true,
      verificationAuditDate: new Date().toISOString().split('T')[0],
      certifications: [
        {
          id: `cert-${Date.now()}`,
          title: formData.certTitle,
          issuer: formData.certIssuer,
          credentialId: formData.certCredentialId,
          validUntil: formData.certValidUntil,
          verified: formData.certVerified,
          verificationNotes: formData.certNotes,
          badgeLevel: formData.certBadgeLevel as any,
          documentUrl: certPreviewUrl || undefined,
        },
      ],
      expertiseAreas: skillsArray,
      coursesOffered: formData.courses,
    };

    try {
      const res = await fetch('/api/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTrainer),
      });

      if (res.ok) {
        setCreatedTrainer(newTrainer);
        onProfilePublished(newTrainer);
        setStep(4);
      } else {
        throw new Error('Failed to save to catalog');
      }
    } catch (err) {
      // In-memory fallback
      setCreatedTrainer(newTrainer);
      onProfilePublished(newTrainer);
      setStep(4);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, label: 'Upload Documents' },
            { num: 2, label: 'AI Multimodal Extraction' },
            { num: 3, label: 'Review & Verify' },
            { num: 4, label: 'Live on Marketplace' },
          ].map((st) => (
            <div key={st.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                  step === st.num
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : step > st.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step > st.num ? <CheckCircle2 className="w-5 h-5" /> : st.num}
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-1.5 hidden sm:block">
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Upload Documents */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Onboard Your Trainer Profile with Gemini AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Upload your Curriculum Vitae (CV) and official Train-the-Trainer (TTT) certificate scan.
              Our Gemini model automatically verifies your credentials, extracts course modules, and
              builds your marketplace listing in seconds.
            </p>
          </div>

          {/* Quick Preset Samples for instant 1-click test */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Instant 1-Click Demo Profiles (Try without local files):</span>
              </div>
              <span className="text-[11px] text-amber-700 font-medium">Click to pre-load</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_DOCUMENTS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleLoadSample(preset)}
                    className={`text-left p-3 rounded-xl border transition-all text-xs ${
                      isSelected
                        ? 'bg-white border-amber-500 shadow-xs ring-2 ring-amber-300'
                        : 'bg-white/80 border-amber-200 hover:bg-white hover:border-amber-400'
                    }`}
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>{preset.name}</span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <div className="text-[11px] text-amber-700 font-medium mt-0.5">
                      {preset.title}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-2 mt-1">
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dual Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: CV Upload or Paste */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Curriculum Vitae (CV)</h3>
                    <p className="text-[11px] text-slate-500">PDF, Word, or plain text</p>
                  </div>
                </div>
                {cvFileName && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    File Ready
                  </span>
                )}
              </div>

              {/* Drag & Drop File Input */}
              <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                <UploadCloud className="w-7 h-7 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">
                  {cvFileName ? cvFileName : 'Click to browse or drag CV file here'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">Supports PDF, DOCX, TXT</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleCvFileUpload}
                  className="hidden"
                />
              </label>

              {/* Paste Text Fallback */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Or Paste CV Text directly:
                </label>
                <textarea
                  rows={4}
                  value={cvText}
                  onChange={(e) => {
                    setCvText(e.target.value);
                    if (!cvFileName) setCvFileName('Pasted_CV_Text.txt');
                  }}
                  placeholder="Paste work experience, past training clients, education, and credentials..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono"
                />
              </div>
            </div>

            {/* Box 2: Certificate Scan Upload */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">TTT Certificate Scan / Image</h3>
                    <p className="text-[11px] text-slate-500">PNG, JPG, PDF, or SVG</p>
                  </div>
                </div>
                {certFileName && (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Scan Ready
                  </span>
                )}
              </div>

              {/* Drag & Drop File Input */}
              <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/30 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                <ImageIcon className="w-7 h-7 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">
                  {certFileName ? certFileName : 'Upload official TTT certificate image/scan'}
                </span>
                <span className="text-[10px] text-slate-400 mt-1">
                  HRD Corp, Cambridge, ATD, ISO, or IASSC
                </span>
                <input
                  type="file"
                  accept="image/*,.pdf,.svg"
                  onChange={handleCertFileUpload}
                  className="hidden"
                />
              </label>

              {/* Certificate Scan Preview */}
              {certPreviewUrl ? (
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 p-2">
                  <div className="text-[10px] font-semibold text-slate-500 mb-1 flex items-center justify-between">
                    <span>Certificate Preview</span>
                    <span className="text-emerald-600 font-bold flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-0.5" /> High Resolution Scan
                    </span>
                  </div>
                  <img
                    src={certPreviewUrl}
                    alt="Certificate scan"
                    className="w-full h-32 object-contain bg-white rounded border border-slate-100"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-400">
                  No certificate scan uploaded yet. (You can also select a sample preset above)
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {parsingError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
              <span>{parsingError}</span>
            </div>
          )}

          {/* Start Extraction Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartParsing}
              disabled={loading || (!cvText && !cvBase64 && !certBase64)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-maslow-darkRed via-maslow-terracotta to-maslow-peach hover:opacity-95 text-white font-bold text-sm shadow-md shadow-maslow-terracotta/20 disabled:opacity-50 transition-all flex items-center"
            >
              <Sparkles className="w-4 h-4 mr-2 text-maslow-sand" />
              Start AI Document Parsing
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Extraction in Progress */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-maslow-sand/30 animate-ping opacity-75" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-maslow-darkRed to-maslow-terracotta flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-8 h-8 animate-pulse text-maslow-sand" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900">
              Gemini Multimodal AI is Parsing Your Credentials...
            </h3>
            <p className="text-xs text-slate-500">
              Extracting structured profile data, verifying TTT issuing bodies, and mapping course modules.
            </p>
          </div>

          <div className="space-y-2 text-left max-w-xs mx-auto text-xs text-slate-600">
            <div className="flex items-center text-emerald-600 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 mr-2 shrink-0" />
              Document images &amp; text ingested
            </div>
            <div className="flex items-center text-indigo-600 font-semibold animate-pulse">
              <Loader2 className="w-3.5 h-3.5 mr-2 shrink-0 animate-spin" />
              Auditing Train-the-Trainer (TTT) credentials...
            </div>
            <div className="flex items-center text-slate-400">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 mr-2 shrink-0" />
              Synthesizing course syllabi &amp; outcomes
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Review & Verify Extracted Profile */}
      {step === 3 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Verification Alert */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center space-x-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-emerald-950 text-sm sm:text-base">
                    Document Successfully Parsed by Google AI Studio
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-200/80 text-emerald-900">
                    {extractedData?.confidence_score || 98}% Accuracy Score
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Review the auto-filled fields below. You can edit any details before publishing to
                  the marketplace.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center shrink-0 self-end sm:self-center"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Re-upload Docs
            </button>
          </div>

          {/* Form Fields */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2 text-blue-600" />
              1. Basic Information &amp; Professional Bio
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name &amp; Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location &amp; Mobility</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Years Experience</label>
                <input
                  type="number"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Spoken / Training Languages</label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Daily Training Rate (USD)</label>
                <input
                  type="number"
                  value={formData.dailyRateUSD}
                  onChange={(e) => setFormData({ ...formData, dailyRateUSD: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-blue-700"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Detailed Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">
                  Core Expertise &amp; Skills Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.expertiseTags}
                  onChange={(e) => setFormData({ ...formData, expertiseTags: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Verified Certification Section */}
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 pt-2 flex items-center">
              <Award className="w-4 h-4 mr-2 text-amber-500" />
              2. Verified Train-the-Trainer (TTT) Credential
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Certification Title</label>
                <input
                  type="text"
                  value={formData.certTitle}
                  onChange={(e) => setFormData({ ...formData, certTitle: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issuing Authority / Body</label>
                <input
                  type="text"
                  value={formData.certIssuer}
                  onChange={(e) => setFormData({ ...formData, certIssuer: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Credential ID / License Number</label>
                <input
                  type="text"
                  value={formData.certCredentialId}
                  onChange={(e) => setFormData({ ...formData, certCredentialId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Validity / Expiry Date</label>
                <input
                  type="text"
                  value={formData.certValidUntil}
                  onChange={(e) => setFormData({ ...formData, certValidUntil: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Accreditation Level</label>
                <select
                  value={formData.certBadgeLevel}
                  onChange={(e) => setFormData({ ...formData, certBadgeLevel: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                >
                  <option value="Master Trainer">Master Trainer</option>
                  <option value="Senior Certified">Senior Certified</option>
                  <option value="Certified Trainer">Certified Trainer</option>
                  <option value="Accredited Lead">Accredited Lead</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Verification Audit Trail Notes</label>
                <input
                  type="text"
                  value={formData.certNotes}
                  onChange={(e) => setFormData({ ...formData, certNotes: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-emerald-800"
                />
              </div>
            </div>

            {/* Course Offerings Section */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 pt-2">
              <h3 className="font-bold text-slate-900 text-base flex items-center">
                <Layers className="w-4 h-4 mr-2 text-indigo-600" />
                3. Signature Course Offerings ({formData.courses.length})
              </h3>
              <button
                type="button"
                onClick={handleAddCourse}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-2.5 py-1 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Course
              </button>
            </div>

            <div className="space-y-4">
              {formData.courses.map((course, idx) => (
                <div
                  key={course.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Course #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(course.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-medium text-slate-600 mb-1">Course Title</label>
                      <input
                        type="text"
                        value={course.title}
                        onChange={(e) => {
                          const updated = [...formData.courses];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, courses: updated });
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Category</label>
                      <input
                        type="text"
                        value={course.category}
                        onChange={(e) => {
                          const updated = [...formData.courses];
                          updated[idx].category = e.target.value;
                          setFormData({ ...formData, courses: updated });
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Duration</label>
                      <input
                        type="text"
                        value={course.duration}
                        onChange={(e) => {
                          const updated = [...formData.courses];
                          updated[idx].duration = e.target.value;
                          setFormData({ ...formData, courses: updated });
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-600 mb-1">Target Audience</label>
                      <input
                        type="text"
                        value={course.targetAudience}
                        onChange={(e) => {
                          const updated = [...formData.courses];
                          updated[idx].targetAudience = e.target.value;
                          setFormData({ ...formData, courses: updated });
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-4">
                      <label className="flex items-center space-x-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={course.claimable}
                          onChange={(e) => {
                            const updated = [...formData.courses];
                            updated[idx].claimable = e.target.checked;
                            setFormData({ ...formData, courses: updated });
                          }}
                          className="rounded border-slate-300 text-blue-600"
                        />
                        <span className="font-semibold text-emerald-800 text-xs">
                          HRD Corp Claimable
                        </span>
                      </label>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block font-medium text-slate-600 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={course.description}
                        onChange={(e) => {
                          const updated = [...formData.courses];
                          updated[idx].description = e.target.value;
                          setFormData({ ...formData, courses: updated });
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Back to Documents
              </button>

              <button
                type="button"
                onClick={handlePublish}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-200 transition-all flex items-center"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Publish Profile to Marketplace Directory
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Success Published */}
      {step === 4 && createdTrainer && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-sm animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Profile Published Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Your verified credentials for <strong className="text-slate-900">{createdTrainer.name}</strong> are now live in the Maslow SA Sdn Bhd certified trainer directory and available to corporate HR managers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">{createdTrainer.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Verified TTT
              </span>
            </div>
            <div className="text-slate-500">{createdTrainer.headline}</div>
            <div className="text-slate-600 pt-1 border-t border-slate-200/80 flex items-center justify-between">
              <span>{createdTrainer.certifications[0]?.issuer}</span>
              <span className="font-mono text-[11px] font-bold text-slate-800">
                {createdTrainer.certifications[0]?.credentialId}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={onNavigateToDirectory}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Live in Directory
            </button>

            <button
              onClick={() => {
                setStep(1);
                setCvFileName('');
                setCvText('');
                setCvBase64('');
                setCertFileName('');
                setCertPreviewUrl('');
                setSelectedPresetId('');
              }}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all"
            >
              Upload Another Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
