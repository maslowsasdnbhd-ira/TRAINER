import React, { useState } from 'react';
import { UserProfile } from '../types';
import { TrainingCourse } from '../data/coursesData';
import {
  CheckCircle,
  XCircle,
  Mail,
  Clock,
  UserCheck,
  Shield,
  Send,
  BookOpen,
  FileText,
  Sparkles,
  Download,
  Award
} from 'lucide-react';

interface AdminApprovalViewProps {
  pendingUsers: UserProfile[];
  allUsers?: UserProfile[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  pendingCourses?: TrainingCourse[];
  allCourses?: TrainingCourse[];
  onApproveCourse?: (courseId: string) => void;
  onRejectCourse?: (courseId: string) => void;
}

export function AdminApprovalView({
  pendingUsers,
  allUsers = [],
  onApproveUser,
  onRejectUser,
  pendingCourses = [],
  allCourses = [],
  onApproveCourse,
  onRejectCourse,
}: AdminApprovalViewProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'courses'>('users');
  const [activeFilter, setActiveFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [lastEmailSent, setLastEmailSent] = useState<{ to: string; name: string; id: string } | null>(null);
  const [lastCourseApproved, setLastCourseApproved] = useState<string | null>(null);

  const displayedUsers = activeFilter === 'pending'
    ? pendingUsers
    : activeFilter === 'all'
    ? allUsers
    : allUsers.filter((u) => u.status === activeFilter);

  const displayedCourses = activeFilter === 'pending'
    ? pendingCourses
    : activeFilter === 'all'
    ? allCourses
    : allCourses.filter((c) => (c.status || 'approved') === activeFilter);

  const handleApproveWithNotice = (user: UserProfile) => {
    onApproveUser(user.id);
    setLastEmailSent({ to: user.email, name: user.fullName, id: user.id });
    setTimeout(() => {
      setLastEmailSent(null);
    }, 6000);
  };

  const handleApproveCourseWithNotice = (course: TrainingCourse) => {
    if (onApproveCourse) {
      onApproveCourse(course.id);
      setLastCourseApproved(course.title);
      setTimeout(() => {
        setLastCourseApproved(null);
      }, 6000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#A14646]" />
            <h3 className="text-lg font-bold text-slate-900">Maslow SA Admin Approval Portal</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Authorize trainer &amp; client onboarding credentials and review trainer course curriculum submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {pendingUsers.length + pendingCourses.length} Total Pending
          </span>
        </div>
      </div>

      {/* Main Switcher: Users vs Courses */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('users');
            setActiveFilter('pending');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#A14646] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>User Registrations</span>
          {pendingUsers.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white text-[#A14646] font-extrabold">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('courses');
            setActiveFilter('pending');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-[#A14646] text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Trainer Course Proposals</span>
          {pendingCourses.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
              {pendingCourses.length}
            </span>
          )}
        </button>
      </div>

      {/* Secondary Status Filters */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => setActiveFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeFilter === 'pending'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Pending ({activeTab === 'users' ? pendingUsers.length : pendingCourses.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('approved')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeFilter === 'approved'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Approved ({activeTab === 'users' ? allUsers.filter((u) => u.status === 'approved').length : allCourses.filter((c) => (c.status || 'approved') === 'approved').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Records ({activeTab === 'users' ? allUsers.length : allCourses.length})
        </button>
      </div>

      {/* Toast Alert for Course Approval */}
      {lastCourseApproved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Course Approved &amp; Published!</span>
              <p className="text-[11px] text-emerald-700">
                &quot;{lastCourseApproved}&quot; has been verified for HRD Corp guidelines and added to the official catalog. Notification dispatched to <strong>info@maslowsa.com</strong>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLastCourseApproved(null)}
            className="text-emerald-600 hover:text-emerald-800 font-bold ml-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Toast Alert for User Approval */}
      {lastEmailSent && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Official Approval Email Dispatched!</span>
              <p className="text-[11px] text-emerald-700">
                Sent from <code className="font-mono bg-emerald-100/60 px-1 rounded">info@maslowsa.com</code> to <strong>{lastEmailSent.name}</strong> ({lastEmailSent.to}) for ID <strong>{lastEmailSent.id}</strong>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLastEmailSent(null)}
            className="text-emerald-600 hover:text-emerald-800 font-bold ml-2 text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: USERS REGISTRATIONS */}
      {activeTab === 'users' && (
        <>
          {displayedUsers.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <UserCheck className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {activeFilter === 'pending'
                  ? 'No pending registrations awaiting approval.'
                  : `No registrations found for '${activeFilter}' filter.`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                New trainer or client sign-ups will appear here for verification and email dispatch.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-bold text-slate-900 text-sm truncate">{user.fullName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'trainer'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {user.role} ({user.id})
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          user.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : user.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        Status: {user.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                      <span>
                        Email: <strong className="text-slate-800">{user.email}</strong>
                      </span>
                      <span>
                        Phone: <strong className="text-slate-800">{user.telephone}</strong>
                      </span>
                      <span>
                        IC / Passport: <strong className="text-slate-800">{user.icNumber}</strong>
                      </span>
                      <span className="text-slate-400">
                        Registered: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    {user.status === 'pending' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveWithNotice(user)}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve &amp; Email
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectUser(user.id)}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-100 text-red-700 font-semibold text-xs hover:bg-red-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    ) : user.status === 'approved' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Approved
                        </span>
                        <button
                          type="button"
                          onClick={() => onRejectUser(user.id)}
                          className="px-2.5 py-1 text-[11px] rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Rejected
                        </span>
                        <button
                          type="button"
                          onClick={() => handleApproveWithNotice(user)}
                          className="px-2.5 py-1 text-[11px] rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 transition cursor-pointer"
                        >
                          Re-Approve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: COURSE PROPOSALS */}
      {activeTab === 'courses' && (
        <>
          {displayedCourses.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">
                {activeFilter === 'pending'
                  ? 'No pending trainer course proposals awaiting review.'
                  : `No courses found under '${activeFilter}' filter.`}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Courses submitted by certified trainers via the Course Upload Portal will appear here for syllabus evaluation.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedCourses.map((course) => {
                const courseStatus = course.status || 'approved';
                return (
                  <div
                    key={course.id}
                    className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        <div className="flex items-center flex-wrap gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            {course.category}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#A14646]/10 text-[#A14646]">
                            ID: {course.id}
                          </span>
                          {course.hrdClaimable && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              HRD Corp Claimable
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              courseStatus === 'approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : courseStatus === 'rejected'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            Status: {courseStatus}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1">
                          Trainer: <strong>{course.leadTrainerName || 'Trainer'}</strong> • Duration: <strong>{course.duration}</strong>
                        </p>
                      </div>

                      {/* Proposed Pricing (MYR) */}
                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposed Fee</span>
                        <span className="text-xl font-extrabold text-[#A14646]">
                          RM {course.priceMYR.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Course Description Outline */}
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {course.description}
                    </p>

                    {/* Attached Syllabus File if present */}
                    {course.syllabusFileName && (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 text-xs text-slate-700">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#DA6556]" />
                          <span>Attached Syllabus: <strong>{course.syllabusFileName}</strong></span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">Document attached</span>
                      </div>
                    )}

                    {/* Action Controls for Admin */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[11px] text-slate-400">
                        {course.submittedAt ? `Submitted: ${new Date(course.submittedAt).toLocaleDateString()}` : 'Standard Catalog Course'}
                      </span>

                      <div className="flex items-center gap-2">
                        {courseStatus === 'pending' ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApproveCourseWithNotice(course)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              Approve &amp; Publish Course
                            </button>
                            {onRejectCourse && (
                              <button
                                type="button"
                                onClick={() => onRejectCourse(course.id)}
                                className="px-3 py-2 rounded-xl bg-red-100 text-red-700 font-semibold text-xs hover:bg-red-200 transition flex items-center gap-1.5 cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            )}
                          </>
                        ) : courseStatus === 'approved' ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> Published to Catalog
                            </span>
                            {onRejectCourse && (
                              <button
                                type="button"
                                onClick={() => onRejectCourse(course.id)}
                                className="px-2.5 py-1 text-[11px] rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition cursor-pointer"
                              >
                                Unpublish
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApproveCourseWithNotice(course)}
                            className="px-3 py-1.5 text-xs rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-semibold transition cursor-pointer"
                          >
                            Re-Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
