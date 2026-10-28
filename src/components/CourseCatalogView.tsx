import React, { useState } from 'react';
import { TrainingCourse } from '../data/coursesData';
import { Trainer } from '../types';
import { Clock, CheckCircle2, ChevronRight, UserCheck, ShieldCheck, Award, ExternalLink, Filter } from 'lucide-react';

interface CourseCatalogViewProps {
  courses: TrainingCourse[];
  showPricing: boolean; // Set to false for trainers, true for clients and admins
  trainers?: Trainer[];
  onSelectTrainer?: (trainer: Trainer) => void;
  onInquireCourse?: (course: TrainingCourse) => void;
}

export function CourseCatalogView({
  courses,
  showPricing,
  trainers = [],
  onSelectTrainer,
  onInquireCourse,
}: CourseCatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTrainerFilter, setSelectedTrainerFilter] = useState<string>('All');

  const categories = ['All', 'Public Training', 'Team Building', 'In-House Training'];

  // Helper to find the matched Trainer object for deep profile viewing
  const getTrainerForCourse = (course: TrainingCourse): Trainer | undefined => {
    return trainers.find((t) =>
      t.id === course.assignedTrainerId ||
      (course.assignedTrainerId === '1' && t.id === 'tr-rachel-gomez') ||
      (course.assignedTrainerId === '2' && t.id === 'tr-aiman-zulkifli') ||
      (course.assignedTrainerId === '3' && t.id === 'tr-leon-chen') ||
      (course.assignedTrainerId === '4' && t.id === 'tr-siraj-ashok') ||
      (course.leadTrainerName && t.name.toLowerCase().includes(course.leadTrainerName.toLowerCase())) ||
      t.coursesOffered.some((c) => c.title.toLowerCase().includes(course.title.toLowerCase()))
    );
  };

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesTrainer =
      selectedTrainerFilter === 'All' ||
      course.assignedTrainerId === selectedTrainerFilter ||
      (course.leadTrainerName && course.leadTrainerName.includes(selectedTrainerFilter));

    return matchesCategory && matchesTrainer;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-[#A14646]/10 text-[#A14646] text-xs font-bold uppercase tracking-wider">
              Official Course Directory &amp; Alignment Matrix
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% HRD Corp Claimable
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Maslow SA Training Programmes (Malaysia)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Public Courses, Team Building Retreats &amp; In-House Corporate Training
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-red-50 text-[#A14646] font-bold text-xs border border-red-200 shadow-2xs shrink-0">
            All Fees in MYR (Malaysian Ringgit)
          </span>

          {/* Trainer Filter Select */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedTrainerFilter}
              onChange={(e) => setSelectedTrainerFilter(e.target.value)}
              className="text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer"
            >
              <option value="All">All Lead Master Trainers</option>
              <option value="Leon Chen">Leon Chen, MBA (AI &amp; SME Digital)</option>
              <option value="Rachel Gomez">Dr. Rachel Gomez (Education &amp; Growth Mindset)</option>
              <option value="Aiman Zulkifli">Dr. Aiman Zulkifli (Medical &amp; Occupational Health)</option>
              <option value="Siraj Khan">Datuk Dr. Siraj Khan &amp; S. Ashok (Leadership &amp; GRC)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#A14646] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const matchedTrainer = getTrainerForCourse(course);
          const trainerAvatar = course.leadTrainerAvatar || matchedTrainer?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
          const trainerName = course.leadTrainerName || matchedTrainer?.name || 'Lead Master Trainer';
          const trainerRole = course.leadTrainerRole || matchedTrainer?.headline || 'Certified Faculty Lead';

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex flex-col justify-between space-y-4 hover:shadow-lg transition-all duration-200 group hover:border-[#DA6556]"
            >
              <div className="space-y-3">
                {/* Header Tags */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#A14646]/10 text-[#A14646] font-bold text-[10px] uppercase tracking-wider">
                    {course.category}
                  </span>
                  {course.hrdClaimable && (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> HRD Corp Claimable
                    </span>
                  )}
                </div>

                {/* Course ID & Title */}
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">
                    ID: {course.id}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#A14646] transition-colors leading-snug">
                    {course.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {course.description}
                </p>

                {/* Lead Master Trainer Direct Alignment Card */}
                <div className="pt-2">
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={trainerAvatar}
                        alt={trainerName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-0.5 border-2 border-white" title="Verified Master Trainer">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#A14646] flex items-center gap-1">
                          <Award className="w-3 h-3 text-[#A14646]" />
                          Lead Master Trainer
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {trainerName}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate" title={trainerRole}>
                        {trainerRole}
                      </p>
                    </div>

                    {/* View Bio link if onSelectTrainer is available */}
                    {matchedTrainer && onSelectTrainer && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTrainer(matchedTrainer);
                        }}
                        className="shrink-0 text-slate-400 hover:text-[#A14646] p-1.5 rounded-lg hover:bg-white transition cursor-pointer"
                        title="View Trainer Bio &amp; Credentials"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing in MYR (Visible to Clients & Admins; Hidden for Trainers) */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-slate-500 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Duration: {course.duration}
                </span>

                {/* Pricing in MYR (Visible to Clients & Admins; Hidden for Trainers) */}
                {showPricing ? (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                      Course Fee
                    </span>
                    <span className="text-sm font-extrabold text-[#A14646]">
                      RM {course.priceMYR.toLocaleString('en-MY', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 italic">Fee Restricted</span>
                )}
              </div>

              {/* Inquire Action Button */}
              {onInquireCourse && (
                <button
                  type="button"
                  onClick={() => onInquireCourse(course)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#A14646] to-[#DA6556] hover:opacity-95 text-white font-semibold text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Inquire / Book With {trainerName.split(',')[0].replace('Datuk ', '')} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-slate-500 text-sm">
            No training courses found matching your selected filter criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSelectedTrainerFilter('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#A14646] text-white text-xs font-bold hover:bg-[#DA6556] transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
