import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DirectoryView } from './components/DirectoryView';
import { AIMatchmakerView } from './components/AIMatchmakerView';
import { TrainerUploadPortal } from './components/TrainerUploadPortal';
import { TrainerDetailModal } from './components/TrainerDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingsDrawer } from './components/BookingsDrawer';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { AdminApprovalView } from './components/AdminApprovalView';
import { Footer } from './components/Footer';
import { TopBar } from './components/TopBar';
import { INITIAL_TRAINERS } from './data/initialTrainers';
import { Trainer, CourseOffering, BookingRFP, AuthState, UserRole, UserProfile } from './types';
import { Upload, ShieldAlert, ArrowRight } from 'lucide-react';

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'TR-1001',
    role: 'trainer',
    fullName: 'Dr. Rachel Gomez',
    email: 'rachel.gomez@maslowsa.com',
    telephone: '0124419982',
    icNumber: '890312-14-5522',
    status: 'approved',
    createdAt: '2026-08-10T08:00:00Z',
  },
  {
    id: 'TR-1002',
    role: 'trainer',
    fullName: 'Dr. Aiman Zulkifli',
    email: 'aiman.zulkifli@maslowsa.com',
    telephone: '0193381289',
    icNumber: '880620-10-5141',
    status: 'approved',
    createdAt: '2026-09-01T09:30:00Z',
  },
  {
    id: 'CL-2001',
    role: 'client',
    fullName: 'Nexus International School HR',
    email: 'nexus.hr@edu.my',
    telephone: '0388881234',
    icNumber: '791104-14-6101',
    status: 'approved',
    createdAt: '2026-09-12T11:00:00Z',
  },
  {
    id: 'TR-1003',
    role: 'trainer',
    fullName: 'Irfan Iskandar, MSc',
    email: 'irfan.iskandar@outlook.com',
    telephone: '0179924510',
    icNumber: '920415-10-5329',
    status: 'pending',
    createdAt: '2026-10-27T14:20:00Z',
  },
  {
    id: 'CL-2002',
    role: 'client',
    fullName: 'PetroTech Engineering Sdn Bhd',
    email: 'training@petrotech.com.my',
    telephone: '0138819200',
    icNumber: '850723-14-6299',
    status: 'pending',
    createdAt: '2026-10-27T16:45:00Z',
  },
];

