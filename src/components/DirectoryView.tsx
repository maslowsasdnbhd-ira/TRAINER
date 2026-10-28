import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Star,
  Calendar,
  Layers,
  Sparkles,
  Shield,
  BookOpen,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Trainer, CourseOffering } from '../types';

interface DirectoryViewProps {
  trainers: Trainer[];
  onSelectTrainer: (trainer: Trainer) => void;
  onRequestBooking: (trainer: Trainer, course?: CourseOffering) => void;
  onOpenMatchmaker: () => void;
  onOpenTrainerPortal: () => void;
}

export const DirectoryView: React.FC<DirectoryViewProps> = ({
  trainers,
  onSelectTrainer,
  onRequestBooking,
  onOpenMatchmaker,
  onOpenTrainerPortal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');
  const [selectedExperience, setSelectedExperience] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [hrdClaimable, setHrdClaimable] = useState<boolean>(false);

  const categories = [
    'All',
    'For Educators',
    'For Entrepreneurs',
    'In-House Training & Team Building',
    'AI Tools for Business',
    'Leadership & Management',
    'First Aid & Safety',
  ];

  // Instant reactive filter computation
  const filteredTrainers = useMemo(() => {
    return trainers.filter((t) => {
      // 1. Search Bar Match (topic, skill, trainer name, certification, course)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesHeadline = t.headline.toLowerCase().includes(q);
        const matchesBio = t.bio.toLowerCase().includes(q);
        const matchesLocation = t.location.toLowerCase().includes(q);
        const matchesSkills = t.expertiseAreas.some((s) => s.toLowerCase().includes(q));
        const matchesCourses = t.coursesOffered.some(
          (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
        const matchesCert = t.certifications.some(
          (c) => c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)
        );

        if (
          !matchesName &&
          !matchesHeadline &&
          !matchesBio &&
          !matchesLocation &&
          !matchesSkills &&
          !matchesCourses &&
          !matchesCert
        ) {
          return false;
        }
      }

      // 2. Category Filter Pill
      if (selectedCategory !== 'All') {
        const catLower = selectedCategory.toLowerCase();
        const matchesCourseCategory = t.coursesOffered.some((c) =>
          c.category.toLowerCase().includes(catLower)
        );
        const matchesExpertise = t.expertiseAreas.some((e) =>
          e.toLowerCase().includes(catLower)
        );

        let matchesSpecialCase = false;
        if (selectedCategory === 'First Aid & Safety') {
          matchesSpecialCase =
            t.expertiseAreas.some(
              (e) =>
                e.toLowerCase().includes('first aid') ||
                e.toLowerCase().includes('cpr') ||
                e.toLowerCase().includes('safety')
            ) ||
            t.coursesOffered.some((c) =>
              c.title.toLowerCase().includes('first aid') || c.category.toLowerCase().includes('safety')
            );
        } else if (selectedCategory === 'For Entrepreneurs') {
          matchesSpecialCase =
            t.expertiseAreas.some(
              (e) =>
                e.toLowerCase().includes('entrepreneur') ||
                e.toLowerCase().includes('small business') ||
                e.toLowerCase().includes('growth hacking')
            ) ||
            t.coursesOffered.some((c) =>
              c.title.toLowerCase().includes('small business') || c.targetAudience.toLowerCase().includes('entrepreneur')
            );
        } else if (selectedCategory === 'For Educators') {
          matchesSpecialCase =
            t.expertiseAreas.some(
              (e) =>
                e.toLowerCase().includes('educator') ||
                e.toLowerCase().includes('classroom') ||
                e.toLowerCase().includes('adhd') ||
                e.toLowerCase().includes('pedagogy')
            ) ||
            t.coursesOffered.some((c) =>
              c.targetAudience.toLowerCase().includes('teacher') || c.targetAudience.toLowerCase().includes('educator')
            );
        } else if (selectedCategory === 'AI Tools for Business') {
          matchesSpecialCase =
            t.expertiseAreas.some(
              (e) => e.toLowerCase().includes('ai') || e.toLowerCase().includes('automation')
            ) ||
            t.coursesOffered.some((c) => c.title.toLowerCase().includes('ai'));
        }

        if (!matchesCourseCategory && !matchesExpertise && !matchesSpecialCase) {
          return false;
        }
      }

      // 3. TTT Issuing Body
      if (selectedIssuer !== 'All') {
        if (selectedIssuer === 'HRD Corp') {
          const hasHrd = t.certifications.some((c) => c.issuer.toLowerCase().includes('hrd'));
          if (!hasHrd) return false;
        } else if (selectedIssuer === 'ISO Lead Auditor') {
          const hasIso = t.certifications.some(
            (c) => c.issuer.toLowerCase().includes('iso') || c.title.toLowerCase().includes('iso')
          );
          if (!hasIso) return false;
        } else {
          const hasIssuer = t.certifications.some((c) =>
            c.issuer.toLowerCase().includes(selectedIssuer.toLowerCase())
          );
          if (!hasIssuer) return false;
        }
      }

      // 4. Experience (Years)
      if (selectedExperience > 0 && t.yearsExperience < selectedExperience) {
        return false;
      }

      // 5. Rating
      if (selectedRating > 0 && t.rating < selectedRating) {
        return false;
      }

      // 6. Delivery Mode
      if (selectedMode !== 'All') {
        if (selectedMode === 'In-Person') {
          if (!t.deliveryModes.includes('In-Person')) return false;
        } else if (selectedMode === 'Virtual / Hybrid') {
          const matches =
            t.deliveryModes.includes('Virtual') || t.deliveryModes.includes('Hybrid');
          if (!matches) return false;
        }
      }

      // 7. HRD Corp Claimable Checkbox
      if (hrdClaimable) {
        const hasClaimable = t.coursesOffered.some((c) => c.claimable);
        if (!hasClaimable) return false;
      }

      return true;
    });
  }, [
    trainers,
    searchTerm,
    selectedCategory,
    selectedIssuer,
    selectedExperience,
    selectedRating,
    selectedMode,
    hrdClaimable,
  ]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedIssuer !== 'All' ||
    selectedExperience > 0 ||
    selectedRating > 0 ||
    selectedMode !== 'All' ||
    hrdClaimable;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedIssuer('All');
    setSelectedExperience(0);
    setSelectedRating(0);
    setSelectedMode('All');
    setHrdClaimable(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Responsive Search Form & Instant Filter Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-8 transition-all">
        {/* Main Search Input & Action Buttons */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by topic, skill, trainer name, or certification (e.g., 'AI', 'HRD Corp', 'First Aid')..."
              className="w-full pl-11 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DA6556] focus:bg-white transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenMatchmaker}
              className="flex items-center justify-center px-4 py-2.5 bg-[#FDB773]/20 hover:bg-[#FDB773]/35 text-[#A14646] text-sm font-semibold rounded-xl border border-[#FDB773]/50 transition-colors shadow-2xs"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-[#DA6556]" />
              ✨ Ask AI Matchmaker
            </button>

            <button
              type="button"
              onClick={onOpenTrainerPortal}
              className="flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-[#DA6556] to-[#EB895B] hover:from-[#A14646] hover:to-[#DA6556] text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
            >
              + Register as Trainer
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Scrollable on mobile) */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar mt-3 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center shrink-0">
            <Layers className="w-3.5 h-3.5 mr-1 text-[#DA6556]" /> Category:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'bg-[#A14646] text-white shadow-sm font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 font-medium'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Advanced Filter Dropdowns in a 5-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* 1. TTT Issuing Body */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              TTT Issuing Body
            </label>
            <select
              value={selectedIssuer}
              onChange={(e) => setSelectedIssuer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#DA6556]"
            >
              <option value="All">All Issuing Bodies</option>
              <option value="HRD Corp">HRD Corp (Malaysia)</option>
              <option value="ISO Lead Auditor">ISO Lead Auditor</option>
              <option value="Cambridge">Cambridge International</option>
              <option value="IASSC">IASSC / Six Sigma</option>
              <option value="ATD">ATD Facilitator</option>
              <option value="ICF">ICF Coaching</option>
            </select>
          </div>

          {/* 2. Experience */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Experience
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#DA6556]"
            >
              <option value={0}>Any Experience</option>
              <option value={10}>10+ Years</option>
              <option value={15}>15+ Years</option>
            </select>
          </div>

          {/* 3. Rating */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Rating
            </label>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#DA6556]"
            >
              <option value={0}>Any Rating</option>
              <option value={4.9}>4.9 &amp; above</option>
            </select>
          </div>

          {/* 4. Delivery Mode */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Delivery Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-[#DA6556]"
            >
              <option value="All">All Formats</option>
              <option value="In-Person">In-Person</option>
              <option value="Virtual / Hybrid">Virtual / Hybrid</option>
            </select>
          </div>

          {/* 5. HRD Corp Claimable Checkbox */}
          <div className="flex items-end pb-0.5">
            <label className="flex items-center space-x-2 cursor-pointer select-none py-2 px-3 bg-emerald-50 hover:bg-emerald-100/70 border border-emerald-200 rounded-lg w-full transition">
              <input
                type="checkbox"
                checked={hrdClaimable}
                onChange={(e) => setHrdClaimable(e.target.checked)}
                className="rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="text-xs font-bold text-emerald-800">
                HRD Corp Claimable
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Title Update Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Popular Trainers in Malaysia
          </h2>
          <p className="text-sm text-slate-500">
            Showing verified instructors with audited TTT credentials across Malaysia.
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center text-xs font-semibold text-[#A14646] hover:text-[#DA6556] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset Filters ({filteredTrainers.length} result{filteredTrainers.length !== 1 ? 's' : ''})
          </button>
        )}
      </div>

      {/* Trainer Grid Results */}
      {filteredTrainers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8 shadow-xs">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No trainers match the selected filters
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Try adjusting your search query, selecting "All Formats" or "Any Experience", or consult the AI Matchmaker to discover instructors tailored to your custom training brief.
          </p>
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
            <button
              type="button"
              onClick={onOpenMatchmaker}
              className="px-4 py-2 bg-[#A14646] hover:bg-[#DA6556] text-white text-xs font-semibold rounded-xl flex items-center transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#FDB773]" />
              Ask AI Matchmaker
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => {
            const primaryCert = trainer.certifications[0];
            const hasHrdClaimable = trainer.coursesOffered.some((c) => c.claimable);

            return (
              <div
                key={trainer.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#DA6556] hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top & Avatar */}
                <div className="p-5">
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                      />
                      <span
                        className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-xs border-2 border-white"
                        title="Verified TTT Credential"
                      >
                        <Shield className="w-3 h-3" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => onSelectTrainer(trainer)}
                        className="font-bold text-slate-900 hover:text-[#A14646] transition-colors truncate cursor-pointer text-base"
                      >
                        {trainer.name}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {trainer.headline}
                      </p>

                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600">
                        <div className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                          <span>{trainer.rating.toFixed(2)}</span>
                          <span className="text-[11px] text-slate-400 font-normal ml-1">
                            ({trainer.reviewCount})
                          </span>
                        </div>
                        <span className="text-slate-300">•</span>
                        <div className="flex items-center text-slate-600 font-medium text-[11px]">
                          <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                          {trainer.yearsExperience} yrs exp
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verified Accreditation Highlight */}
                  {primaryCert && (
                    <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
                        <span className="flex items-center text-emerald-700 truncate mr-2">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                          <span className="truncate">{primaryCert.title}</span>
                        </span>
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#A14646]/10 text-[#A14646]">
                          {primaryCert.badgeLevel || 'Verified'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 truncate">
                        Issuer: <span className="font-medium text-slate-700">{primaryCert.issuer}</span>
                      </div>
                    </div>
                  )}

                  {/* Bio brief */}
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {trainer.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {trainer.expertiseAreas.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/50"
                      >
                        {skill}
                      </span>
                    ))}
                    {trainer.expertiseAreas.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-500">
                        +{trainer.expertiseAreas.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Signature Course Highlight */}
                  {trainer.coursesOffered[0] && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span className="flex items-center">
                          <BookOpen className="w-3 h-3 mr-1 text-[#DA6556]" />
                          Signature Course
                        </span>
                        {trainer.coursesOffered[0].claimable && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            HRD Claimable
                          </span>
                        )}
                      </div>
                      <div
                        onClick={() => onSelectTrainer(trainer)}
                        className="text-xs font-semibold text-slate-800 hover:text-[#A14646] cursor-pointer truncate"
                      >
                        {trainer.coursesOffered[0].title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {trainer.coursesOffered[0].duration} • {trainer.coursesOffered[0].level}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer / Action */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">
                      Daily Corporate Rate
                    </div>
                    <div className="text-sm font-extrabold text-[#A14646] flex items-center">
                      RM {(trainer.dailyRateUSD * 4.4).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <span className="text-[11px] text-slate-400 font-normal ml-1">/ day</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectTrainer(trainer)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                    >
                      Credentials
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestBooking(trainer, trainer.coursesOffered[0])}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#DA6556] to-[#EB895B] hover:from-[#A14646] hover:to-[#DA6556] rounded-lg shadow-xs transition-all flex items-center"
                    >
                      Inquire / Book
                      <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
