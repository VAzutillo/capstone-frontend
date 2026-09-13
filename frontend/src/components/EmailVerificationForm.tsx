import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Lock, Mail } from 'lucide-react';
import type { UserRole } from '../types/rbac';

type VerifiedUser = { email: string; role: UserRole };

export function EmailVerificationForm({
  email,
  onVerified,
  onBack,
}: {
  email: string;
  onVerified: (user: VerifiedUser) => void;
  onBack: () => void;
}) {
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState(() => createCode());
  const [secondsUntilResend, setSecondsUntilResend] = useState(30);
  const [secondsUntilExpiry, setSecondsUntilExpiry] = useState(300);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsUntilResend((seconds) => Math.max(0, seconds - 1));
      setSecondsUntilExpiry((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const isExpired = secondsUntilExpiry === 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isExpired) {
      setError('This OTP has expired. Please resend a new code.');
      return;
    }
    if (code.length !== 6 || code !== demoCode) {
      setError('Invalid OTP. Please enter the 6-digit code sent to your email.');
      return;
    }
    onVerified({ email, role: 'student' });
  };

  const resendCode = () => {
    if (secondsUntilResend > 0) return;
    setDemoCode(createCode());
    setCode('');
    setError(null);
    setSecondsUntilResend(30);
    setSecondsUntilExpiry(300);
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold text-neutral-900">Verify Your Email</h1>
          <p className="text-neutral-500">Enter the 6-digit code sent to your email.</p>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-lg bg-neutral-50 p-3 text-sm text-neutral-700">
          <Mail className="h-5 w-5 text-neutral-400" />
          <span className="truncate">{email}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="otp" className="mb-2 block text-sm font-medium text-neutral-700">
              6-digit OTP
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(event) => {
                setCode(event.target.value.replace(/\D/g, ''));
                setError(null);
              }}
              className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-center text-xl tracking-[0.4em] outline-none transition-all focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              placeholder="000000"
              required
            />
          </div>

          {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</p>}
          {isExpired && !error && <p className="text-sm text-red-600">Expired OTP. Please resend a new code.</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-neutral-900 py-3 font-medium text-white transition-all hover:bg-neutral-800"
          >
            Verify Code
          </button>
          <button
            type="button"
            onClick={resendCode}
            disabled={secondsUntilResend > 0}
            className="w-full text-sm text-neutral-600 transition-colors hover:text-neutral-900 disabled:cursor-not-allowed disabled:text-neutral-400"
          >
            {secondsUntilResend > 0 ? `Resend Code in ${secondsUntilResend}s` : 'Resend Code'}
          </button>
          <p className="text-center text-xs text-neutral-500">
            Demo code: <span className="font-semibold tracking-wider">{demoCode}</span> · Expires in {formatTime(secondsUntilExpiry)}
          </p>
          <button type="button" onClick={onBack} className="w-full text-sm text-neutral-500 hover:text-neutral-900">
            Back to login
          </button>
        </form>
      </div>
    </div>
  );
}

function createCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}
