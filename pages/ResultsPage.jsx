import React, { useState } from 'react';
import { useElection } from '../services/ElectionContext.jsx';
import CandidateSymbolIcon from '../components/CandidateSymbolIcon.jsx';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Vote, 
  Award, 
  RefreshCw, 
  Printer, 
  CheckCircle2,
  Table as TableIcon
} from 'lucide-react';

export default function ResultsPage({ setActivePage }) {
  const { 
    candidates, 
    totalVotesCast, 
    totalRegisteredVoters, 
    turnoutPercentage, 
    electionSettings 
  } = useElection();

  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sort candidates by votes descending
  const sortedCandidates = [...candidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  const leadingCandidate = sortedCandidates.length > 0 && totalVotesCast > 0 ? sortedCandidates[0] : null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 pb-16">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Official Election Tally</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-slate-500 font-normal">{electionSettings.constituency}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Real-Time Election Results
          </h1>
          <p className="text-xs text-slate-500">
            Cryptographically aggregated ballot tallies for the academic prototype election.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented control for view mode */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'chart'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Chart View</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 text-slate-600 hover:text-blue-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Results"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          <button
            onClick={() => window.print()}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            title="Print Election Report"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Ballots Cast</span>
            <Vote className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-numbers">
            {totalVotesCast}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Cumulative across all registered contenders
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Total Registered Roll</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-numbers">
            {totalRegisteredVoters}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Eligible electors in constituency
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Voter Turnout Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 font-mono-numbers">
            {turnoutPercentage}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Percentage of eligible voters participated
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Leading Candidate</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-bold text-slate-900 truncate">
            {leadingCandidate ? leadingCandidate.name : 'Tally In Progress'}
          </div>
          <div className="text-[11px] text-amber-700 font-medium truncate mt-1">
            {leadingCandidate ? `${leadingCandidate.party} (${leadingCandidate.votes} votes)` : 'No ballots cast'}
          </div>
        </div>

      </div>

      {/* Main Results Display */}
      {viewMode === 'chart' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">
              Candidate Vote Share & Relative Breakdown
            </h2>
            <span className="text-xs text-slate-400 font-mono-numbers">
              {candidates.length} Contenders Evaluated
            </span>
          </div>

          <div className="space-y-6">
            {sortedCandidates.map((cand, idx) => {
              const voteCount = cand.votes || 0;
              const percentage = totalVotesCast > 0 
                ? ((voteCount / totalVotesCast) * 100).toFixed(1) 
                : '0.0';
              const isLeader = idx === 0 && voteCount > 0;

              return (
                <div key={cand.id} className="space-y-2">
                  
                  {/* Candidate row info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-8 h-8 rounded-md flex items-center justify-center border shadow-xs shrink-0"
                        style={{ color: cand.color, borderColor: cand.color, backgroundColor: '#FAFAFA' }}
                      >
                        <CandidateSymbolIcon name={cand.symbolIcon} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{cand.name}</span>
                          {isLeader && (
                            <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 border border-amber-200 px-1.5 py-0.2 rounded">
                              Leading
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 font-medium">
                          {cand.party} · Symbol: {cand.symbolName}
                        </span>
                      </div>
                    </div>

                    <div className="text-right sm:self-center font-mono-numbers text-xs">
                      <span className="font-bold text-slate-900 text-sm">{voteCount}</span>
                      <span className="text-slate-500 ml-1">votes</span>
                      <span className="font-bold text-blue-700 ml-2">({percentage}%)</span>
                    </div>
                  </div>

                  {/* Visual Bar Indicator */}
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(parseFloat(percentage), 1)}%`,
                        backgroundColor: cand.color || '#2563EB',
                      }}
                    />
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Official Tabulated Result Sheet
            </h2>
            <span className="text-xs text-slate-500 font-mono-numbers">
              Generated: {new Date().toLocaleTimeString('en-IN', { hour12: false })} IST
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Symbol</th>
                  <th className="py-3 px-4">Candidate Name</th>
                  <th className="py-3 px-4">Party Affiliation</th>
                  <th className="py-3 px-4 text-right">Votes</th>
                  <th className="py-3 px-4 text-right">Vote Share</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedCandidates.map((cand, idx) => {
                  const voteCount = cand.votes || 0;
                  const percentage = totalVotesCast > 0 
                    ? ((voteCount / totalVotesCast) * 100).toFixed(1) 
                    : '0.0';
                  const isLeader = idx === 0 && voteCount > 0;

                  return (
                    <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono-numbers font-semibold text-slate-500">
                        #{idx + 1}
                      </td>
                      <td className="py-3.5 px-4">
                        <div 
                          className="w-7 h-7 rounded flex items-center justify-center border"
                          style={{ color: cand.color, borderColor: cand.color }}
                        >
                          <CandidateSymbolIcon name={cand.symbolIcon} className="w-3.5 h-3.5" />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 text-sm">
                        {cand.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {cand.party}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-numbers font-bold text-slate-900">
                        {voteCount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono-numbers font-semibold text-blue-700">
                        {percentage}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {isLeader ? (
                          <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            Leading
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Contender</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Academic Demonstration Notes */}
      <div className="bg-slate-100/80 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-1">
        <span className="font-semibold text-slate-800 block">
          Academic Capstone Note on Cryptographic Tallies:
        </span>
        <p className="leading-relaxed text-[11px] text-slate-500">
          In this electronic voting system prototype, ballots are recorded into the database using atomic counters. 
          When deployed with Python Flask and MySQL, each transaction locks the voter’s state to 'VOTED' and increments 
          the candidate count in a single ACID transaction, eliminating race conditions and double-voting vulnerabilities.
        </p>
      </div>

    </div>
  );
}
