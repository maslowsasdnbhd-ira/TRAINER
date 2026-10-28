export interface TrainingCourse {
  id: string;
  title: string;
  category: 'Public Training' | 'Team Building' | 'In-House Training';
  description: string;
  duration: string;
  priceMYR: number;
  hrdClaimable: boolean;
  assignedTrainerId: string; // Links course to the expert trainer ID ('1', '2', '3', or trainer slug)
  leadTrainerName?: string;
  leadTrainerRole?: string;
  leadTrainerAvatar?: string;
}

export const malaysianTrainingCatalog: TrainingCourse[] = [
  // Public Training Courses
  {
    id: 'PUB-01',
    title: 'Introduction to AI Tools for Small Business Owners & Working Adults',
    category: 'Public Training',
    description: 'Master generative AI, workflow automation, and productivity tools to scale business operations efficiently.',
    duration: '2 Days',
    priceMYR: 1500,
    hrdClaimable: true,
    assignedTrainerId: '3', // Leon Chen, MBA
    leadTrainerName: 'Leon Chen, MBA',
    leadTrainerRole: 'AI for Business & SME Digital Transformation',
    leadTrainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'PUB-02',
    title: 'Nurturing a Growth Mindset in Educational & Professional Environments',
    category: 'Public Training',
    description: 'Develop resilience, overcome fixed mindsets, and foster a high-performance culture across diverse teams.',
    duration: '1 Day',
    priceMYR: 900,
    hrdClaimable: true,
    assignedTrainerId: '1', // Dr. Rachel Gomez, M.Ed.
    leadTrainerName: 'Dr. Rachel Gomez, M.Ed.',
    leadTrainerRole: 'Senior Educational Consultant & Growth Mindset Specialist',
    leadTrainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'PUB-03',
    title: 'First Aid & CPR Certification for International Schools and Corporate Staff',
    category: 'Public Training',
    description: 'Comprehensive emergency medical response training aligned with Malaysian occupational safety standards.',
    duration: '2 Days',
    priceMYR: 1200,
    hrdClaimable: true,
    assignedTrainerId: '2', // Dr. Aiman Zulkifli, MD, OHN
    leadTrainerName: 'Dr. Aiman Zulkifli, MD, OHN',
    leadTrainerRole: 'Certified Medical First Responder & Occupational Health Specialist',
    leadTrainerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },

  // Team Building Programs
  {
    id: 'TB-01',
    title: 'High-Performance Synergy & Leadership Team Building Retreat',
    category: 'Team Building',
    description: 'Outdoor and indoor experiential modules designed to strengthen trust, communication, and departmental collaboration.',
    duration: '2 Days / 1 Night',
    priceMYR: 8500,
    hrdClaimable: true,
    assignedTrainerId: '4', // Datuk Dr. Siraj Khan & S. Ashok
    leadTrainerName: 'Datuk Dr. Siraj Khan & S. Ashok',
    leadTrainerRole: 'Strategic Workforce Intelligence & Capability Architecture',
    leadTrainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'TB-02',
    title: 'Cross-Cultural Communication & Creative Problem Solving Challenge',
    category: 'Team Building',
    description: 'Engaging obstacle and strategy-based team workshops tailored for diverse Malaysian corporate workforces.',
    duration: '1 Day',
    priceMYR: 4500,
    hrdClaimable: true,
    assignedTrainerId: '1', // Dr. Rachel Gomez, M.Ed.
    leadTrainerName: 'Dr. Rachel Gomez, M.Ed.',
    leadTrainerRole: 'Senior Educational Consultant & Growth Mindset Specialist',
    leadTrainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },

  // In-House Training Programs
  {
    id: 'IH-01',
    title: 'Advanced Corporate Governance, Risk & Compliance (GRC)',
    category: 'In-House Training',
    description: 'Customized in-house training for board members, executives, and internal auditors on Malaysian regulatory frameworks.',
    duration: '3 Days',
    priceMYR: 12000,
    hrdClaimable: true,
    assignedTrainerId: '4', // Datuk Dr. Siraj Khan & S. Ashok
    leadTrainerName: 'Datuk Dr. Siraj Khan & S. Ashok',
    leadTrainerRole: 'Executive Director, L&D | Strategic Workforce Intelligence',
    leadTrainerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'IH-02',
    title: 'Managing Learning Delays & Behavioral Support in Classrooms',
    category: 'In-House Training',
    description: 'Specialized educator training for international and private schools focusing on ADHD, autism, and behavioral intervention.',
    duration: '2 Days',
    priceMYR: 6000,
    hrdClaimable: true,
    assignedTrainerId: '1', // Dr. Rachel Gomez, M.Ed.
    leadTrainerName: 'Dr. Rachel Gomez, M.Ed.',
    leadTrainerRole: 'Senior Educational Consultant & Growth Mindset Specialist',
    leadTrainerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'IH-03',
    title: 'Adult Mental Health & Occupational Health Strategies',
    category: 'In-House Training',
    description: 'Medical doctor-led corporate mental health early intervention, panic response, and employee wellbeing protocols for corporate plants.',
    duration: '2 Days',
    priceMYR: 7500,
    hrdClaimable: true,
    assignedTrainerId: '2', // Dr. Aiman Zulkifli, MD, OHN
    leadTrainerName: 'Dr. Aiman Zulkifli, MD, OHN',
    leadTrainerRole: 'Certified Medical First Responder & Occupational Health Specialist',
    leadTrainerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'IH-04',
    title: 'Workflow Automation & Digital Data Insights',
    category: 'In-House Training',
    description: 'Master practical automated business pipelines, AI marketing assistants, and spreadsheet intelligence for corporate departments.',
    duration: '2 Days',
    priceMYR: 9500,
    hrdClaimable: true,
    assignedTrainerId: '3', // Leon Chen, MBA
    leadTrainerName: 'Leon Chen, MBA',
    leadTrainerRole: 'AI for Business & SME Digital Transformation',
    leadTrainerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  },
];
