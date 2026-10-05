import React, { useState, useEffect, useRef } from 'react';
import { useElection } from '../services/ElectionContext.jsx';
import { requestAadhaarOtp, verifyAadhaarOtp } from '../services/api.js';
import { 
  ShieldCheck, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw,
  Lock,
  UserCheck,
  Info
} from 'lucide-react';

export default function VoterVerificationPage({ setActivePage }) {
  const { voters, startVoterSession, verifyVoterOtp, electionSettings, currentVoter } = useElection();

  // Form states
  const [voterId, setVoterId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [step, setStep] = useState('CREDENTIALS'); // 'CREDENTIALS' | 'OTP' | 'VERIFIED'
  
  // OTP states (Array of 6 strings for 6 boxes)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);

  // Async & feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [maskedMobileDisplay, setMaskedMobileDisplay] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // If voter is already verified and hasn't voted, redirect or show continue
  useEffect(() => {
    if (currentVoter?.isOtpVerified && currentVoter?.status !== 'VOTED') {
      setStep('VERIFIED');
    }
  }, [currentVoter]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval = null;
    if (step === 'OTP' && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (step === 'OTP' && timerSeconds === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timerSeconds]);

  // Handle Quick Demo Pre-fill
  const handleSelectDemoVoter = (sample) => {
    setVoterId(sample.voterId);
    setMobileNumber(`98765 0${sample.demoPhoneSuffix}`);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (electionSettings.status !== 'ACTIVE') {
        throw new Error(`Election is currently ${electionSettings.status}. Voting is suspended.`);
      }

      const result = await requestAadhaarOtp(voterId, mobileNumber, voters);

      // Find the voter to initialize the session in context
      const matchedVoter = voters.find(
        (v) => v.voterId.toUpperCase() === voterId.trim().toUpperCase()
      );

      startVoterSession(matchedVoter);
      setMaskedMobileDisplay(result.maskedMobile);
      setSuccessMessage(result.message);
      setStep('OTP');
      setTimerSeconds(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      
      // Auto-focus first OTP digit box after render
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);

    } catch (err) {
      setErrorMessage(err.message || 'Verification initialization failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle individual OTP box changes
  const handleOtpDigitChange = (index, value) => {
    // Only accept numeric single character
    const sanitized = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (sanitized.length > 0) {
      newDigits[index] = sanitized[sanitized.length - 1]; // take last digit
      setOtpDigits(newDigits);

      // Auto advance to next box
      if (index < 5 && otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1].focus();
      }
    } else {
      newDigits[index] = '';
      setOtpDigits(newDigits);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      // Focus previous input on backspace
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setOtpDigits(newDigits);

    const focusIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[focusIndex]?.focus();
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const fullOtpString = otpDigits.join('');

    try {
      const result = await verifyAadhaarOtp(voterId, fullOtpString);
      verifyVoterOtp(result.verificationProof);
      setSuccessMessage('Aadhaar OTP authenticated successfully. Ballot unlocked.');
      setStep('VERIFIED');

      // Auto redirect to candidates selection after 1.2s
      setTimeout(() => {
        setActivePage('candidates');
      }, 1200);

    } catch (err) {
      setErrorMessage(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const result = await requestAadhaarOtp(voterId, mobileNumber, voters);
      setSuccessMessage('A fresh OTP has been dispatched to your registered mobile number.');
      setTimerSeconds(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-md">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Stage 1 of 3: Voter Identity Verification</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Aadhaar-Style Multi-Factor Authentication
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Authenticate your electoral enrollment using your Voter Reference ID and the registered mobile linked to your demographic record.
        </p>
      </div>

      {/* Main Verification Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold block">Authentication Error</strong>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Global Success Banner */}
        {successMessage && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="font-semibold block">Verification Notification</strong>
              {successMessage}
            </div>
          </div>
        )}

        {/* STEP 1: Enter Voter ID & Mobile */}
        {step === 'CREDENTIALS' && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            
            <div className="space-y-4">
              
              {/* Voter ID field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Voter Identification Number / Enrollment ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    placeholder="e.g. VTR-2026-9041"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono-numbers uppercase tracking-wider"
                    required
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Format: Standard alphanumeric voter reference card number.
                </p>
              </div>

              {/* Registered Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Registered Mobile Number (Linked to Aadhaar Record)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-medium text-slate-400 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="98765 04321"
                    maxLength={15}
                    className="w-full pl-12 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono-numbers"
                    required
                  />
                  <Smartphone className="absolute right-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  A 6-digit one-time authorization code will be dispatched to this number.
                </p>
              </div>

            </div>

            {/* Quick Demo Pre-fill helper for examiners */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg space-y-2">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider block">
                Quick Fill Demo Voter (Academic Evaluation):
              </span>
              <div className="flex flex-wrap gap-2">
                {voters.slice(0, 3).map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleSelectDemoVoter(v)}
                    className={`px-2.5 py-1.5 rounded text-xs font-medium border text-left transition-colors cursor-pointer ${
                      voterId === v.voterId
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="block font-semibold">{v.voterId}</span>
                    <span className="text-[10px] opacity-80">
                      {v.status === 'VOTED' ? '(Already Voted)' : `(Ends ••••${v.demoPhoneSuffix})`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !voterId || !mobileNumber}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Checking Electoral Roll & Sending OTP...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Send Aadhaar-Style OTP</span>
                </>
              )}
            </button>

          </form>
        )}

        {/* STEP 2: Masked OTP Entry */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fadeIn">
            
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Enter 6-Digit Verification Code
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                OTP dispatched to masked telephone record <span className="font-semibold text-slate-800 font-mono-numbers">{maskedMobileDisplay}</span>. 
                Please enter the code to verify your identity.
              </p>
              <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200/80 rounded py-1 px-3 inline-block font-medium">
                Academic demo: Enter any 6-digit number (e.g. 1 2 3 4 5 6) to proceed.
              </div>
            </div>

            {/* 6 Digit Masked Input Boxes */}
            <div className="flex justify-center items-center gap-2 sm:gap-3 py-2">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputRefs.current[idx] = el)}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono-numbers"
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            {/* Countdown Timer & Resend */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div>
                {timerSeconds > 0 ? (
                  <span>
                    Code expires in: <strong className="text-slate-800 font-mono-numbers">{timerSeconds}s</strong>
                  </span>
                ) : (
                  <span className="text-rose-600 font-medium">OTP has expired.</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || isLoading}
                className="text-blue-600 hover:text-blue-700 disabled:text-slate-400 font-medium flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Resend OTP</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep('CREDENTIALS');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Change Voter ID
              </button>

              <button
                type="submit"
                disabled={isLoading || otpDigits.join('').length !== 6}
                className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify OTP & Unlock Ballot</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

        {/* STEP 3: Verified State Confirmation */}
        {step === 'VERIFIED' && (
          <div className="text-center space-y-4 py-4 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">
                Identity Authentication Confirmed
              </h2>
              <p className="text-xs text-slate-500">
                Aadhaar multi-factor verification validated. Electronic ballot is primed for submission.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 max-w-sm mx-auto text-left text-xs space-y-1.5 font-mono-numbers">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Electoral ID:</span>
                <span className="font-semibold text-slate-800">{currentVoter?.voterId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Voter Name:</span>
                <span className="font-semibold text-slate-800">{currentVoter?.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Auth Proof Token:</span>
                <span className="font-semibold text-emerald-700 truncate max-w-[160px]">
                  {currentVoter?.verificationProof || 'VERIFIED_TOKEN_OK'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActivePage('candidates')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Proceed to Candidate Selection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

      {/* Security Assurance Disclaimer Box */}
      <div className="bg-slate-100/80 border border-slate-200/90 rounded-lg p-4 text-xs text-slate-600 space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Academic Security & Anonymity Protocol</span>
        </div>
        <p className="leading-relaxed text-[11px] text-slate-500">
          In accordance with privacy standards for electronic voting demonstrations, real Aadhaar credentials are never requested or handled. 
          The verification protocol validates identity via an isolated authentication token, decoupling the voter’s identity from the physical ballot record.
        </p>
      </div>

    </div>
  );
}
