import React, { useState } from 'react';
import { useElection } from '../services/ElectionContext.jsx';
import { submitBallot } from '../services/api.js';
import CandidateSymbolIcon from '../components/CandidateSymbolIcon.jsx';
import { 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  Vote, 
  AlertTriangle,
  Award
} from 'lucide-react';

export default function VoteConfirmationPage({ 
  selectedCandidate, 
  setSelectedCandidate, 
  setActivePage 
}) {
  const { currentVoter, castVote, electionSettings } = useElection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!selectedCandidate) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm text-slate-500">No candidate has been selected.</p>
        <button
          onClick={() => setActivePage('candidates')}
          className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg"
        >
          Return to Candidate Selection
        </button>
      </div>
    );
  }

  const handleFinalConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Call ballot submission service
      const result = await submitBallot(currentVoter.voterId, selectedCandidate.id);

      // Record in local state context
      castVote(selectedCandidate.id, {
        receiptId: result.receiptId,
        timestamp: result.timestamp,
        candidateName: selectedCandidate.name,
        party: selectedCandidate.party,
        symbolName: selectedCandidate.symbolName,
        constituency: electionSettings.constituency,
        maskedVoterId: currentVoter.voterId.substring(0, 6) + '••••',
      });

      // Clear selection and go to success page
      setSelectedCandidate(null);
      setActivePage('success');
    } catch (err) {
      setSubmitError(err.message || 'Ballot submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fadeIn">
      
      {/* Step Indicator */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-md">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Stage 3 of 3: Final Ballot Confirmation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Verify and Seal Your Ballot
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Please carefully review your chosen candidate below. Once submitted, your vote is recorded irreversibly in the ballot tally and your session is locked.
        </p>
      </div>

      {submitError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Confirmation Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Selected Candidate Summary Box */}
        <div className="p-5 rounded-lg border-2 border-blue-600 bg-blue-50/40 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Selected Candidate for Election
            </span>
            <span className="text-xs font-semibold text-slate-600">
              Constituency #04
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-lg flex items-center justify-center border shadow-xs bg-white"
              style={{ color: selectedCandidate.color, borderColor: selectedCandidate.color }}
            >
              <CandidateSymbolIcon name={selectedCandidate.symbolIcon} className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-medium text-slate-500">
                Symbol: {selectedCandidate.symbolName}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {selectedCandidate.name}
              </h2>
              <p className="text-xs font-semibold text-blue-700">
                {selectedCandidate.party}
              </p>
            </div>
          </div>
        </div>

        {/* Security Disclaimers Checklist */}
        <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
          <div className="flex items-start gap-2">
            <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Cryptographic Anonymization:</strong> Your voter identity is decoupled from this ballot. The system tallies your vote without storing who you voted for alongside your name.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Irreversible Submission:</strong> Once you click "Confirm Vote", the transaction is final. You cannot alter or revoke your selection.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-3">
          <button
            type="button"
            onClick={() => setActivePage('candidates')}
            disabled={isSubmitting}
            className="w-full sm:w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Change</span>
          </button>

          <button
            type="button"
            onClick={handleFinalConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-2/3 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sealing Ballot & Generating Receipt...</span>
              </>
            ) : (
              <>
                <Vote className="w-4 h-4" />
                <span>Confirm & Submit Vote</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
