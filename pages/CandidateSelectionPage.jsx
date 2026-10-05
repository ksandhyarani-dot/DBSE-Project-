import React, { useState } from 'react';
import { useElection } from '../services/ElectionContext.jsx';
import CandidateSymbolIcon from '../components/CandidateSymbolIcon.jsx';
import { 
  Vote, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Info,
  UserCheck
} from 'lucide-react';

export default function CandidateSelectionPage({ 
  selectedCandidate, 
  setSelectedCandidate, 
  setActivePage 
}) {
  const { candidates, currentVoter, electionSettings } = useElection();
  const [warningMessage, setWarningMessage] = useState('');

  // Enforce verified status
  if (!currentVoter || !currentVoter.isOtpVerified) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Voter Authentication Required
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You must verify your identity through the Aadhaar-Style OTP verification process before accessing the official electronic ballot.
        </p>
        <button
          onClick={() => setActivePage('verify')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Go to Voter Verification
        </button>
      </div>
    );
  }

  // If already voted
  if (currentVoter.status === 'VOTED') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-600 mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Ballot Already Cast
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Our records show that a ballot has already been cast for this voter ID. Re-voting or changing votes is strictly disabled to preserve electoral integrity.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActivePage('results')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            View Live Results
          </button>
        </div>
      </div>
    );
  }

  // Handle single candidate selection
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setWarningMessage('');
  };

  const handleProceedToConfirmation = () => {
    if (!selectedCandidate) {
      setWarningMessage('Please select one candidate to cast your vote.');
      return;
    }
    setActivePage('confirm');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Session Header Status */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                {currentVoter.fullName}
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                OTP Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono-numbers">
              Electoral ID: {currentVoter.voterId} · {electionSettings.constituency}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 block">Single-Choice Electronic Ballot</span>
          <span className="text-xs font-semibold text-blue-700">Strict 1 Vote Limit</span>
        </div>
      </div>

      {/* Page Title & Instructions */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Select Your Candidate
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Review the contesting candidates below and click anywhere on a card to select. Only one selection is permitted.
        </p>
      </div>

      {warningMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {candidates.map((cand) => {
          const isSelected = selectedCandidate?.id === cand.id;

          return (
            <div
              key={cand.id}
              onClick={() => handleSelectCandidate(cand)}
              className={`relative rounded-xl p-5 border transition-all cursor-pointer select-none text-left flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
              }`}
            >
              <div className="space-y-3">
                
                {/* Header row: Party Symbol & Radio Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center border shadow-xs"
                      style={{ 
                        backgroundColor: isSelected ? '#EFF6FF' : '#F8FAFC',
                        borderColor: isSelected ? cand.color : '#E2E8F0',
                        color: cand.color 
                      }}
                    >
                      <CandidateSymbolIcon name={cand.symbolIcon} className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Party Symbol: {cand.symbolName}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {cand.name}
                      </h3>
                    </div>
                  </div>

                  {/* Radio Button Indicator */}
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Candidate Details */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-xs font-semibold text-blue-700">
                    {cand.party}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono-numbers">
                    Qualification: {cand.education}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {cand.agenda}
                  </p>
                </div>

              </div>

              {/* Card Footer Selection state */}
              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {cand.id === 'cand-05' ? 'Constitutional Option' : 'Registered Contender'}
                </span>
                <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                  {isSelected ? '✓ Selected' : 'Click to Select'}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-4 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div>
          {selectedCandidate ? (
            <div className="text-xs">
              <span className="text-slate-500">Currently Selected: </span>
              <strong className="text-slate-900 font-semibold">{selectedCandidate.name}</strong>
              <span className="text-slate-400 font-normal"> ({selectedCandidate.party})</span>
            </div>
          ) : (
            <div className="text-xs text-amber-700 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Select one candidate above to enable ballot casting.</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setActivePage('verify')}
            className="w-1/2 sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cancel Session
          </button>

          <button
            onClick={handleProceedToConfirmation}
            disabled={!selectedCandidate}
            className="w-1/2 sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <Vote className="w-4 h-4" />
            <span>Cast Vote &rarr;</span>
          </button>
        </div>

      </div>

    </div>
  );
}
