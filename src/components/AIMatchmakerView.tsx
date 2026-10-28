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
    'We are an international school looking for an educator workshop on Growth Mindset Classrooms and supporting students with ADHD and executive functioning challenges.',
    'I am an SME business owner looking for a hands-on training on AI Tools for Small Business Owners & Working Adults to automate operations and content.',
    'Need certified First Aid & CPR/AED certification training for international school teachers and staff before the upcoming semester.',
    'Looking for an in-house corporate team building retreat focused on Adult Mental Health Strategies, psychological safety, and self-actualization.',
    'Need a specialized language pedagogy trainer to conduct Vivid Vocabulary & Creative Writing workshops for our primary educators.',
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
          <span>Maslow SA Sdn Bhd • AI Training Consultant</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Corporate Matchmaker &amp; Training Advisory
        </h2>
        <p className="text-sm text-slate-600">
          Our specialized Google AI Studio consultant analyzes your organization's challenges,
          learning goals, and audience profile (Educators, Entrepreneurs, In-House Teams) to recommend
          the best-fit Maslow SA courses and certified trainers for self-actualization.
        </p>
      </div>

      {/* Natural Language Prompt Box */}
      <div className="bg-white rounded-2xl shadow-md border border-indigo-100 p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold text-slate-700 flex items-center">
            <Brain className="w-4 h-4 mr-1.5 text-indigo-600" />
            Client / Participant Profile
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() =>
                setQuery(
                  `[Client / Participant Profile]\n- Target Audience Category: Educator (International School Teachers)\n- Specific Challenge / Learning Goal: Supporting students with ADHD & Growth Mindset Classrooms\n- Preferred Training Format: In-House Training (2 Days)`
                )
              }
              className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors"
            >
              + Educator Profile
            </button>
            <button
              type="button"
              onClick={() =>
                setQuery(
                  `[Client / Participant Profile]\n- Target Audience Category: Entrepreneur (SME Business Owners & Working Adults)\n- Specific Challenge / Learning Goal: Introduction to AI Tools for Business to automate marketing & operations\n- Preferred Training Format: Public Course / 1-Day Masterclass`
                )
              }
              className="text-[10px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md transition-colors"
            >
              + Entrepreneur Profile
            </button>
            <button
              type="button"
              onClick={() =>
                setQuery(
                  `[Client / Participant Profile]\n- Target Audience Category: Corporate Team (40 Managers & Staff)\n- Specific Challenge / Learning Goal: First Aid for International Schools & Adult Mental Health Strategies\n- Preferred Training Format: Team Building & In-House Training (2 Days)`
                )
              }
              className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
            >
              + In-House & Team Building
            </button>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMatch();
          }}
          className="space-y-4"
        >
          <div className="relative">
            <textarea
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. '[Client / Participant Profile]&#10;- Target Audience Category: Educator&#10;- Specific Challenge / Learning Goal: Managing disruptive behavior and ADHD accommodations in classroom&#10;- Preferred Training Format: In-House Training (2 Days)'"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none text-slate-800 placeholder:text-slate-400 font-mono text-xs sm:text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Evaluates TTT accreditation, domain mastery, and Maslow SA Sdn Bhd booking availability
            </div>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-maslow-darkRed via-maslow-terracotta to-maslow-peach hover:opacity-95 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-md shadow-maslow-terracotta/20 transition-all flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing with Maslow SA Consultant...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 text-maslow-sand" />
                  Match via Maslow SA Consultant
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
                        <div className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-maslow-darkRed to-maslow-terracotta">
                          {item.matchScore}%
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectTrainer(trainer)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-maslow-terracotta to-maslow-peach hover:from-maslow-darkRed hover:to-maslow-terracotta rounded-xl shadow-xs transition-all"
                        >
                          View Credentials &amp; Profile
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

                    {/* Maslow SA Next Steps */}
                    <div className="mt-2 pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px] text-indigo-900 bg-white/70 p-2 rounded-lg">
                      <span className="flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600 shrink-0" />
                        <strong>Next Steps:</strong> Review credentials or contact sales@maslowsa.com for customized corporate training alignment with HRD Corp grant claim support.
                      </span>
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
