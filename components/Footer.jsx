import React from 'react';
import { Shield, Database, Lock, GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Project Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                CV
              </div>
              <span className="font-semibold text-slate-900 tracking-tight">
                Online Voting System with Aadhaar-Style OTP Verification
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
              An academic capstone project demonstrating end-to-end electronic voter authentication, 
              single-ballot integrity, anonymized cryptographic receipt generation, and real-time result tabulation.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                Academic Prototype
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                Flask + MySQL Architecture
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Zero Plaintext Secrets
              </span>
            </div>
          </div>

          {/* Col 2: Security Specifications */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block">
              Security Compliance
            </span>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>Masked OTP entry only</li>
              <li>Encrypted voter tokenization</li>
              <li>Single-vote enforcement lock</li>
              <li>No UIDAI data persistence</li>
              <li>Tamper-evident audit trail</li>
            </ul>
          </div>

          {/* Col 3: Technical Stack */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider block">
              Deployment Specs
            </span>
            <ul className="space-y-1.5 text-xs text-slate-500">
              <li>Frontend: React 19 + Tailwind CSS</li>
              <li>Backend Target: Python Flask REST API</li>
              <li>Database Target: MySQL Relational DB</li>
              <li>Environment: VS Code & Node 20+</li>
              <li>Auth Protocol: Multi-Factor OTP</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            &copy; 2026 Academic Research Project. Designed for evaluation & defense in VS Code.
          </div>
          <div className="flex items-center gap-3">
            <span>Simulated Prototype</span>
            <span aria-hidden="true">·</span>
            <span>Educational Research Only</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
