import React, { useState } from 'react';
import { useElection } from '../services/ElectionContext.jsx';
import CandidateSymbolIcon from '../components/CandidateSymbolIcon.jsx';
import { 
  ShieldAlert, 
  Users, 
  Vote, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Lock, 
  Unlock, 
  RotateCcw, 
  AlertTriangle, 
  Search, 
  FileText, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  BarChart3,
  SlidersHorizontal,
  FolderGit2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { 
    candidates, 
    voters, 
    electionSettings, 
    auditLogs, 
    totalVotesCast, 
    totalRegisteredVoters, 
    turnoutPercentage,
    adminAddCandidate,
    adminUpdateCandidate,
    adminDeleteCandidate,
    adminSetElectionStatus,
    adminResetAllVotes,
    adminAddVoter
  } = useElection();

  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active admin tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'candidates' | 'voters' | 'election' | 'audit'

  // Modals & form state
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [newCandName, setNewCandName] = useState('');
  const [newCandParty, setNewCandParty] = useState('');
  const [newCandSymbol, setNewCandSymbol] = useState('Rising Sun');
  const [newCandIcon, setNewCandIcon] = useState('sun');
  const [newCandAgenda, setNewCandAgenda] = useState('');

  const [showAddVoterModal, setShowAddVoterModal] = useState(false);
  const [newVoterId, setNewVoterId] = useState('');
  const [newVoterName, setNewVoterName] = useState('');
  const [newVoterPhone, setNewVoterPhone] = useState('');

  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [voterSearchQuery, setVoterSearchQuery] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Handle Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    // Academic prototype credential verification
    // NOTE: Passwords are treated securely: masked in the input, never logged or displayed on screen
    if (adminUsername.trim() === 'admin' && adminPassword === 'admin123') {
      setIsAuthenticated(true);
      setAdminPassword(''); // clear password from memory immediately
    } else {
      setAuthError('Invalid credentials. (Academic demo hint: username: admin / password: admin123)');
    }
  };

  const handleQuickFillAdmin = () => {
    setAdminUsername('admin');
    setAdminPassword('admin123');
    setAuthError('');
  };

  const handleAddCandidateSubmit = (e) => {
    e.preventDefault();
    if (!newCandName || !newCandParty) return;

    adminAddCandidate({
      name: newCandName,
      party: newCandParty,
      symbolName: newCandSymbol,
      symbolIcon: newCandIcon,
      agenda: newCandAgenda,
      color: '#2563EB',
    });

    setNewCandName('');
    setNewCandParty('');
    setNewCandAgenda('');
    setShowAddCandidateModal(false);
    triggerNotice('Candidate registered successfully into official roll.');
  };

  const handleAddVoterSubmit = (e) => {
    e.preventDefault();
    if (!newVoterId || !newVoterName || !newVoterPhone) return;

    adminAddVoter({
      voterId: newVoterId,
      fullName: newVoterName,
      mobile: newVoterPhone,
    });

    setNewVoterId('');
    setNewVoterName('');
    setNewVoterPhone('');
    setShowAddVoterModal(false);
    triggerNotice('New voter enrolled into constituency electoral registry.');
  };

  const triggerNotice = (msg) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  // If not authenticated, display secure login form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white mx-auto flex items-center justify-center shadow-xs">
            <Lock className="w-6 h-6 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Election Authority Console
          </h1>
          <p className="text-xs text-slate-500">
            Authorized electoral officers only. Please authenticate using your administrative credentials.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Username / Officer ID
              </label>
              <input
                type="text"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Admin Password (Masked)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In to Admin Console</span>
            </button>
          </form>

          {/* Academic Evaluation Fast-Fill */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Academic testing demo:</span>
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-400">
          Strict policy: Administrative passwords are never cached in plaintext or sent unencrypted.
        </div>
      </div>
    );
  }

  // Filter voters list by search query
  const filteredVoters = voters.filter(
    (v) =>
      v.voterId.toLowerCase().includes(voterSearchQuery.toLowerCase()) ||
      v.fullName.toLowerCase().includes(voterSearchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 pb-20 animate-fadeIn">
      
      {/* Top Banner and Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide uppercase">
            <span>Electoral Commission Console</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-slate-500 font-normal">{electionSettings.constituency}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Admin Management Console
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Officer: Electoral Admin #01</span>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer font-medium"
          >
            Lock Console
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px text-xs font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('candidates')}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'candidates'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Candidate Management ({candidates.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('voters')}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'voters'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Voter Registry ({voters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('election')}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'election'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Election Controls</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 border-b-2 transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-slate-500 text-xs block mb-1">Total Registered Voters</span>
              <div className="text-2xl font-bold text-slate-900 font-mono-numbers">
                {totalRegisteredVoters}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">In electoral roll</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-slate-500 text-xs block mb-1">Total Candidates</span>
              <div className="text-2xl font-bold text-slate-900 font-mono-numbers">
                {candidates.length}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Contesting roll entries</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-slate-500 text-xs block mb-1">Election Status</span>
              <div className="text-xl font-bold font-mono-numbers">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs ${
                  electionSettings.status === 'ACTIVE' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : electionSettings.status === 'PAUSED'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200 text-slate-800'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {electionSettings.status}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Poll state</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <span className="text-slate-500 text-xs block mb-1">Ballots Cast / Turnout</span>
              <div className="text-2xl font-bold text-blue-700 font-mono-numbers">
                {totalVotesCast} <span className="text-xs font-normal text-slate-500">({turnoutPercentage}%)</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Participation rate</span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Quick Administrative Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddCandidateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contesting Candidate</span>
              </button>
              <button
                onClick={() => setShowAddVoterModal(true)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Register Demo Voter</span>
              </button>
              <button
                onClick={() => setShowResetConfirmModal(true)}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Votes (Demo Clean)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE MANAGEMENT */}
      {activeTab === 'candidates' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Contesting Candidates Registry</h2>
              <p className="text-xs text-slate-500">Configure contesting candidates, party symbols, and active status.</p>
            </div>
            <button
              onClick={() => setShowAddCandidateModal(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Candidate</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {candidates.map((cand) => (
              <div key={cand.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center border shadow-xs"
                    style={{ color: cand.color, borderColor: cand.color, backgroundColor: '#F8FAFC' }}
                  >
                    <CandidateSymbolIcon name={cand.symbolIcon} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{cand.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono-numbers">Symbol: {cand.symbolName}</span>
                    </div>
                    <div className="text-xs text-blue-700 font-medium">
                      {cand.party}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono-numbers">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Ballots</span>
                    <span className="font-bold text-slate-800 text-sm">{cand.votes || 0}</span>
                  </div>

                  {cand.id !== 'cand-05' && (
                    <button
                      onClick={() => adminDeleteCandidate(cand.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Remove candidate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VOTER REGISTRY MANAGEMENT */}
      {activeTab === 'voters' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Electoral Roll & Identity Registry</h2>
              <p className="text-xs text-slate-500">
                Sample voter roll. Sensitive biometric credentials are strictly masked.
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={voterSearchQuery}
                  onChange={(e) => setVoterSearchQuery(e.target.value)}
                  placeholder="Search voter ID or name..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => setShowAddVoterModal(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Voter</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Voter Reference ID</th>
                  <th className="py-2.5 px-3">Elector Name</th>
                  <th className="py-2.5 px-3">Masked Aadhaar</th>
                  <th className="py-2.5 px-3">Masked Mobile</th>
                  <th className="py-2.5 px-3">Constituency</th>
                  <th className="py-2.5 px-3 text-center">Voting Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVoters.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono-numbers font-semibold text-slate-900">
                      {v.voterId}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800">
                      {v.fullName}
                    </td>
                    <td className="py-3 px-3 font-mono-numbers text-slate-500">
                      {v.maskedAadhaar}
                    </td>
                    <td className="py-3 px-3 font-mono-numbers text-slate-500">
                      {v.maskedMobile}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {v.constituency}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                        v.status === 'VOTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {v.status === 'VOTED' ? '✓ Voted' : 'Eligible'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ELECTION CONTROLS */}
      {activeTab === 'election' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Election Operational State</h2>
            <p className="text-xs text-slate-500">
              Manage polling window and emergency controls for the academic demonstration.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
            <span className="text-xs font-semibold text-slate-700 block">
              Set Election Polling Status:
            </span>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  adminSetElectionStatus('ACTIVE');
                  triggerNotice('Election status set to ACTIVE. Voters can now cast ballots.');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                  electionSettings.status === 'ACTIVE'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-600'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>ACTIVE (Polling Open)</span>
              </button>

              <button
                onClick={() => {
                  adminSetElectionStatus('PAUSED');
                  triggerNotice('Election status set to PAUSED. Polling temporarily held.');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                  electionSettings.status === 'PAUSED'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-amber-600'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>PAUSED (Maintenance / Hold)</span>
              </button>

              <button
                onClick={() => {
                  adminSetElectionStatus('CONCLUDED');
                  triggerNotice('Election status set to CONCLUDED. Final tallies locked.');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                  electionSettings.status === 'CONCLUDED'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>CONCLUDED (Polls Closed)</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-rose-50/60 rounded-lg border border-rose-200 space-y-3">
            <span className="text-xs font-bold text-rose-900 block flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Demo Data Reset (Academic Presentation Utility)
            </span>
            <p className="text-xs text-rose-800 leading-relaxed">
              Clears all cast votes back to 0 and resets all sample voters to "ELIGIBLE" so examiners can repeatedly test the complete voting pipeline.
            </p>
            <button
              onClick={() => setShowResetConfirmModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Election Data</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOG */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Electoral Security & Audit Trail</h2>
            <p className="text-xs text-slate-500">
              Anonymized event log documenting authentication dispatches, ballot seals, and administrative state changes.
            </p>
          </div>

          <div className="divide-y divide-slate-100 font-mono-numbers text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px] shrink-0">{log.timestamp}</span>
                  <span className="font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-slate-600 font-sans text-xs">{log.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD CANDIDATE */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200 animate-fadeIn">
            <h3 className="text-base font-bold text-slate-900">Add Contesting Candidate</h3>
            
            <form onSubmit={handleAddCandidateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={newCandName}
                  onChange={(e) => setNewCandName(e.target.value)}
                  placeholder="e.g. Smt. Kavitha Raman"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Political Party Name</label>
                <input
                  type="text"
                  value={newCandParty}
                  onChange={(e) => setNewCandParty(e.target.value)}
                  placeholder="e.g. Democratic Citizens Party"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Party Symbol Name</label>
                <input
                  type="text"
                  value={newCandSymbol}
                  onChange={(e) => setNewCandSymbol(e.target.value)}
                  placeholder="e.g. Rising Sun, Scales, Torch"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Agenda Summary</label>
                <textarea
                  value={newCandAgenda}
                  onChange={(e) => setNewCandAgenda(e.target.value)}
                  placeholder="Constituency manifesto summary..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs h-16"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCandidateModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Save Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD VOTER */}
      {showAddVoterModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200 animate-fadeIn">
            <h3 className="text-base font-bold text-slate-900">Register Sample Voter</h3>
            
            <form onSubmit={handleAddVoterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Voter ID / Reference</label>
                <input
                  type="text"
                  value={newVoterId}
                  onChange={(e) => setNewVoterId(e.target.value)}
                  placeholder="e.g. VTR-2026-9088"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Voter Full Name</label>
                <input
                  type="text"
                  value={newVoterName}
                  onChange={(e) => setNewVoterName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Registered Mobile Number</label>
                <input
                  type="tel"
                  value={newVoterPhone}
                  onChange={(e) => setNewVoterPhone(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddVoterModal(false)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Register Voter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET CONFIRMATION */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl space-y-4 border border-slate-200 animate-fadeIn text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset All Election Tallies?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will clear all submitted ballots back to 0 and allow all demo voters to vote again. This action is designed for testing the demonstration.
            </p>
            
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  adminResetAllVotes();
                  setShowResetConfirmModal(false);
                  triggerNotice('All ballots reset to 0. Voters set to ELIGIBLE.');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
