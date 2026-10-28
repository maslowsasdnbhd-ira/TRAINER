export interface SampleDocumentPreset {
  id: string;
  name: string;
  title: string;
  category: string;
  cvFileName: string;
  certFileName: string;
  cvText: string;
  certSvgDataUri: string;
  expectedName: string;
  expectedCertIssuer: string;
  expectedCredentialId: string;
  description: string;
}

// Generate realistic certificate SVG data URIs
function createCertificateSvg(name: string, title: string, issuer: string, credentialId: string, date: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="900" height="600">
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#b45309" />
        <stop offset="50%" stop-color="#f59e0b" />
        <stop offset="100%" stop-color="#d97706" />
      </linearGradient>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#f8fafc" />
      </linearGradient>
    </defs>
    
    <!-- Background Frame -->
    <rect width="900" height="600" fill="url(#bgGrad)" />
    <rect x="25" y="25" width="850" height="550" fill="none" stroke="#e2e8f0" stroke-width="2" />
    <rect x="35" y="35" width="830" height="530" fill="none" stroke="url(#goldGrad)" stroke-width="4" />
    <rect x="42" y="42" width="816" height="516" fill="none" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,4" />

    <!-- Corner Accents -->
    <path d="M 45 65 L 65 45 L 90 45 L 45 90 Z" fill="#d97706" opacity="0.6" />
    <path d="M 855 65 L 835 45 L 810 45 L 855 90 Z" fill="#d97706" opacity="0.6" />
    <path d="M 45 535 L 65 555 L 90 555 L 45 510 Z" fill="#d97706" opacity="0.6" />
    <path d="M 855 535 L 835 555 L 810 555 L 855 510 Z" fill="#d97706" opacity="0.6" />

    <!-- Header / Issuer -->
    <text x="450" y="110" font-family="'Times New Roman', serif" font-size="20" font-weight="bold" fill="#0f172a" text-anchor="middle" letter-spacing="4">
      ${issuer.toUpperCase()}
    </text>
    <text x="450" y="135" font-family="sans-serif" font-size="12" fill="#64748b" text-anchor="middle" letter-spacing="2">
      OFFICIAL ACCREDITATION &amp; CERTIFICATION BOARD
    </text>

    <!-- Certificate Title -->
    <text x="450" y="195" font-family="'Times New Roman', serif" font-size="36" font-style="italic" fill="#0f172a" text-anchor="middle">
      Certificate of Accreditation
    </text>
    <text x="450" y="235" font-family="sans-serif" font-size="13" fill="#475569" text-anchor="middle">
      THIS IS TO CERTIFY THAT
    </text>

    <!-- Recipient Name -->
    <text x="450" y="285" font-family="'Times New Roman', serif" font-size="34" font-weight="bold" fill="#1e3a8a" text-anchor="middle">
      ${name}
    </text>
    <line x1="240" y1="300" x2="660" y2="300" stroke="#d97706" stroke-width="2" />

    <!-- Certification Award -->
    <text x="450" y="340" font-family="sans-serif" font-size="14" fill="#334155" text-anchor="middle">
      HAS SUCCESSFULLY SATISFIED ALL RIGOROUS COMPETENCY &amp; FACILITATION STANDARDS AS A
    </text>
    <text x="450" y="375" font-family="sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">
      ${title}
    </text>

    <!-- Seal and Details -->
    <circle cx="200" cy="460" r="45" fill="#fef3c7" stroke="#d97706" stroke-width="3" />
    <polygon points="200,430 205,445 220,445 208,455 212,470 200,460 188,470 192,455 180,445 195,445" fill="#d97706" />
    <text x="200" y="495" font-family="sans-serif" font-size="8" font-weight="bold" fill="#92400e" text-anchor="middle">VERIFIED TTT</text>

    <!-- Credential Info -->
    <text x="450" y="445" font-family="sans-serif" font-size="12" fill="#475569" text-anchor="middle">
      Credential Identification: <tspan font-weight="bold" fill="#0f172a">${credentialId}</tspan>
    </text>
    <text x="450" y="470" font-family="sans-serif" font-size="12" fill="#475569" text-anchor="middle">
      Date of Issuance: <tspan font-weight="bold" fill="#0f172a">${date}</tspan> | Status: <tspan fill="#16a34a" font-weight="bold">ACTIVE &amp; VERIFIED</tspan>
    </text>

    <!-- Signatures -->
    <line x1="620" y1="480" x2="780" y2="480" stroke="#94a3b8" stroke-width="1.5" />
    <text x="700" y="500" font-family="sans-serif" font-size="11" font-weight="bold" fill="#334155" text-anchor="middle">Director of Certification</text>
    <text x="700" y="515" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">HRD Corp / Global Board</text>
  </svg>`;

  const base64 = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${base64}`;
}

