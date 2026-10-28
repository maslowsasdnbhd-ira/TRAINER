export interface Certification {
  id?: string;
  title: string;
  issuer: string;
  credentialId?: string;
  issueDate?: string;
  validUntil?: string;
  verified: boolean;
  verificationNotes?: string;
  badgeLevel?: 'Master Trainer' | 'Senior Certified' | 'Certified Trainer' | 'Accredited Lead';
  documentUrl?: string;
}

export interface CourseOffering {
  id: string;
  title: string;
  category: string;
  duration: string; // e.g. "2 Days (14 Hours)"
  targetAudience: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Executive';
  description: string;
  keyOutcomes: string[];
  claimable?: boolean; // e.g. HRD Corp Claimable
}

export interface Trainer {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  languages: string[];
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  dailyRateUSD: number;
  certifications: Certification[];
  expertiseAreas: string[];
  coursesOffered: CourseOffering[];
  deliveryModes: ('In-Person' | 'Virtual' | 'Hybrid')[];
  featured?: boolean;
  verificationAuditDate?: string;
  rawCvText?: string;
  matchScore?: number;
  matchReasoning?: string;
}

export interface ParseDocumentRequest {
  cvText?: string;
  cvFile?: {
    name: string;
    mimeType: string;
    data: string; // Base64
  };
  certFile?: {
    name: string;
    mimeType: string;
    data: string; // Base64
  };
}

export interface ExtractedTrainerData {
  trainer_name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  bio: string;
  years_experience: number;
  languages: string[];
  daily_rate_usd: number;
  certifications: {
    title: string;
    issuer: string;
    credential_id: string;
    valid_until: string;
    verified: boolean;
    verification_notes: string;
    badge_level?: string;
  }[];
  expertise_areas: string[];
  courses_offered: {
    title: string;
    category: string;
    duration: string;
    target_audience: string;
    level: string;
    description: string;
    key_outcomes: string[];
    claimable: boolean;
  }[];
  confidence_score: number;
  parsing_notes?: string;
}

export interface MatchTrainersRequest {
  query: string;
  trainers?: Trainer[];
}

export interface TrainerMatchResult {
  trainerId: string;
  matchScore: number;
  matchReasoning: string;
  highlightedSkills: string[];
  recommendedCourseTitle: string;
  suggestedDuration: string;
}

export interface MatchTrainersResponse {
  analysis: {
    interpretedGoal: string;
    targetAudienceIdentified: string;
    skillsRequired: string[];
    suggestedFormat: string;
  };
  matches: TrainerMatchResult[];
}

export interface BookingRFP {
  id: string;
  trainerId: string;
  trainerName: string;
  clientName: string;
  organization: string;
  clientEmail: string;
  courseTitle: string;
  tentativeDate: string;
  deliveryMode: 'In-Person' | 'Virtual' | 'Hybrid';
  participantsCount: number;
  specialRequirements: string;
  estimatedBudget: number;
  status: 'Pending Review' | 'Trainer Contacted' | 'Quotation Sent';
  createdAt: string;
}
