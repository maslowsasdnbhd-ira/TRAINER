import React, { useState } from 'react';
import { UserProfile } from '../types';
import { CheckCircle, XCircle, Mail, Clock, UserCheck, Shield, Send } from 'lucide-react';

interface AdminApprovalViewProps {
  pendingUsers: UserProfile[];
  allUsers?: UserProfile[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
}

export function AdminApprovalView({
  pendingUsers,
  allUsers = [],
  onApproveUser,
  onRejectUser,
}: AdminApprovalViewProps) {
  const [activeFilter, setActiveFilter] = useState<'pending' | 'all' | 'approved' | 'rejected'>('pending');
  const [lastEmailSent, setLastEmailSent] = useState<{ to: string; name: string; id: string } | null>(null);

  const displayedUsers = activeFilter === 'pending'
    ? pendingUsers
    : activeFilter === 'all'
    ? allUsers
    : allUsers.filter((u) => u.status === activeFilter);

  const handleApproveWithNotice = (user: UserProfile) => {
    onApproveUser(user.id);
    setLastEmailSent({ to: user.email, name: user.fullName, id: user.id });
    setTimeout(() => {
      setLastEmailSent(null);
    }, 6000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#A14646]" />
            <h3 className="text-lg font-bold text-slate-900">Admin Approval Portal</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Review and approve pending Trainer and Client registrations. IC and Phone duplicate verification enforced.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {pendingUsers.length} Pending Request{pendingUsers.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <button
          type="button"
          onClick={() => setActiveFilter('pending')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeFilter === 'pending'
              ? 'bg-[#A14646] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Pending ({pendingUsers.length})
        </button>
        {allUsers.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setActiveFilter('approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeFilter === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Approved ({allUsers.filter((u) => u.status === 'approved').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeFilter === 'rejected'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Rejected ({allUsers.filter((u) => u.status === 'rejected').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Records ({allUsers.length})
            </button>
          </>
        )}
      </div>

      {/* Email Dispatch Toast Banner */}
      {lastEmailSent && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Official Approval Email Dispatched!</span>
              <p className="text-[11px] text-emerald-700">
                Sent from <code className="font-mono bg-emerald-100/60 px-1 rounded">sales@maslowsa.com</code> to <strong>{lastEmailSent.name}</strong> ({lastEmailSent.to}) for ID <strong>{lastEmailSent.id}</strong>.
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

      {/* Users List */}
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
                      className="px-2.5 py-1 text-[11px] rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition"
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
                      className="px-2.5 py-1 text-[11px] rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 border border-slate-200 transition"
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
    </div>
  );
}