export const SAMPLE_DOCUMENTS: SampleDocumentPreset[] = [
  {
    id: 'sample-aris',
    name: 'Dr. Aris Thorne',
    title: 'Certified Master AI & Data Literacy Trainer',
    category: 'AI & Data Science',
    cvFileName: 'CV_Dr_Aris_Thorne_2026.pdf',
    certFileName: 'HRDCorp_TTT_MasterTrainer_ArisThorne.png',
    expectedName: 'Dr. Aris Thorne',
    expectedCertIssuer: 'HRD Corp (Human Resource Development Corporation)',
    expectedCredentialId: 'HRDC-TTT-MY-88219',
    description: '14 years expertise in Python, Generative AI models, and enterprise data analytics training with HRD Corp Master Trainer status.',
    certSvgDataUri: createCertificateSvg(
      'Dr. Aris Thorne, PhD',
      'HRD Corp Certified Master Trainer (TTT)',
      'Human Resource Development Corporation (HRD Corp)',
      'HRDC-TTT-MY-88219',
      '15 March 2021 (Valid to March 2029)'
    ),
    cvText: `CURRICULUM VITAE - DR. ARIS THORNE, PhD
Email: aris.thorne.training@example.com | Phone: +60 13-982 7701
Location: Kuala Lumpur, Malaysia (Open to APAC and Virtual delivery)
Languages: English (Fluent), Bahasa Malaysia (Fluent)

PROFESSIONAL SUMMARY:
Accomplished corporate instructor, AI researcher, and HRD Corp Accredited Master Trainer with 14 years of experience training Fortune 500 corporations, government agencies, and banking institutions. Specializes in demystifying machine learning, generative AI workflow automation, and Python-driven business intelligence for non-technical leadership and corporate staff. Conducted over 320 corporate masterclasses with an average participant satisfaction rate of 98.7%.

CERTIFICATIONS & ACCREDITATIONS:
1. HRD Corp Certified Master Trainer (TTT) - Credential ID: HRDC-TTT-MY-88219 (Issued: March 2021, Valid through: March 2029) - Verified Status: Active & HRD Corp Claimable.
2. AWS Certified Machine Learning - Specialty (MLS-C01) - Credential ID: AWS-MLS-90032 (Issued: 2022, Valid through: 2027).
3. International Coaching Federation (ICF) Associate Certified Coach (ACC).

CORE COMPETENCIES & EXPERTISE:
- Generative AI & Prompt Engineering for Corporate Teams
- Python for Business Intelligence & Automation
- Enterprise AI Governance, Ethics & Data Privacy
- Predictive Analytics with Scikit-Learn and Pandas
- Executive AI Roadmapping & Tech Literacy

SIGNATURE TRAINING PROGRAMS OFFERED:
1. "Generative AI in the Workplace: Automation for Managers" (2 Days / 14 Hours)
   - Target Audience: Department heads, project leads, marketing & finance directors
   - Outcomes: Master prompt patterns, automate document reviews, eliminate 12+ manual hours weekly. HRD Corp Claimable.
2. "Python for Business Analysts: Zero to Data-Driven" (3 Days / 21 Hours)
   - Target Audience: Analysts, accountants, operations specialists
   - Outcomes: Write clean Python scripts, manipulate multi-million row datasets with Pandas, build automated PDF/Excel reports.

PROFESSIONAL EXPERIENCE:
- Principal AI Corporate Trainer | Apex Analytics Training (2018 - Present)
  Trained 4,500+ professionals across ASEAN region.
- Senior Lecturer & Data Science Lead | Asia Pacific Institute of Technology (2012 - 2018)
- Data Scientist & Consultant | Global Analytics Partners (2010 - 2012)

EDUCATION:
- Ph.D. in Computer Science (Artificial Intelligence) - Universiti Malaya
- B.Sc. (Hons) in Software Engineering - National University of Singapore

FEES & AVAILABILITY:
- Daily Corporate Training Rate: USD $1,750 (RM 7,800/day)
- Delivery formats: In-Person, Hybrid, Virtual live interactive`,
  },
  {
    id: 'sample-meiling',
    name: 'Mei Ling Tan, CFA',
    title: 'Corporate Financial Modeling & Power BI TTT Specialist',
    category: 'Financial Literacy',
    cvFileName: 'CV_MeiLing_Tan_CFA_Trainer.pdf',
    certFileName: 'TTT_Certification_MeiLingTan_Cambridge.png',
    expectedName: 'Mei Ling Tan, CFA',
    expectedCertIssuer: 'Cambridge International Training & HRD Corp',
    expectedCredentialId: 'CAMB-TTT-2022-771',
    description: '10 years experience in corporate valuation, M&A financial models, and automated executive Power BI dashboards.',
    certSvgDataUri: createCertificateSvg(
      'Mei Ling Tan, CFA',
      'Train-the-Trainer (TTT) Certified Professional',
      'Cambridge International Training Board',
      'CAMB-TTT-2022-771',
      '10 August 2022 (Valid to August 2028)'
    ),
    cvText: `CURRICULUM VITAE - MEI LING TAN, CFA
Email: meiling.tan.finance@example.com | Phone: +65 8920 1198
Location: Singapore & Kuala Lumpur (Travels globally)
Languages: English (Native), Mandarin (Fluent), Cantonese

EXECUTIVE SUMMARY:
Chartered Financial Analyst (CFA) and certified corporate trainer with 10 years of experience in investment banking, financial analysis, and corporate modeling. Has delivered over 200 workshops on building dynamic DCF and LBO financial models, financial statement forensic analysis, and creating real-time Power BI executive financial cockpits for CFOs and commercial controllers.

CERTIFICATIONS & CREDENTIALS:
1. Certified Train-the-Trainer (TTT) - Cambridge International Training Board (Credential: CAMB-TTT-2022-771, Valid: 2022-2028)
2. HRD Corp Certified Trainer (Credential: HRDC-MY-55019, Valid: Active)
3. CFA Charterholder - CFA Institute (Charter No: 182901)
4. Microsoft Certified: Power BI Data Analyst Associate (PL-300)

CORE TOPICS & EXPERTISE:
- Advanced Corporate Financial Modeling (Three-Statement, DCF, LBO)
- Power BI for CFOs & Financial FP&A Teams
- Strategic Cost Management & Capital Budgeting
- Financial Literacy for Non-Financial Managers
- Commercial Contract Financial Assessment

COURSES OFFERED:
1. "Advanced Financial Modeling & Forecasting in Excel" (2 Days / 14 Hours)
   - Focus: Error-free circular debt schedules, scenario managers, sensitivity analysis.
2. "Power BI Financial Dashboard Bootcamp" (2 Days / 14 Hours)
   - Focus: DAX formulas for variance analysis, ERP ledger ingestion, executive KPI cards.

DAILY TRAINING RATE:
- USD $1,600 / day (In-person & Virtual options available)`,
  },
  {
    id: 'sample-jonathan',
    name: 'Jonathan Reynolds, MBA',
    title: 'Six Sigma Black Belt & Agile Scrum TTT Master Facilitator',
    category: 'Quality & Six Sigma',
    cvFileName: 'Jonathan_Reynolds_Agile_SixSigma_CV.pdf',
    certFileName: 'IASSC_SixSigma_TTT_Reynolds.png',
    expectedName: 'Jonathan Reynolds',
    expectedCertIssuer: 'International Association for Six Sigma Certification (IASSC)',
    expectedCredentialId: 'IASSC-BB-TTT-49102',
    description: '15 years transforming factory operations, sprint delivery, and reducing supply chain waste with certified Black Belt TTT status.',
    certSvgDataUri: createCertificateSvg(
      'Jonathan Reynolds, MBA, PMP',
      'Certified Six Sigma Black Belt & TTT Facilitator',
      'International Association for Six Sigma Certification (IASSC)',
      'IASSC-BB-TTT-49102',
      '04 January 2020 (Valid to January 2028)'
    ),
    cvText: `RESUME - JONATHAN REYNOLDS, PMP, LSSBB
Email: j.reynolds.operations@example.com | Phone: +1 (312) 555-0182
Location: Chicago, USA & Regional Delivery (Remote / APAC Available)
Languages: English (Native)

SUMMARY:
Results-driven Lean Six Sigma Black Belt and certified Agile coach with 15 years leading end-to-end supply chain transformations, continuous improvement kaizens, and high-velocity Scrum team coaching. Instructed over 2,200 professionals in manufacturing, aerospace, and logistics.

CERTIFICATIONS:
1. IASSC Certified Lean Six Sigma Black Belt (LSSBB) & TTT Facilitator (Credential: IASSC-BB-TTT-49102)
2. Certified ScrumMaster (CSM) & Certified Scrum Product Owner (CSPO) - Scrum Alliance
3. Project Management Professional (PMP) - Project Management Institute

EXPERTISE:
- DMAIC Problem Solving & Statistical Quality Control
- Lean Waste Identification (7 Wastes / TIMWOOD)
- Value Stream Mapping (VSM) & 5S Implementation
- Agile Scrum & Kanban for Operations

COURSES OFFERED:
1. "Lean Six Sigma Yellow & Green Belt Accelerated Track" (4 Days / 28 Hours)
2. "Operational Excellence: Kaizen Sprints and Waste Elimination" (2 Days / 14 Hours)

RATE:
- USD $1,900 / day`,
  },
];
