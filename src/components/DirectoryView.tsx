import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Award,
  Star,
  MapPin,
  Calendar,
  Languages,
  DollarSign,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  ArrowUpDown,
  BookOpen,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIssuer, setSelectedIssuer] = useState<string>('All');
  const [minExp, setMinExp] = useState<number>(0);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedMode, setSelectedMode] = useState<string>('All');
  const [hrdClaimableOnly, setHrdClaimableOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'rate-low' | 'rate-high'>('rating');

  const categories = [
    'All',
    'AI & Data Science',
    'Leadership',
    'Quality & Six Sigma',
    'ESG & Sustainability',
    'Agile & Project Mgmt',
    'Sales & Negotiation',
    'Health & Safety',
    'Financial Literacy',
    'Innovation & Design',
    'Cybersecurity & IT',
  ];

  const issuers = ['All', 'HRD Corp', 'ISO / BSI', 'IASSC', 'ATD', 'Cambridge', 'ICF', '(ISC)²'];

  // Filter logic
  const filteredTrainers = useMemo(() => {
    return trainers.filter((t) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesHeadline = t.headline.toLowerCase().includes(q);
        const matchesBio = t.bio.toLowerCase().includes(q);
        const matchesSkills = t.expertiseAreas.some((s) => s.toLowerCase().includes(q));
        const matchesCourses = t.coursesOffered.some(
          (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
        const matchesCert = t.certifications.some(
          (c) => c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesHeadline && !matchesBio && !matchesSkills && !matchesCourses && !matchesCert) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All') {
        const matchesCategory =
          t.coursesOffered.some((c) => c.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
          t.expertiseAreas.some((e) => e.toLowerCase().includes(selectedCategory.toLowerCase()));
        if (!matchesCategory) return false;
      }

      // Issuer
      if (selectedIssuer !== 'All') {
        const hasIssuer = t.certifications.some((c) =>
          c.issuer.toLowerCase().includes(selectedIssuer.toLowerCase())
        );
        if (!hasIssuer) return false;
      }

      // Minimum Experience
      if (minExp > 0 && t.yearsExperience < minExp) {
        return false;
      }

      // Minimum Rating
      if (minRating > 0 && t.rating < minRating) {
        return false;
      }

      // Delivery Mode
      if (selectedMode !== 'All' && !t.deliveryModes.includes(selectedMode as any)) {
        return false;
      }

      // HRD Corp Claimable
      if (hrdClaimableOnly) {
        const hasClaimable = t.coursesOffered.some((c) => c.claimable);
        if (!hasClaimable) return false;
      }

      return true;
    });
  }, [trainers, searchQuery, selectedCategory, selectedIssuer, minExp, minRating, selectedMode, hrdClaimableOnly]);

  // Sort logic
  const sortedTrainers = useMemo(() => {
    const list = [...filteredTrainers];
    switch (sortBy) {
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'experience':
        return list.sort((a, b) => b.yearsExperience - a.yearsExperience);
      case 'rate-low':
        return list.sort((a, b) => a.dailyRateUSD - b.dailyRateUSD);
      case 'rate-high':
        return list.sort((a, b) => b.dailyRateUSD - a.dailyRateUSD);
      default:
        return list;
    }
  }, [filteredTrainers, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Search & Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, skill, trainer name, or certification (e.g. 'Python', 'HRD Corp', 'Six Sigma')..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMatchmaker}
              className="flex items-center justify-center px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl border border-indigo-200 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-1.5 text-indigo-600" />
              Ask AI Matchmaker
            </button>

            <button
              onClick={onOpenTrainerPortal}
              className="flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              + Register as Trainer
            </button>
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar mt-3 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center shrink-0">
            <Layers className="w-3.5 h-3.5 mr-1" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Detailed Secondary Filters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* TTT Issuing Body */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              TTT Issuing Body
            </label>
            <select
              value={selectedIssuer}
              onChange={(e) => setSelectedIssuer(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {issuers.map((iss) => (
                <option key={iss} value={iss}>
                  {iss}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Experience
            </label>
            <select
              value={minExp}
              onChange={(e) => setMinExp(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>Any Experience</option>
              <option value={5}>5+ Years</option>
              <option value={10}>10+ Years</option>
              <option value={15}>15+ Years</option>
            </select>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>Any Rating</option>
              <option value={4.8}>4.8 ★ & Above</option>
              <option value={4.9}>4.9 ★ & Above</option>
            </select>
          </div>

          {/* Delivery Mode */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Delivery Mode
            </label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="All">All Formats</option>
              <option value="In-Person">In-Person</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Virtual">Virtual</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1 flex items-center">
              <ArrowUpDown className="w-3 h-3 mr-1" /> Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="rating">Highest Rated</option>
              <option value="experience">Most Experienced</option>
              <option value="rate-low">Daily Rate: Low to High</option>
              <option value="rate-high">Daily Rate: High to Low</option>
            </select>
          </div>

          {/* HRD Claimable Toggle */}
          <div className="flex items-end pb-1">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 select-none">
              <input
                type="checkbox"
                checked={hrdClaimableOnly}
                onChange={(e) => setHrdClaimableOnly(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="font-semibold text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                HRD Corp Claimable
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Certified Trainers Directory
          </h2>
          <p className="text-xs text-slate-500">
            Showing {sortedTrainers.length} verified instructor{sortedTrainers.length !== 1 ? 's' : ''} with audited TTT credentials
          </p>
        </div>

        {(searchQuery || selectedCategory !== 'All' || selectedIssuer !== 'All' || minExp > 0 || minRating > 0 || hrdClaimableOnly) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedIssuer('All');
              setMinExp(0);
              setMinRating(0);
              setSelectedMode('All');
              setHrdClaimableOnly(false);
            }}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Trainer Grid */}
      {sortedTrainers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">
            No trainers match the selected filters
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Try adjusting your search criteria, removing issuing body restrictions, or consult the AI Matchmaker for custom instructor recommendations.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedIssuer('All');
                setMinExp(0);
                setMinRating(0);
                setHrdClaimableOnly(false);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
            >
              Clear All Filters
            </button>
            <button
              onClick={onOpenMatchmaker}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Ask AI Matchmaker
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTrainers.map((trainer) => {
            const primaryCert = trainer.certifications[0];
            const hasHrdCorp = trainer.certifications.some((c) =>
              c.issuer.toLowerCase().includes('hrd')
            );
            const claimableCount = trainer.coursesOffered.filter((c) => c.claimable).length;

            return (
              <div
                key={trainer.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group"
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
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full shadow-xs border-2 border-white" title="Verified TTT">
                        <Shield className="w-3 h-3" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3
                          onClick={() => onSelectTrainer(trainer)}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors truncate cursor-pointer text-base"
                        >
                          {trainer.name}
                        </h3>
                      </div>

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
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
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

                  {/* Course Highlight */}
                  {trainer.coursesOffered[0] && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span className="flex items-center">
                          <BookOpen className="w-3 h-3 mr-1 text-blue-500" />
                          Signature Course
                        </span>
                        {trainer.coursesOffered[0].claimable && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            HRD Claimable
                          </span>
                        )}
                      </div>
                      <div
                        onClick={() => onSelectTrainer(trainer)}
                        className="text-xs font-semibold text-slate-800 hover:text-blue-600 cursor-pointer truncate"
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
                    <div className="text-sm font-extrabold text-slate-900 flex items-center">
                      ${trainer.dailyRateUSD.toLocaleString()}
                      <span className="text-[11px] text-slate-400 font-normal ml-1">/ day</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectTrainer(trainer)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
                    >
                      Credentials
                    </button>
                    <button
                      onClick={() => onRequestBooking(trainer, trainer.coursesOffered[0])}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center"
                    >
                      Book / RFP
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
