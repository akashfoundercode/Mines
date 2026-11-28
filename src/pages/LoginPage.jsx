import { useState } from 'react';
import { LockKeyhole, Phone } from 'lucide-react';

export default function LoginPage({ onLogin, loading, error }) {
  const [mobile, setMobile] = useState('');
  const [countryCode, setCountryCode] = useState('91');
  const [password, setPassword] = useState('');

  function submit(event) {
    event.preventDefault();
    onLogin({ mobile: mobile.trim(), country_code: countryCode.trim(), password });
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#060b17] px-4 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,193,7,.13),transparent_55%)]" />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-3xl border-2 border-[#70451c] bg-gradient-to-b from-[#2b190b]/95 to-[#100b08]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,.75)] sm:p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl border border-[#ffc107]/70 bg-[#42220b] text-[#ffc107] shadow-[0_0_24px_rgba(255,193,7,.2)]">
            <LockKeyhole className="size-7" />
          </div>
          <h1 className="text-2xl font-black tracking-wide text-[#ffe396]">Mines Login</h1>
          <p className="mt-1 text-sm text-[#c6ae94]">Sign in to load your wallet and profile</p>
        </div>

        <label className="mb-4 block text-sm font-semibold text-[#e6d0ba]">
          Mobile number
          <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#68421f] bg-black/30 px-3 focus-within:border-[#ffc107]">
            <Phone className="size-4 shrink-0 text-[#ffc107]" />
            <input value={countryCode} onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, '').slice(0, 4))} inputMode="numeric" aria-label="Country code" required className="h-11 w-12 bg-transparent text-white outline-none" />
            <span className="text-[#826d58]">|</span>
            <input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 15))} inputMode="numeric" autoComplete="tel-national" required className="h-11 min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-[#826d58]" placeholder="Mobile number" />
          </span>
        </label>

        <label className="mb-4 block text-sm font-semibold text-[#e6d0ba]">
          Password
          <span className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#68421f] bg-black/30 px-3 focus-within:border-[#ffc107]">
            <LockKeyhole className="size-4 shrink-0 text-[#ffc107]" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="h-11 min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-[#826d58]" placeholder="Enter password" />
          </span>
        </label>

        {error && <p role="alert" className="mb-4 rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-gradient-to-b from-[#ffd36e] to-[#f28c1c] py-3 font-black text-[#2a1600] shadow-[0_4px_0_#b8620a] transition hover:brightness-110 active:translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </main>
  );
}
