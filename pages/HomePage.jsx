import React from 'react';
import { useElection } from '../services/ElectionContext.jsx';
import { 
  ShieldCheck, 
  Vote, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  FileCheck2, 
  Users, 
  BarChart2, 
  Activity,
  Layers,
  Fingerprint
} from 'lucide-react';

export default function HomePage({ setActivePage }) {
  const { 
    electionSettings, 
    candidates, 
    totalVotesCast, 
    totalRegisteredVoters, 
    turnoutPercentage,
    voters
  } = useElection();

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                <span>Academic Project Prototype</span>
                <span aria-hidden="true" className="text-slate-300">/</span>
                <span className="text-slate-500 font-normal">Aadhaar-Style Multi-Factor Authentication</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]" style={{ textWrap: 'balance' }}>
                ONLINE VOTING SYSTEM
                <span className="block text-blue-600 mt-1">Using Aadhaar-Style OTP Verification</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                A secure electronic voting architecture engineered for democratic integrity. 
                Features two-tier identity verification, simulated Aadhaar OTP confirmation, single-ballot locking, 
                and instant verifiable receipt generation without exposing personal credentials.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setActivePage('verify')}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-2.5 group cursor-pointer"
                >
                  <Vote className="w-4 h-4 text-blue-200 group-hover:scale-110 transition-transform" />
                  <span>Start Voting Flow</span>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActivePage('results')}
                  className="px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-medium text-sm rounded-lg border border-slate-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <BarChart2 className="w-4 h-4 text-slate-500" />
                  <span>View Live Tallies</span>
                </button>

                <button
                  onClick={() => setActivePage('admin')}
                  className="px-4 py-3.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium flex items-center gap-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
              </div>

              {/* Academic Security Trust Line */}
              <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Masked Mobile OTP Entry
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  One Voter = Exactly One Ballot
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Stored Passwords
                </span>
              </div>

            </div>

            {/* Right Column: Visual Graphic & Live State Card */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                
                {/* Visual Image with Fallback */}
                <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden">
                  <img
                    src="/src/assets/images/hero_voting_portal_1790939739019.jpg"
                    alt="Electronic Voting and Aadhaar Verification Graphic"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent flex items-end p-4">
                    <div className="text-white space-y-1">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-300">
                        {electionSettings.constituency}
                      </span>
                      <h3 className="text-sm font-medium text-slate-100">
                        {electionSettings.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Live Stats Row */}
                <div className="p-4 grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 text-center text-xs">
                  <div className="px-2">
                    <span className="text-slate-500 block text-[11px]">Election Status</span>
                    <span className="font-semibold text-emerald-700 font-mono-numbers">
                      {electionSettings.status}
                    </span>
                  </div>
                  <div className="px-2">
                    <span className="text-slate-500 block text-[11px]">Registered</span>
                    <span className="font-semibold text-slate-800 font-mono-numbers">
                      {totalRegisteredVoters} Voters
                    </span>
                  </div>
                  <div className="px-2">
                    <span className="text-slate-500 block text-[11px]">Turnout</span>
                    <span className="font-semibold text-blue-700 font-mono-numbers">
                      {turnoutPercentage}%
                    </span>
                  </div>
                </div>

              </div>

              {/* Sample Voter quick-start box for testing in VS Code */}
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-3.5 text-xs text-blue-900 space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                    Demo Evaluation Guide
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">For Project Defense</span>
                </div>
                <p className="text-blue-800 text-[11px] leading-relaxed">
                  Use pre-registered sample voter records to test the verification pipeline. 
                  OTP is securely verified via standard 6-digit mock input without exposing sensitive credentials.
                </p>
                <div className="bg-white/80 rounded border border-blue-200 p-2 font-mono-numbers text-[11px] flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500">Demo Voter ID: </span>
                    <strong className="text-slate-900">VTR-2026-9041</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Phone: </span>
                    <strong className="text-slate-900">98765 04321</strong>
                  </div>
                  <button
                    onClick={() => setActivePage('verify')}
                    className="text-blue-700 hover:text-blue-800 underline font-sans text-xs font-medium cursor-pointer"
                  >
                    Quick Test &rarr;
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 4-Step Architecture Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Verification Pipeline
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              End-to-End Election Integrity Protocol
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Structured to guarantee voter anonymity while preventing duplicate ballot casting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Step 1 */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Aadhaar-Linked Lookup
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Voter enters designated ID and registered mobile number. System validates eligibility against the constituency electoral roll.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Masked OTP Verification
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                A 6-digit one-time password is dispatched to the masked registered phone. The OTP value is never displayed on screen or logged.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Single Candidate Selection
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ballot is unlocked. The voter selects exactly one candidate with full party insignia. Explicit double-check confirmation is required.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">
                Cryptographic Receipt
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ballot tally increments instantly. A tamper-evident digital reference token is generated. Voter status is locked to prevent re-voting.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Candidates Preview & Live Constituency Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Official Electoral Roll Candidates
              </h2>
              <p className="text-xs text-slate-500">
                Candidates contesting in {electionSettings.constituency}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Registered Contenders:</span>
              <span className="font-semibold text-slate-800 font-mono-numbers">{candidates.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="p-4 rounded-lg border border-slate-200/90 hover:border-blue-300 transition-colors space-y-2 bg-slate-50/50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">{cand.name}</span>
                  <span className="text-[11px] text-slate-500 font-medium">{cand.symbolName}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {cand.party}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {cand.agenda}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => setActivePage('verify')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Proceed to Voter Authentication to vote</span>
              <span>&rarr;</span>
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
