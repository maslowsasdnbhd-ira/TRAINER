import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  Star,
  Calendar,
  Award,
  ChevronRight,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Trainer, MatchTrainersResponse, CourseOffering } from '../types';

interface AIMatchmakerViewProps {
  trainers: Trainer[];
  onSelectTrainer: (trainer: Trainer) => void;
  onRequestBooking: (trainer: Trainer, course?: CourseOffering) => void;
}

export const AIMatchmakerView: React.FC<AIMatchmakerViewProps> = ({
  trainers,
  onSelectTrainer,
  onRequestBooking,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchResponse, setMatchResponse] = useState<MatchTrainersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    'I need an HRD Corp certified trainer who can teach Python and AI prompts to beginner managers in a 2-day corporate workshop in Kuala Lumpur.',
    'Looking for an executive leadership coach with 10+ years experience to run change management and psychological safety for 40 senior directors.',
    'Need a Lean Six Sigma Master Black Belt to run DMAIC root-cause analysis and waste reduction for manufacturing engineers.',
    'Find an ISO 14064 corporate carbon accounting & ESG sustainability auditor for our supply chain and finance teams.',
    'Seeking an experienced B2B consultative negotiation trainer to help account executives defend margins against tough procurement.',
  ];

  const handleMatch = async (searchPrompt?: string) => {
    const textToSearch = searchPrompt || query;
    if (!textToSearch.trim()) return;

    if (searchPrompt) {
      setQuery(searchPrompt);
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/match-trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSearch,
          trainers,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to rank trainers. Please try again.');
      }

      const data: MatchTrainersResponse = await res.json();
      setMatchResponse(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while matching.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemini Semantic Matchmaker</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Find the Ideal TTT Certified Trainer via Natural Language
        </h2>
        <p className="text-sm text-slate-600">
          Describe your corporate training objectives, participant profile, desired certifications
          (like HRD Corp, ISO, Six Sigma), and workshop format. Gemini will rank and rationalize the
          best qualified instructors from our certified directory.
        </p>
      </div>

      {/* Natural Language Prompt Box */}
      <div className="bg-white rounded-2xl shadow-md border border-indigo-100 p-4 sm:p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMatch();
          }}
          className="space-y-4"
        >
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'We have 25 mid-level operations managers who need a 2-day HRD Corp claimable workshop on Python and automation tools. The trainer must have TTT accreditation and practical industry experience...'"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center">
              <Brain className="w-3.5 h-3.5 mr-1 text-indigo-500" />
              Analyzes certifications, course syllabi, years of experience, and methodology
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Trainers with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-amber-300" />
                  Run AI Matchmaker
                </>
              )}
            </button>
          </div>
        </form>

        {/* Suggested Prompt Chips */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-xs font-semibold text-slate-500 mb-2.5">
            Or try one of these common enterprise training requirements:
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleMatch(prompt)}
                className="text-left text-xs bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-all"
              >
                "{prompt.length > 70 ? prompt.slice(0, 70) + '...' : prompt}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          {error}
        </div>
      )}

      {/* AI Analysis & Results */}
      {matchResponse && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Analysis Card */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Gemini Intent &amp; Requirement Breakdown</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-3 border-t border-indigo-800/60 text-xs">
              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="text-slate-400 font-semibold mb-1">Interpreted Goal</div>
                <div className="font-bold text-white text-sm">
                  {matchResponse.analysis.interpretedGoal}
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="text-slate-400 font-semibold mb-1">Target Audience</div>
                <div className="font-bold text-white text-sm">
                  {matchResponse.analysis.targetAudienceIdentified || 'Corporate Professionals'}
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="text-slate-400 font-semibold mb-1">Required Skills</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {matchResponse.analysis.skillsRequired.map((skill, i) => (
                    <span
                      key={i}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                <div className="text-slate-400 font-semibold mb-1">Suggested Format</div>
                <div className="font-bold text-white text-sm">
                  {matchResponse.analysis.suggestedFormat || '2 Days (14 Hours)'}
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                Ranked Trainer Matches ({matchResponse.matches.length})
              </h3>
              <span className="text-xs text-slate-500">
                Ordered by AI semantic alignment &amp; credential relevance
              </span>
            </div>

            {matchResponse.matches.map((item, index) => {
              const trainer = trainers.find((t) => t.id === item.trainerId);
              if (!trainer) return null;

              const isTopMatch = index === 0 && item.matchScore >= 90;

              return (
                <div
                  key={trainer.id}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all hover:shadow-md ${
                    isTopMatch
                      ? 'border-indigo-400 ring-2 ring-indigo-100 shadow-sm'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Avatar & Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="relative shrink-0">
                        <img
                          src={trainer.avatar}
                          alt={trainer.name}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100"
                        />
                        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-extrabold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                          #{index + 1}
                        </span>
                      </div>

                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4
                            onClick={() => onSelectTrainer(trainer)}
                            className="font-bold text-slate-900 text-base hover:text-indigo-600 cursor-pointer transition-colors"
                          >
                            {trainer.name}
                          </h4>
                          {isTopMatch && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center">
                              <Star className="w-3 h-3 mr-1 fill-amber-500 text-amber-500" />
                              Best Match
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center">
                            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                            TTT Accredited
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-1">{trainer.headline}</p>

                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center text-amber-500 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                            {trainer.rating.toFixed(2)} ({trainer.reviewCount} reviews)
                          </span>
                          <span>•</span>
                          <span>{trainer.yearsExperience} yrs experience</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-900">
                            ${trainer.dailyRateUSD.toLocaleString()} / day
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Match Score Gauge */}
                    <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                      <div className="text-right">
                        <div className="text-[11px] font-semibold text-slate-400 uppercase">
                          Match Score
                        </div>
                        <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                          {item.matchScore}%
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectTrainer(trainer)}
                          className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
                        >
                          View Credentials
                        </button>
                        <button
                          onClick={() => onRequestBooking(trainer, trainer.coursesOffered[0])}
                          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center"
                        >
                          Request Proposal
                          <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* AI Match Reasoning Box */}
                  <div className="mt-4 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-slate-700 space-y-2">
                    <div className="flex items-center text-indigo-900 font-bold">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
                      Why this trainer is an ideal match:
                    </div>
                    <p className="leading-relaxed text-indigo-950 font-normal">
                      {item.matchReasoning}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-indigo-100/80 text-[11px]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-500">Matching skills:</span>
                        {item.highlightedSkills?.map((skill, si) => (
                          <span
                            key={si}
                            className="px-2 py-0.5 rounded bg-white text-indigo-700 font-medium border border-indigo-200 shadow-2xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {item.recommendedCourseTitle && (
                        <div className="text-slate-600 flex items-center font-medium">
                          <span className="text-slate-400 mr-1">Recommended Course:</span>
                          <span className="font-bold text-slate-900">
                            {item.recommendedCourseTitle}
                          </span>
                          <span className="text-slate-400 ml-1">({item.suggestedDuration})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