export default function App() {
  // Authentication & RBAC state
  const [auth, setAuth] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem('maslow_auth_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return {
      isAuthenticated: true,
      role: 'admin',
      username: 'admin',
    };
  });

  // Registered Users Directory (with unique TR/CL IDs, telephone, IC, approval status)
  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem('maslow_registered_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_USERS;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerRole, setRegisterRole] = useState<'trainer' | 'client'>('trainer');

  const [currentTab, setCurrentTab] = useState<'directory' | 'matchmaker' | 'onboarding' | 'approvals'>('directory');
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [bookingTrainer, setBookingTrainer] = useState<Trainer | null>(null);
  const [bookingCourse, setBookingCourse] = useState<CourseOffering | undefined>(undefined);
  const [bookings, setBookings] = useState<BookingRFP[]>([]);
  const [isRfpsDrawerOpen, setIsRfpsDrawerOpen] = useState(false);

  // Sync auth state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maslow_auth_state', JSON.stringify(auth));
    } catch (e) {}
  }, [auth]);

  // Sync registered users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maslow_registered_users', JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  // Adjust active tab when role changes
  useEffect(() => {
    if (auth.role === 'trainer') {
      setCurrentTab('onboarding');
    } else if (auth.role === 'client' && (currentTab === 'onboarding' || currentTab === 'approvals')) {
      setCurrentTab('directory');
    }
  }, [auth.role]);

  // Fetch trainers and bookings from server
  useEffect(() => {
    fetch('/api/trainers')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTrainers(data);
        }
      })
      .catch(() => console.log('Using seeded trainers'));

    fetch('/api/bookings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = (role: 'admin' | 'trainer' | 'client', username: string, userProfile?: UserProfile) => {
    const newAuth: AuthState = {
      isAuthenticated: true,
      role,
      username,
      userProfile,
    };
    setAuth(newAuth);
    setIsLoginModalOpen(false);

    if (role === 'trainer') {
      setCurrentTab('onboarding');
    } else {
      setCurrentTab('directory');
    }
  };

  const handleSignOut = () => {
    const loggedOutAuth: AuthState = {
      isAuthenticated: false,
      role: null,
      username: '',
    };
    setAuth(loggedOutAuth);
    setIsLoginModalOpen(true);
  };

  const handleSwitchRole = (newRole: 'admin' | 'trainer' | 'client') => {
    handleLogin(newRole, newRole);
  };

  // User Registration & Approval Actions
  const handleRegisterSubmit = (newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleApproveUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'approved' } : u))
    );
  };

  const handleRejectUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'rejected' } : u))
    );
  };

  // When a newly parsed trainer profile is published
  const handleProfilePublished = (newTrainer: Trainer) => {
    setTrainers((prev) => [newTrainer, ...prev.filter((t) => t.id !== newTrainer.id)]);
  };

  // When a corporate RFP is submitted
  const handleBookingCreated = (newRfp: BookingRFP) => {
    setBookings((prev) => [newRfp, ...prev]);
  };

  const handleOpenBooking = (trainer: Trainer, course?: CourseOffering) => {
    setBookingTrainer(trainer);
    setBookingCourse(course);
  };

  const pendingUsers = users.filter((u) => u.status === 'pending');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-[#DA6556]/20 selection:text-[#A14646]">
      {/* Top Bar: Current Signed-In User & Role on Left, Sign Out on Right */}
      {auth.isAuthenticated && (
        <TopBar
          role={auth.role || 'client'}
          username={auth.username || 'User'}
          onSignOut={handleSignOut}
        />
      )}

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        trainerCount={trainers.length}
        rfpCount={bookings.length}
        pendingApprovalsCount={pendingUsers.length}
        onOpenRfps={() => setIsRfpsDrawerOpen(true)}
        auth={auth}
        onSignOut={handleSignOut}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area based on User Role */}
      <main className="flex-1">
        {/* ============================================================== */}
        {/* TIER 1: TRAINER VIEW (Dedicated CV & Certificate Portal)       */}
        {/* ============================================================== */}
        {auth.role === 'trainer' && (
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#DA6556]/10 to-[#EB895B]/10 border border-[#DA6556]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DA6556] text-white flex items-center justify-center shrink-0 shadow-md">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Trainer Credential &amp; CV Upload Portal
                    </h2>
                    <p className="text-xs text-slate-600">
                      Upload your CV and certificates for automated HRD Corp credential verification and course outline extraction.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white text-[#DA6556] border border-[#DA6556]/30 shadow-sm">
                    Logged in as: Trainer ({auth.userProfile?.id || auth.username})
                  </span>
                </div>
              </div>
            </div>

            <TrainerUploadPortal
              onProfilePublished={handleProfilePublished}
              onNavigateToDirectory={() => handleSwitchRole('client')}
            />
          </div>
        )}

        {/* ============================================================== */}
        {/* TIER 2: CLIENT VIEW (Courses, Search & AI Matchmaker)          */}
        {/* ============================================================== */}
        {auth.role === 'client' && (
          <>
            {currentTab === 'directory' && (
              <>
                <HeroBanner
                  onOpenMatchmaker={() => setCurrentTab('matchmaker')}
                  onOpenTrainerPortal={() => {
                    setRegisterRole('trainer');
                    setIsRegisterModalOpen(true);
                  }}
                  trainerCount={trainers.length}
                />
                <DirectoryView
                  trainers={trainers}
                  onSelectTrainer={(t) => setSelectedTrainer(t)}
                  onRequestBooking={handleOpenBooking}
                  onOpenMatchmaker={() => setCurrentTab('matchmaker')}
                  onOpenTrainerPortal={() => {
                    setRegisterRole('trainer');
                    setIsRegisterModalOpen(true);
                  }}
                />
              </>
            )}

            {currentTab === 'matchmaker' && (
              <AIMatchmakerView
                trainers={trainers}
                onSelectTrainer={(t) => setSelectedTrainer(t)}
                onRequestBooking={handleOpenBooking}
              />
            )}
          </>
        )}

        {/* ============================================================== */}
        {/* TIER 3: ADMIN VIEW (Full Access to All Tabs & Tools)           */}
        {/* ============================================================== */}
        {auth.role === 'admin' && (
          <>
            {/* Admin Notification Banner when Pending Requests Exist */}
            {pendingUsers.length > 0 && currentTab !== 'approvals' && (
              <div className="bg-amber-500/10 border-b border-amber-500/30 py-3 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-medium">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Admin Attention:</strong> You have <strong>{pendingUsers.length}</strong> new registration request(s) awaiting IC/Phone review &amp; email approval.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('approvals')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#A14646] hover:bg-[#DA6556] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                  >
                    Open Approvals Portal <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 1: Directory & Courses */}
            {currentTab === 'directory' && (
              <>
                <HeroBanner
                  onOpenMatchmaker={() => setCurrentTab('matchmaker')}
                  onOpenTrainerPortal={() => setCurrentTab('onboarding')}
                  trainerCount={trainers.length}
                />
                <DirectoryView
                  trainers={trainers}
                  onSelectTrainer={(t) => setSelectedTrainer(t)}
                  onRequestBooking={handleOpenBooking}
                  onOpenMatchmaker={() => setCurrentTab('matchmaker')}
                  onOpenTrainerPortal={() => setCurrentTab('onboarding')}
                />
              </>
            )}

            {/* Tab 2: AI Matchmaker */}
            {currentTab === 'matchmaker' && (
              <AIMatchmakerView
                trainers={trainers}
                onSelectTrainer={(t) => setSelectedTrainer(t)}
                onRequestBooking={handleOpenBooking}
              />
            )}

            {/* Tab 3: Trainer Upload & AI Onboarding Portal */}
            {currentTab === 'onboarding' && (
              <TrainerUploadPortal
                onProfilePublished={handleProfilePublished}
                onNavigateToDirectory={() => setCurrentTab('directory')}
              />
            )}

            {/* Tab 4: Admin Approval Portal */}
            {currentTab === 'approvals' && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminApprovalView
                  pendingUsers={pendingUsers}
                  allUsers={users}
                  onApproveUser={handleApproveUser}
                  onRejectUser={handleRejectUser}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals & Drawers */}
      <TrainerDetailModal
        trainer={selectedTrainer}
        onClose={() => setSelectedTrainer(null)}
        onRequestBooking={handleOpenBooking}
      />

      <BookingModal
        trainer={bookingTrainer}
        selectedCourse={bookingCourse}
        onClose={() => {
          setBookingTrainer(null);
          setBookingCourse(undefined);
        }}
        onBookingCreated={handleBookingCreated}
      />

      <BookingsDrawer
        isOpen={isRfpsDrawerOpen}
        onClose={() => setIsRfpsDrawerOpen(false)}
        bookings={bookings}
      />

      {/* Registration Modal for Trainers and Clients */}
      {isRegisterModalOpen && (
        <RegisterModal
          role={registerRole}
          existingUsers={users}
          onRoleChange={setRegisterRole}
          onRegisterSubmit={handleRegisterSubmit}
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      )}

      {/* Login Screen / Modal (Appears when signed out or when triggered) */}
      <LoginModal
        isOpen={!auth.isAuthenticated || isLoginModalOpen}
        onLogin={handleLogin}
        onClose={() => setIsLoginModalOpen(false)}
        canClose={auth.isAuthenticated}
        registeredUsers={users}
        onOpenRegister={(role) => {
          setIsLoginModalOpen(false);
          setRegisterRole(role);
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Platform 3-Column Sunset Footer */}
      <Footer />
    </div>
  );
}
