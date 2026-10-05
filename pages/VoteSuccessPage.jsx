import React from 'react';
import { useElection } from '../services/ElectionContext.jsx';
import { 
  CheckCircle2, 
  Download, 
  BarChart3, 
  ShieldCheck, 
  Home, 
  Printer, 
  Copy, 
  Check
} from 'lucide-react';

export default function VoteSuccessPage({ setActivePage }) {
  const { votedReceipt, resetCurrentVoter, electionSettings } = useElection();
  const [copied, setCopied] = React.useState(false);

  // Fallback if no active receipt
  const receipt = votedReceipt || {
    receiptId: 'REC-DEMO-7842-8801',
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    candidateName: 'Selected Candidate',
    party: 'Electoral Party Affiliation',
    constituency: electionSettings.constituency,
    maskedVoterId: 'VTR-2026-••••',
  };

  const handleCopyReceipt = () => {
    navigator.clipboard?.writeText(receipt.receiptId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-8 animate-fadeIn">
      
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Vote Successfully Submitted!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Your electronic ballot has been cryptographically sealed and recorded in the constituency tally. 
          Your voting session is now closed to preserve election integrity.
        </p>
      </div>

      {/* Official Cryptographic Receipt Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6 print:border-none print:shadow-none">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Official Digital Ballot Receipt
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
            Sealed & Recorded
          </span>
        </div>

        {/* Receipt Details Grid */}
        <div className="space-y-3 text-xs">
          
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Receipt Verification Hash
              </span>
              <span className="font-mono-numbers font-bold text-slate-900 text-sm">
                {receipt.receiptId}
              </span>
            </div>
            <button
              onClick={handleCopyReceipt}
              className="p-1.5 text-slate-500 hover:text-blue-600 rounded bg-white border border-slate-200 text-xs flex items-center gap-1 cursor-pointer"
              title="Copy receipt token"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50/70 rounded border border-slate-200/60">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Timestamp (IST)
              </span>
              <span className="font-mono-numbers font-medium text-slate-800">
                {receipt.timestamp}
              </span>
            </div>

            <div className="p-3 bg-slate-50/70 rounded border border-slate-200/60">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Electoral Roll Reference
              </span>
              <span className="font-mono-numbers font-medium text-slate-800">
                {receipt.maskedVoterId}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50/70 rounded border border-slate-200/60">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">
              Constituency
            </span>
            <span className="font-medium text-slate-800">
              {receipt.constituency}
            </span>
          </div>

        </div>

        {/* Anonymity guarantee footnote */}
        <div className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-100 pt-4">
          Notice: This digital receipt serves as proof that your vote was received by the central tabulation engine. 
          To protect ballot secrecy under electoral guidelines, sensitive biometric and identity details are neither printed nor stored.
        </div>

        {/* Action Buttons (hidden in print) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <button
            type="button"
            onClick={() => {
              resetCurrentVoter();
              setActivePage('results');
            }}
            className="w-full sm:w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>View Live Election Results</span>
          </button>
        </div>

      </div>

      {/* Return Home Link */}
      <div className="text-center print:hidden">
        <button
          onClick={() => {
            resetCurrentVoter();
            setActivePage('home');
          }}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Homepage (End Session)</span>
        </button>
      </div>

    </div>
  );
}
