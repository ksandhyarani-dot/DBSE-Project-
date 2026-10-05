import React from 'react';
import { useElection } from '../services/ElectionContext.jsx';
import { ShieldCheck, LogOut, Vote, BarChart3, Settings, Home, UserCheck } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { currentVoter, resetCurrentVoter, electionSettings } = useElection();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-blue-700 transition-colors">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                CivicVote Academic
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                Aadhaar-Style OTP Voting Portal
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => setActivePage('home')}
            className={`transition-colors py-1 ${
              activePage === 'home'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => {
              if (currentVoter?.isOtpVerified && currentVoter?.status !== 'VOTED') {
                setActivePage('candidates');
              } else if (currentVoter?.status === 'VOTED') {
                setActivePage('success');
              } else {
                setActivePage('verify');
              }
            }}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activePage === 'verify' || activePage === 'candidates' || activePage === 'confirm' || activePage === 'success'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Voter Portal
          </button>

          <button
            onClick={() => setActivePage('results')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activePage === 'results'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live Results
          </button>

          <button
            onClick={() => setActivePage('admin')}
            className={`transition-colors py-1 flex items-center gap-1.5 ${
              activePage === 'admin'
                ? 'text-blue-600 font-semibold border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin Console
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {currentVoter ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800">
                  {currentVoter.fullName.split(' ')[0]}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono-numbers">
                  {currentVoter.isOtpVerified ? 'OTP Verified' : 'Awaiting OTP'}
                </span>
              </div>
              <button
                onClick={() => {
                  resetCurrentVoter();
                  setActivePage('home');
                }}
                title="End voter session"
                className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                aria-label="Logout voter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActivePage('verify')}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Cast Ballot</span>
            </button>
          )}
        </div>

      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-around bg-slate-50 text-xs">
        <button
          onClick={() => setActivePage('home')}
          className={`px-2 py-1 font-medium ${activePage === 'home' ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}
        >
          Home
        </button>
        <button
          onClick={() => setActivePage('verify')}
          className={`px-2 py-1 font-medium ${['verify', 'candidates', 'confirm', 'success'].includes(activePage) ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}
        >
          Voting Portal
        </button>
        <button
          onClick={() => setActivePage('results')}
          className={`px-2 py-1 font-medium ${activePage === 'results' ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}
        >
          Results
        </button>
        <button
          onClick={() => setActivePage('admin')}
          className={`px-2 py-1 font-medium ${activePage === 'admin' ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}
        >
          Admin
        </button>
      </div>
    </header>
  );
}
