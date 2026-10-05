/**
 * Sample Demo Data for Academic Demonstration
 * ONLINE VOTING SYSTEM – Using Aadhaar-Style OTP Verification
 *
 * NOTE: All data is fictional demo information for academic evaluation.
 * No real Aadhaar numbers, personal phone numbers, or passwords are used or stored.
 */

export const INITIAL_CANDIDATES = [
  {
    id: 'cand-01',
    name: 'Dr. Rajeshwar Rao',
    party: 'National Progress Alliance',
    symbolName: 'Rising Sun',
    symbolIcon: 'sun',
    color: '#D97706', // amber-600
    education: 'Ph.D. in Public Administration',
    agenda: 'Sustainable rural digital infrastructure, transparent governance, and clean energy expansion.',
    votes: 48,
    active: true,
  },
  {
    id: 'cand-02',
    name: 'Smt. Ananya Deshmukh',
    party: 'Democratic Peoples Coalition',
    symbolName: 'Scales of Justice',
    symbolIcon: 'scale',
    color: '#2563EB', // blue-600
    education: 'M.S. in Environmental Policy',
    agenda: 'Universal primary healthcare coverage, youth technical skill institutes, and judicial modernization.',
    votes: 62,
    active: true,
  },
  {
    id: 'cand-03',
    name: 'Prof. Vikramaditya Sengupta',
    party: 'Youth & Education Front',
    symbolName: 'Open Book',
    symbolIcon: 'book-open',
    color: '#059669', // emerald-600
    education: 'M.Tech, IIT Madras',
    agenda: 'Public research grants, affordable student housing, and rural STEM mentorship programs.',
    votes: 39,
    active: true,
  },
  {
    id: 'cand-04',
    name: 'Kumari Meenakshi Sundaram',
    party: 'Green Agro Collective',
    symbolName: 'Banyan Tree',
    symbolIcon: 'trees',
    color: '#15803D', // green-700
    education: 'B.Sc. Agriculture, MBA',
    agenda: 'Direct farmer fair-price subsidies, decentralized micro-cold chains, and organic soil regeneration.',
    votes: 27,
    active: true,
  },
  {
    id: 'cand-05',
    name: 'NOTA (None of the Above)',
    party: 'Independent Choice Option',
    symbolName: 'Ballot Stamp',
    symbolIcon: 'vote',
    color: '#475569', // slate-600
    education: 'Statutory Electoral Option',
    agenda: 'Official constitutional provision allowing voters to reject all presented candidates.',
    votes: 6,
    active: true,
  },
];

export const INITIAL_SAMPLE_VOTERS = [
  {
    id: 'vtr-1',
    voterId: 'VTR-2026-9041',
    maskedAadhaar: 'XXXX-XXXX-8421',
    maskedMobile: '+91 ••••• •4321',
    fullName: 'Arun K. Sharma (Demo)',
    constituency: 'Ward 14 - Academic Tech Hub',
    status: 'ELIGIBLE', // 'ELIGIBLE' | 'VOTED'
    demoPhoneSuffix: '4321',
  },
  {
    id: 'vtr-2',
    voterId: 'VTR-2026-9042',
    maskedAadhaar: 'XXXX-XXXX-1930',
    maskedMobile: '+91 ••••• •7890',
    fullName: 'Priya R. Patel (Demo)',
    constituency: 'Ward 14 - Academic Tech Hub',
    status: 'ELIGIBLE',
    demoPhoneSuffix: '7890',
  },
  {
    id: 'vtr-3',
    voterId: 'VTR-2026-9043',
    maskedAadhaar: 'XXXX-XXXX-5512',
    maskedMobile: '+91 ••••• •2210',
    fullName: 'Mohammed Farhan (Demo)',
    constituency: 'Ward 14 - Academic Tech Hub',
    status: 'VOTED',
    demoPhoneSuffix: '2210',
  },
  {
    id: 'vtr-4',
    voterId: 'VTR-2026-9044',
    maskedAadhaar: 'XXXX-XXXX-6789',
    maskedMobile: '+91 ••••• •9901',
    fullName: 'Sunita Devi (Demo)',
    constituency: 'Ward 14 - Academic Tech Hub',
    status: 'ELIGIBLE',
    demoPhoneSuffix: '9901',
  },
  {
    id: 'vtr-5',
    voterId: 'VTR-2026-9045',
    maskedAadhaar: 'XXXX-XXXX-3344',
    maskedMobile: '+91 ••••• •5566',
    fullName: 'Karthik Subramanian (Demo)',
    constituency: 'Ward 14 - Academic Tech Hub',
    status: 'ELIGIBLE',
    demoPhoneSuffix: '5566',
  },
];

export const INITIAL_ELECTION_SETTINGS = {
  title: 'Academic Council General Election 2026',
  constituency: 'Assembly Constituency #04 – Metro Central',
  status: 'ACTIVE', // 'ACTIVE' | 'PAUSED' | 'CONCLUDED'
  startTime: '2026-10-02 08:00:00 IST',
  endTime: '2026-10-02 18:00:00 IST',
  requiresOtpVerification: true,
  otpExpirySeconds: 60,
};

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-001',
    timestamp: '2026-10-02 08:14:22',
    action: 'POLL_OPENED',
    detail: 'Election initialized and verification service status verified online.',
  },
  {
    id: 'log-002',
    timestamp: '2026-10-02 08:29:45',
    action: 'OTP_DISPATCHED',
    detail: 'Simulated Aadhaar-style OTP sent to registered terminal (+91 ••••• •2210).',
  },
  {
    id: 'log-003',
    timestamp: '2026-10-02 08:31:10',
    action: 'VOTE_SEALED',
    detail: 'Encrypted ballot token generated for constituency #04. Voter marked status: VOTED.',
  },
];
