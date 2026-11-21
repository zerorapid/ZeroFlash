import React, { useState, useRef } from 'react';
import { Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react';

interface AuthGateProps {
  onSignIn: (email: string, name?: string, org?: string) => void;
  onSignUp: (name: string, email: string, org: string) => void;
  onGoogleSignIn: () => void;
}

type Mode = 'signin' | 'signup';
type View = 'auth' | 'signedin';

export const AuthGate: React.FC<AuthGateProps> = ({ onSignIn, onSignUp, onGoogleSignIn }) => {
  const [mode, setMode] = useState<Mode>('signin');
  const [view, setView] = useState<View>('auth');
  const [signedInAs, setSignedInAs] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  /* ─── helpers ─── */
  const clearStatus = () => setStatusMsg('');

  const withLoading = (ms: number, fn: () => void) => {
    setIsBusy(true);
    setTimeout(() => {
      setIsBusy(false);
      fn();
    }, ms);
  };

  const enterSignedIn = (identity: string) => {
    setSignedInAs(identity);
    setView('signedin');
  };

  const handleSignOut = () => {
    setView('auth');
    setSignedInAs('');
    setName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setMode('signin');
    clearStatus();
  };

  /* ─── Google ─── */
  const handleGoogle = () => {
    clearStatus();
    withLoading(250, () => {
      onGoogleSignIn();
      enterSignedIn('Google Account');
    });
  };

  /* ─── Demo ─── */
  const handleDemo = () => {
    clearStatus();
    withLoading(250, () => {
      onSignIn('jayapal@zerorapid.in', 'Jayapal Reddy', 'Zerorapid Studios');
      enterSignedIn('Jayapal Reddy');
    });
  };

  /* ─── Submit ─── */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearStatus();

    if (mode === 'signup' && !name.trim()) {
      setStatusMsg('Please enter your name.');
      nameRef.current?.focus();
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatusMsg('Please enter a valid email address.');
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setStatusMsg('Please enter your password.');
      return;
    }

    const identity = mode === 'signup' ? `${name.trim()} · ${email.trim()}` : email.trim();
    withLoading(250, () => {
      if (mode === 'signup') onSignUp(name.trim(), email.trim(), 'Studio');
      else onSignIn(email.trim());
      enterSignedIn(identity);
    });
  };

  /* ─── Signed-in view ─── */
  if (view === 'signedin') {
    return (
      <div className="min-h-screen w-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans antialiased">
        <div className="w-full max-w-[420px] bg-white border border-[#EAEAEA] rounded-3xl p-8 text-center animate-in fade-in duration-150">
          {/* Check circle */}
          <div className="w-12 h-12 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center mx-auto mb-5">
            <Check className="w-5 h-5 stroke-[2]" />
          </div>

          <h2 className="text-lg font-semibold text-[#0A0A0A] tracking-tight">Signed in</h2>
          <p className="mt-1.5 text-sm text-[#666666] break-words">{signedInAs}</p>

          <div className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full bg-[#F4F4F5] border border-[#EBEBEB] text-xs font-medium text-[#171717]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0A0A0A]" />
            Ready
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-7 w-full h-12 bg-white border border-[#E5E5E5] rounded-2xl text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-[#FAFAFA] hover:border-[#D4D4D4] active:scale-[0.99] cursor-pointer"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  /* ─── Auth view ─── */
  return (
    <div className="min-h-screen w-screen bg-[#FAFAFA] flex items-center justify-center p-6 font-sans antialiased">
      <main
        className="w-full max-w-[420px] bg-white border border-[#EAEAEA] rounded-3xl p-8 animate-in fade-in duration-150"
        aria-label="Authentication"
      >

        {/* ── 1. Segmented Control ── */}
        <div
          className="relative grid grid-cols-2 bg-[#F4F4F5] border border-[#EBEBEB] rounded-2xl p-1"
          role="tablist"
          aria-label="Authentication mode"
        >
          {/* Sliding thumb */}
          <div
            className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white border border-[#E5E5E5] rounded-xl transition-transform duration-200 pointer-events-none"
            style={{ transform: mode === 'signup' ? 'translateX(100%)' : 'translateX(0)' }}
            aria-hidden="true"
          />
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signin'}
            onClick={() => { setMode('signin'); clearStatus(); }}
            className={`relative z-10 h-[38px] rounded-xl text-sm transition-colors cursor-pointer border-none bg-transparent ${
              mode === 'signin' ? 'font-semibold text-[#0A0A0A]' : 'font-medium text-[#6B6B6B]'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'signup'}
            onClick={() => { setMode('signup'); clearStatus(); }}
            className={`relative z-10 h-[38px] rounded-xl text-sm transition-colors cursor-pointer border-none bg-transparent ${
              mode === 'signup' ? 'font-semibold text-[#0A0A0A]' : 'font-medium text-[#6B6B6B]'
            }`}
          >
            Create account
          </button>
        </div>

        {/* ── 2. Google Button ── */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={isBusy}
          className="mt-6 w-full h-12 bg-white border border-[#E5E5E5] rounded-2xl flex items-center justify-center gap-2.5 text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-[#FAFAFA] hover:border-[#D4D4D4] active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait cursor-pointer"
        >
          {isBusy ? (
            <span className="w-4 h-4 border-[1.75px] border-[#0A0A0A] border-r-transparent rounded-full animate-spin" />
          ) : (
            /* Official Google G icon – 4 real brand colours */
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        {/* ── 3. OR Divider ── */}
        <div className="flex items-center gap-3.5 my-5" aria-hidden="true">
          <span className="flex-1 h-px bg-[#EDEDED]" />
          <span className="text-xs text-[#9A9A9A] select-none">or</span>
          <span className="flex-1 h-px bg-[#EDEDED]" />
        </div>

        {/* ── 4. Form ── */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Collapsible Name field — only in signup mode */}
          <div
            className="overflow-hidden transition-all duration-200 ease-in-out"
            style={{
              maxHeight: mode === 'signup' ? '80px' : '0px',
              opacity: mode === 'signup' ? 1 : 0,
              marginBottom: mode === 'signup' ? '16px' : '0px',
            }}
            aria-hidden={mode !== 'signup'}
          >
            <label htmlFor="input-name" className="block text-[13.5px] font-medium text-[#171717] mb-2">
              Name
            </label>
            <input
              ref={nameRef}
              id="input-name"
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); clearStatus(); }}
              placeholder="Jayapal Reddy"
              autoComplete="name"
              tabIndex={mode === 'signup' ? 0 : -1}
              className="w-full h-12 px-4 bg-white border border-[#E5E5E5] rounded-2xl text-sm text-[#0A0A0A] placeholder:text-[#9A9A9A] focus:border-[#0A0A0A] focus:outline-none transition-colors"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="input-email" className="block text-[13.5px] font-medium text-[#171717] mb-2">
              Email
            </label>
            <input
              ref={emailRef}
              id="input-email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); clearStatus(); }}
              placeholder="name@company.com"
              autoComplete="email"
              className="w-full h-12 px-4 bg-white border border-[#E5E5E5] rounded-2xl text-sm text-[#0A0A0A] placeholder:text-[#9A9A9A] focus:border-[#0A0A0A] focus:outline-none transition-colors"
            />
          </div>

          {/* Password with Eye toggle */}
          <div className="mb-0">
            <label htmlFor="input-password" className="block text-[13.5px] font-medium text-[#171717] mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); clearStatus(); }}
                placeholder="••••••••"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full h-12 pl-4 pr-12 bg-white border border-[#E5E5E5] rounded-2xl text-sm text-[#0A0A0A] placeholder:text-[#9A9A9A] focus:border-[#0A0A0A] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 w-9 h-9 flex items-center justify-center rounded-xl text-[#666666] hover:text-[#0A0A0A] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
              >
                {showPassword
                  ? <EyeOff className="w-4.5 h-4.5" strokeWidth={1.5} />
                  : <Eye className="w-4.5 h-4.5" strokeWidth={1.5} />
                }
              </button>
            </div>
          </div>

          {/* Inline validation status */}
          {statusMsg && (
            <div
              role="alert"
              aria-live="polite"
              className="flex items-center gap-2 mt-3.5 px-3 py-2.5 bg-[#F4F4F5] border border-[#E5E5E5] rounded-xl text-xs font-medium text-[#171717] animate-in fade-in duration-150"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-[#0A0A0A]" strokeWidth={1.75} />
              <span>{statusMsg}</span>
            </div>
          )}

          {/* Primary Submit */}
          <button
            type="submit"
            disabled={isBusy}
            className="mt-5 w-full h-[50px] bg-[#0A0A0A] text-white rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-[#222222] active:scale-[0.99] disabled:opacity-75 disabled:cursor-wait cursor-pointer"
          >
            {isBusy ? (
              <>
                <span className="w-4 h-4 border-[1.75px] border-white border-r-transparent rounded-full animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>{mode === 'signup' ? 'Create account' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </>
            )}
          </button>
        </form>

        {/* ── 5. Divider ── */}
        <div className="h-px bg-[#EDEDED] my-6" aria-hidden="true" />

        {/* ── 6. Quick Demo ── */}
        <button
          type="button"
          onClick={handleDemo}
          disabled={isBusy}
          className="w-full h-12 bg-[#F9F9FA] border border-[#EBEBEB] rounded-2xl px-4 flex items-center justify-between text-sm font-medium text-[#0A0A0A] transition-colors hover:bg-[#F2F2F3] hover:border-[#DCDCDC] active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait cursor-pointer"
        >
          <span>Quick Demo · Jayapal Reddy</span>
          {isBusy ? (
            <span className="w-4 h-4 border-[1.75px] border-[#0A0A0A] border-r-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
          )}
        </button>

      </main>
    </div>
  );
};
