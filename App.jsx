import React, { useState } from 'react';
import { ElectionProvider } from './services/ElectionContext.jsx';
import AcademicDisclaimerBanner from './components/AcademicDisclaimerBanner.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import VoterVerificationPage from './pages/VoterVerificationPage.jsx';
import CandidateSelectionPage from './pages/CandidateSelectionPage.jsx';
import VoteConfirmationPage from './pages/VoteConfirmationPage.jsx';
import VoteSuccessPage from './pages/VoteSuccessPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

/**
 * Main Application Component for "ONLINE VOTING SYSTEM – Using Aadhaar-Style OTP Verification"
 *
 * Workflow:
 * 1. Home / Overview
 * 2. Voter Details & Aadhaar-Style OTP Verification (verify)
 * 3. Candidate Selection (candidates)
 * 4. Vote Confirmation & Sealing (confirm)
 * 5. Vote Submitted & Cryptographic Receipt (success)
 * 6. Live Results Tally (results)
 * 7. Admin Dashboard & Electoral Roll Management (admin)
 */
function VotingApp() {
  // Navigation state: 'home' | 'verify' | 'candidates' | 'confirm' | 'success' | 'results' | 'admin'
  const [activePage, setActivePage] = useState('home');
  // Temporary ballot holding state before final confirmation
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Workflow progress indicator helper
  const isVotingFlow = ['verify', 'candidates', 'confirm', 'success'].includes(activePage);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. Academic Disclaimer Notice */}
      <AcademicDisclaimerBanner />

      {/* 2. Top Navigation Bar (Strict 3-zone contract) */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* 3. Academic Workflow Progress Ribbon (Active during voting cycle) */}
      {isVotingFlow && (
        <aside aria-label="Electoral Voting Stage Progress" className="bg-white border-b border-slate-200 py-2.5 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs font-medium text-slate-500 overflow-x-auto gap-2">
            
            <div className={`flex items-center gap-1.5 shrink-0 ${activePage === 'verify' ? 'text-blue-600 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activePage === 'verify' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                1
              </span>
              <span>1. Voter Identity</span>
            </div>

            <span className="text-slate-300" aria-hidden="true">&rarr;</span>

            <div className={`flex items-center gap-1.5 shrink-0 ${activePage === 'verify' ? 'text-blue-600 font-bold' : ''}`}>
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">
                2
              </span>
              <span>2. Aadhaar OTP</span>
            </div>

            <span className="text-slate-300" aria-hidden="true">&rarr;</span>

            <div className={`flex items-center gap-1.5 shrink-0 ${activePage === 'candidates' ? 'text-blue-600 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activePage === 'candidates' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                3
              </span>
              <span>3. Candidate Selection</span>
            </div>

            <span className="text-slate-300" aria-hidden="true">&rarr;</span>

            <div className={`flex items-center gap-1.5 shrink-0 ${activePage === 'confirm' ? 'text-blue-600 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activePage === 'confirm' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                4
              </span>
              <span>4. Confirmation</span>
            </div>

            <span className="text-slate-300" aria-hidden="true">&rarr;</span>

            <div className={`flex items-center gap-1.5 shrink-0 ${activePage === 'success' ? 'text-emerald-600 font-bold' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${activePage === 'success' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                5
              </span>
              <span>5. Vote Sealed</span>
            </div>

          </div>
        </aside>
      )}

      {/* 4. Active Page Content Body */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage setActivePage={setActivePage} />
        )}

        {activePage === 'verify' && (
          <VoterVerificationPage setActivePage={setActivePage} />
        )}

        {activePage === 'candidates' && (
          <CandidateSelectionPage 
            selectedCandidate={selectedCandidate}
            setSelectedCandidate={setSelectedCandidate}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'confirm' && (
          <VoteConfirmationPage 
            selectedCandidate={selectedCandidate}
            setSelectedCandidate={setSelectedCandidate}
            setActivePage={setActivePage}
          />
        )}

        {activePage === 'success' && (
          <VoteSuccessPage setActivePage={setActivePage} />
        )}

        {activePage === 'results' && (
          <ResultsPage setActivePage={setActivePage} />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage />
        )}
      </main>

      {/* 5. Institutional Academic Footer */}
      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <ElectionProvider>
      <VotingApp />
    </ElectionProvider>
  );
}
