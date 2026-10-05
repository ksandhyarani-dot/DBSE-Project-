import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

export default function AcademicDisclaimerBanner() {
  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">Academic Prototype Notice:</span>
          <span className="text-slate-300">
            Simulated demonstration of Aadhaar-style OTP multi-factor voter authentication.
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span>Zero Real Aadhaar Numbers Collected</span>
          <span aria-hidden="true">·</span>
          <span>Masked Credentials Only</span>
          <span aria-hidden="true">·</span>
          <span>No Official UIDAI Affiliation Claimed</span>
        </div>
      </div>
    </div>
  );
}
