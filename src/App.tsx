import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { DirectoryView } from './components/DirectoryView';
import { AIMatchmakerView } from './components/AIMatchmakerView';
import { TrainerUploadPortal } from './components/TrainerUploadPortal';
import { TrainerDetailModal } from './components/TrainerDetailModal';
import { BookingModal } from './components/BookingModal';
import { BookingsDrawer } from './components/BookingsDrawer';
import { AuthModal } from './components/AuthModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { AdminApprovalView } from './components/AdminApprovalView';
import { CourseCatalogView } from './components/CourseCatalogView';
import { TrainerCourseUpload } from './components/TrainerCourseUploadModal';
import { Footer } from './components/Footer';
import { TopBar } from './components/TopBar';
import { INITIAL_TRAINERS } from './data/initialTrainers';
import { malaysianTrainingCatalog, TrainingCourse } from './data/coursesData';
import { Trainer, CourseOffering, BookingRFP, AuthState, UserRole, UserProfile } from './types';
import { ShieldAlert, ArrowRight, Lock, BookOpen, PlusCircle, Award, FileText } from 'lucide-react';

const INITIAL_USERS: UserProfile[] = [
  {
    id: 'ADMIN',
    role: 'admin',
    fullName: 'Master Administrator',
    email: 'info@maslowsa.com',
    telephone: '0377229988',
    icNumber: '800101-14-5000',
    status: 'approved',
    createdAt: '2026-01-01T00:00:00Z',
    password: '1234',
  },
  {
    id: 'TR-1001',
    role: 'trainer',
    fullName: 'Dr. Rachel Gomez',
    email: 'rachel.gomez@maslowsa.com',
    telephone: '0124419982',
    icNumber: '890312-14-5522',
    status: 'approved',
    createdAt: '2026-08-10T08:00:00Z',
    password: '1234',
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
    password: '1234',
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
    password: '1234',
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
    password: '1234',
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
    password: '1234',
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
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState<'directory' | 'matchmaker' | 'onboarding' | 'approvals'>('directory');
  const [trainers, setTrainers] = useState<Trainer[]>(INITIAL_TRAINERS);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [bookingTrainer, setBookingTrainer] = useState<Trainer | null>(null);
  const [bookingCourse, setBookingCourse] = useState<CourseOffering | undefined>(undefined);
  const [bookings, setBookings] = useState<BookingRFP[]>([]);
  const [isRfpsDrawerOpen, setIsRfpsDrawerOpen] = useState(false);

  // Centralized Malaysian Training Courses (with trainer submissions and admin approvals)
  const [courses, setCourses] = useState<TrainingCourse[]>(() => {
    try {
      const saved = localStorage.getItem('maslow_courses_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return malaysianTrainingCatalog;
  });

  const [trainerTab, setTrainerTab] = useState<'upload_course' | 'upload_cv' | 'my_courses'>('upload_course');

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

  // Sync courses to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('maslow_courses_catalog', JSON.stringify(courses));
    } catch (e) {}
  }, [courses]);

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

  // Trainer Course Submission & Admin Approval Actions
  const handleTrainerCourseSubmit = (newCourse: TrainingCourse, fileInfo: string) => {
    setCourses((prev) => [newCourse, ...prev]);
    console.log(
      `[Maslow SA Workflow] New training course "${newCourse.title}" (${newCourse.id}) submitted by ${newCourse.leadTrainerName}. Syllabus document attached: ${fileInfo}. Notification email queued for info@maslowsa.com.`
    );
  };

  const handleApproveCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, status: 'approved' } : c))
    );
  };

  const handleRejectCourse = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, status: 'rejected' } : c))
    );
  };

  const handlePasswordReset = (identifier: string, newPassword: string) => {
    const cleanId = identifier.trim().toLowerCase();
    setUsers((prevUsers) => {
      let matched = false;
      const updated = prevUsers.map((user) => {
        const matches =
          user.email.toLowerCase() === cleanId ||
          user.telephone.replace(/[-\s]/g, '') === cleanId.replace(/[-\s]/g, '') ||
          user.id.toLowerCase() === cleanId;

        if (matches) {
          matched = true;
          return {
            ...user,
            password: newPassword,
          };
        }
        return user;
      });

      if (!matched && (cleanId === 'admin' || cleanId === 'trainer' || cleanId === 'client')) {
        const role = cleanId as 'admin' | 'trainer' | 'client';
        return [
          ...updated,
          {
            id: role.toUpperCase(),
            role,
            fullName: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
            email: `${role}@maslowsa.com`,
            telephone: '0120000000',
            icNumber: '000000-00-0000',
            status: 'approved',
            createdAt: new Date().toISOString(),
            password: newPassword,
          },
        ];
      }

      return updated;
    });

    console.log(`Password successfully updated and persisted for identifier: ${identifier}`);
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

  // When inquiring from the Malaysian Courses Catalog
  const handleInquireCourse = (course: TrainingCourse) => {
    const matchingTrainer = trainers.find((t) =>
      t.id === course.assignedTrainerId ||
      (course.assignedTrainerId === '1' && t.id === 'tr-rachel-gomez') ||
      (course.assignedTrainerId === '2' && t.id === 'tr-aiman-zulkifli') ||
      (course.assignedTrainerId === '3' && t.id === 'tr-leon-chen') ||
      (course.assignedTrainerId === '4' && t.id === 'tr-siraj-ashok') ||
      (course.leadTrainerName && t.name.toLowerCase().includes(course.leadTrainerName.toLowerCase())) ||
      t.coursesOffered.some((c) => c.title.toLowerCase().includes(course.title.toLowerCase()))
    ) || trainers[0];

    const courseOffering: CourseOffering = {
      id: course.id,
      title: course.title,
      category: course.category,
      duration: course.duration,
      targetAudience: 'Corporate Teams & Educational Institutions',
      level: 'Intermediate',
      description: course.description,
      keyOutcomes: [
        'Research-backed frameworks and practical execution',
        'Direct alignment with HRD Corp claim guidelines',
        'Post-training capability evaluation & report',
      ],
      claimable: course.hrdClaimable,
    };

    handleOpenBooking(matchingTrainer, courseOffering);
  };

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const pendingCourses = courses.filter((c) => c.status === 'pending');
  const totalPending = pendingUsers.length + pendingCourses.length;

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
        pendingApprovalsCount={totalPending}
        onOpenRfps={() => setIsRfpsDrawerOpen(true)}
        auth={auth}
        onSignOut={handleSignOut}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area based on User Role */}
      <main className="flex-1">
        {/* ============================================================== */}
        {/* TIER 1: TRAINER VIEW (Strictly Locked to Upload Portal)         */}
        {/* Trainers cannot view client search tools, course outlines,    */}
        {/* or pricing in MYR.                                             */}
        {/* ============================================================== */}
        {auth.role === 'trainer' && (
          <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#A14646]" />
                  <h2 className="text-xl font-bold text-slate-900">Certified Trainer Portal</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your certified CV credentials and submit customized Malaysian training courses with proposed MYR pricing for Maslow SA review.
                </p>
              </div>

              <div className="shrink-0">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-50 text-[#DA6556] border border-[#DA6556]/30 shadow-xs">
                  Active Trainer: {auth.userProfile?.fullName || auth.username} ({auth.userProfile?.id || 'TR-PORTAL'})
                </span>
              </div>
            </div>

            {/* Navigation Tabs for Trainer Portal */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
              <button
                type="button"
                onClick={() => setTrainerTab('upload_course')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  trainerTab === 'upload_course'
                    ? 'bg-gradient-to-r from-[#A14646] to-[#DA6556] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit New Training Course</span>
              </button>

              <button
                type="button"
                onClick={() => setTrainerTab('upload_cv')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  trainerTab === 'upload_cv'
                    ? 'bg-[#A14646] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>CV &amp; TTT Credentials</span>
              </button>

              <button
                type="button"
                onClick={() => setTrainerTab('my_courses')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  trainerTab === 'my_courses'
                    ? 'bg-[#A14646] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  My Submitted Courses ({courses.filter(c => c.assignedTrainerId === (auth.userProfile?.id || 'TR-PORTAL') || c.leadTrainerName === (auth.userProfile?.fullName || auth.username)).length})
                </span>
              </button>
            </div>

            {/* Sub-View 1: Course Upload Portal */}
            {trainerTab === 'upload_course' && (
              <TrainerCourseUpload
                trainerName={auth.userProfile?.fullName || auth.username || 'Certified Trainer'}
                trainerId={auth.userProfile?.id || 'TR-PORTAL'}
                onCourseSubmit={handleTrainerCourseSubmit}
              />
            )}

            {/* Sub-View 2: CV & Credentials Upload */}
            {trainerTab === 'upload_cv' && (
              <TrainerUploadPortal
                onProfilePublished={handleProfilePublished}
                onNavigateToDirectory={() => handleSwitchRole('client')}
              />
            )}

            {/* Sub-View 3: My Submitted Courses List */}
            {trainerTab === 'my_courses' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Your Submitted Training Modules</h3>
                    <p className="text-xs text-slate-500">Track curriculum approval status by Maslow SA admin committee.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTrainerTab('upload_course')}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-[#A14646] hover:bg-[#DA6556] rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Submit Another Course
                  </button>
                </div>

                {courses.filter(c => c.assignedTrainerId === (auth.userProfile?.id || 'TR-PORTAL') || c.leadTrainerName === (auth.userProfile?.fullName || auth.username)).length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-700">No courses submitted yet under this trainer profile.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Click &apos;Submit New Training Course&apos; above to upload your outline and syllabus.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {courses
                      .filter(c => c.assignedTrainerId === (auth.userProfile?.id || 'TR-PORTAL') || c.leadTrainerName === (auth.userProfile?.fullName || auth.username))
                      .map((course) => (
                        <div key={course.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{course.title}</span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                (course.status || 'approved') === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : (course.status || 'approved') === 'rejected'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {course.status || 'approved'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              Category: {course.category} • Duration: {course.duration} • Proposed Fee: <strong className="text-[#A14646]">RM {course.priceMYR.toLocaleString()}</strong>
                            </p>
                            {course.syllabusFileName && (
                              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-[#DA6556]" /> Outline Attached: {course.syllabusFileName}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-slate-400 font-mono shrink-0">ID: {course.id}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TIER 2: CLIENT VIEW (Programs Catalog, Directory & Matchmaker) */}
        {/* Course Pricing in MYR is visible to clients                    */}
        {/* ============================================================== */}
        {auth.role === 'client' && (
          <>
            {currentTab === 'directory' && (
              <div className="space-y-8 pb-12">
                <HeroBanner
                  onOpenMatchmaker={() => setCurrentTab('matchmaker')}
                  onOpenTrainerPortal={() => setIsLoginModalOpen(true)}
                  trainerCount={trainers.length}
                />

                {/* Centralized Malaysian Training Catalog with MYR Pricing Security */}
                <div id="course-catalog">
                  <CourseCatalogView
                    showPricing={true}
                    courses={courses.filter((c) => c.status !== 'pending' && c.status !== 'rejected')}
                    trainers={trainers}
                    onSelectTrainer={(t) => setSelectedTrainer(t)}
                    onInquireCourse={handleInquireCourse}
                  />
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <DirectoryView
                    trainers={trainers}
                    onSelectTrainer={(t) => setSelectedTrainer(t)}
                    onRequestBooking={handleOpenBooking}
                    onOpenMatchmaker={() => setCurrentTab('matchmaker')}
                    onOpenTrainerPortal={() => setIsLoginModalOpen(true)}
                  />
                </div>
              </div>
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
        {/* Course Pricing in MYR is visible to admins                     */}
        {/* ============================================================== */}
        {auth.role === 'admin' && (
          <>
            {/* Admin Notification Banner when Pending Requests Exist */}
            {totalPending > 0 && currentTab !== 'approvals' && (
              <div className="bg-amber-500/10 border-b border-amber-500/30 py-3 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-medium">
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>Admin Attention:</strong> You have <strong>{pendingUsers.length}</strong> user registration(s) and <strong>{pendingCourses.length}</strong> trainer course proposal(s) awaiting review &amp; approval.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('approvals')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#A14646] hover:bg-[#DA6556] text-white font-bold text-xs flex items-center gap-1 shadow-xs transition cursor-pointer"
                  >
                    Open Approvals Portal ({totalPending}) <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Tab 1: Directory, Courses Catalog & Popular Trainers */}
            {currentTab === 'directory' && (
              <div className="space-y-8 pb-12">
                <HeroBanner
                  onOpenMatchmaker={() => setCurrentTab('matchmaker')}
                  onOpenTrainerPortal={() => setCurrentTab('onboarding')}
                  trainerCount={trainers.length}
                />

                {/* Centralized Malaysian Training Catalog with MYR Pricing Security */}
                <div id="course-catalog">
                  <CourseCatalogView
                    showPricing={true}
                    courses={courses}
                    trainers={trainers}
                    onSelectTrainer={(t) => setSelectedTrainer(t)}
                    onInquireCourse={handleInquireCourse}
                  />
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <DirectoryView
                    trainers={trainers}
                    onSelectTrainer={(t) => setSelectedTrainer(t)}
                    onRequestBooking={handleOpenBooking}
                    onOpenMatchmaker={() => setCurrentTab('matchmaker')}
                    onOpenTrainerPortal={() => setCurrentTab('onboarding')}
                  />
                </div>
              </div>
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
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <TrainerUploadPortal
                  onProfilePublished={handleProfilePublished}
                  onNavigateToDirectory={() => setCurrentTab('directory')}
                />
              </div>
            )}

            {/* Tab 4: Admin Approval Portal */}
            {currentTab === 'approvals' && (
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminApprovalView
                  pendingUsers={pendingUsers}
                  allUsers={users}
                  onApproveUser={handleApproveUser}
                  onRejectUser={handleRejectUser}
                  pendingCourses={pendingCourses}
                  allCourses={courses}
                  onApproveCourse={handleApproveCourse}
                  onRejectCourse={handleRejectCourse}
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

      {/* Authentication Modal (Sign Up first, then Sign In) */}
      <AuthModal
        isOpen={!auth.isAuthenticated || isLoginModalOpen}
        existingUsers={users}
        onRegisterSubmit={handleRegisterSubmit}
        onLogin={handleLogin}
        onClose={() => setIsLoginModalOpen(false)}
        canClose={auth.isAuthenticated}
        onOpenForgotPassword={() => {
          setIsLoginModalOpen(false);
          setIsForgotPasswordOpen(true);
        }}
      />

      {/* Forgot Password & Reset Modal */}
      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          users={users}
          onPasswordReset={handlePasswordReset}
          onClose={() => {
            setIsForgotPasswordOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      )}

      {/* Platform 3-Column Sunset Footer */}
      <Footer />
    </div>
  );
}
