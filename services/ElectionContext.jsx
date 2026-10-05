import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_CANDIDATES,
  INITIAL_SAMPLE_VOTERS,
  INITIAL_ELECTION_SETTINGS,
  INITIAL_AUDIT_LOGS,
} from './mockData.js';

const ElectionContext = createContext(null);

export function ElectionProvider({ children }) {
  // Load persistent state from localStorage if available (so page reloads in VS Code preserve demo state)
  const [candidates, setCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem('civic_candidates');
      return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    } catch {
      return INITIAL_CANDIDATES;
    }
  });

  const [voters, setVoters] = useState(() => {
    try {
      const saved = localStorage.getItem('civic_voters');
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_VOTERS;
    } catch {
      return INITIAL_SAMPLE_VOTERS;
    }
  });

  const [electionSettings, setElectionSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('civic_election_settings');
      return saved ? JSON.parse(saved) : INITIAL_ELECTION_SETTINGS;
    } catch {
      return INITIAL_ELECTION_SETTINGS;
    }
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('civic_audit_logs');
      return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  });

  // Current session voter
  const [currentVoter, setCurrentVoter] = useState(null);
  // Last cast vote receipt
  const [votedReceipt, setVotedReceipt] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('civic_candidates', JSON.stringify(candidates));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem('civic_voters', JSON.stringify(voters));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [voters]);

  useEffect(() => {
    try {
      localStorage.setItem('civic_election_settings', JSON.stringify(electionSettings));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [electionSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('civic_audit_logs', JSON.stringify(auditLogs));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [auditLogs]);

  // Append audit event
  const appendLog = (action, detail) => {
    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      action,
      detail,
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 49)]); // keep recent 50
  };

  // Voter session actions
  const startVoterSession = (voterRecord) => {
    setCurrentVoter({
      ...voterRecord,
      isOtpVerified: false,
      verificationProof: null,
    });
  };

  const verifyVoterOtp = (proof) => {
    if (!currentVoter) return;
    setCurrentVoter((prev) => ({
      ...prev,
      isOtpVerified: true,
      verificationProof: proof,
    }));
    appendLog(
      'OTP_VERIFIED',
      `Voter [${currentVoter.voterId.substring(0, 7)}•••] identity confirmed via simulated Aadhaar-OTP.`
    );
  };

  const castVote = (candidateId, receiptDetails) => {
    if (!currentVoter) return;

    // Increment candidate votes
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, votes: c.votes + 1 } : c))
    );

    // Update voter status to VOTED
    setVoters((prev) =>
      prev.map((v) =>
        v.voterId === currentVoter.voterId ? { ...v, status: 'VOTED' } : v
      )
    );

    // Set receipt
    setVotedReceipt(receiptDetails);

    // Update current voter
    setCurrentVoter((prev) => ({
      ...prev,
      status: 'VOTED',
    }));

    appendLog(
      'BALLOT_SEALED',
      `Ballot token ${receiptDetails.receiptId} safely recorded for constituency.`
    );
  };

  const resetCurrentVoter = () => {
    setCurrentVoter(null);
    setVotedReceipt(null);
  };

  // Admin controls
  const adminAddCandidate = (cand) => {
    const newCand = {
      id: 'cand-' + Date.now(),
      name: cand.name.trim(),
      party: cand.party.trim(),
      symbolName: cand.symbolName.trim(),
      symbolIcon: cand.symbolIcon || 'vote',
      color: cand.color || '#2563EB',
      education: cand.education ? cand.education.trim() : 'Higher Secondary',
      agenda: cand.agenda ? cand.agenda.trim() : 'Constituency representation and civic welfare.',
      votes: 0,
      active: true,
    };
    setCandidates((prev) => [...prev, newCand]);
    appendLog('CANDIDATE_ADDED', `New candidate "${newCand.name}" (${newCand.party}) registered.`);
  };

  const adminUpdateCandidate = (id, updatedFields) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    appendLog('CANDIDATE_UPDATED', `Candidate record ID ${id} modified.`);
  };

  const adminDeleteCandidate = (id) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    appendLog('CANDIDATE_REMOVED', `Candidate ID ${id} removed from electoral roll.`);
  };

  const adminSetElectionStatus = (newStatus) => {
    setElectionSettings((prev) => ({ ...prev, status: newStatus }));
    appendLog('STATUS_CHANGE', `Election state toggled to ${newStatus}.`);
  };

  const adminResetAllVotes = () => {
    setCandidates((prev) => prev.map((c) => ({ ...c, votes: 0 })));
    setVoters((prev) => prev.map((v) => ({ ...v, status: 'ELIGIBLE' })));
    setVotedReceipt(null);
    setCurrentVoter(null);
    appendLog('ELECTION_RESET', 'All ballot counts cleared and voters reset to ELIGIBLE.');
  };

  const adminAddVoter = (voterData) => {
    const rawId = voterData.voterId.toUpperCase().trim();
    const cleanPhone = voterData.mobile.replace(/\D/g, '');
    const suffix = cleanPhone.slice(-4) || '1234';

    const newVoter = {
      id: 'vtr-' + Date.now(),
      voterId: rawId,
      maskedAadhaar: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
      maskedMobile: `+91 ••••• •${suffix}`,
      fullName: voterData.fullName.trim() + ' (Demo)',
      constituency: electionSettings.constituency,
      status: 'ELIGIBLE',
      demoPhoneSuffix: suffix,
    };
    setVoters((prev) => [...prev, newVoter]);
    appendLog('VOTER_REGISTERED', `Sample voter ${rawId} added to electoral roll.`);
  };

  // Calculations
  const totalVotesCast = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
  const totalRegisteredVoters = voters.length;
  const turnoutPercentage =
    totalRegisteredVoters > 0
      ? ((voters.filter((v) => v.status === 'VOTED').length / totalRegisteredVoters) * 100).toFixed(1)
      : '0.0';

  return (
    <ElectionContext.Provider
      value={{
        candidates,
        voters,
        electionSettings,
        auditLogs,
        currentVoter,
        votedReceipt,
        totalVotesCast,
        totalRegisteredVoters,
        turnoutPercentage,
        startVoterSession,
        verifyVoterOtp,
        castVote,
        resetCurrentVoter,
        adminAddCandidate,
        adminUpdateCandidate,
        adminDeleteCandidate,
        adminSetElectionStatus,
        adminResetAllVotes,
        adminAddVoter,
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
}
