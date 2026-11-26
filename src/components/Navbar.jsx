import { useEffect, useRef, useState } from 'react';
import { Crown, Maximize, Plus, RotateCcw, Trophy, Wallet } from 'lucide-react';
import { formatMoney } from '../utils/gameLogic.js';
import { isMobileDevice, toggleMobileFullscreen } from '../utils/fullscreen.js';
import LeaderboardModal from './LeaderboardModal.jsx';
import leftArrowBtn from '../assets/icons/Left Arrow Button.png';
import leaderboardLogo from '../assets/icons/leaderboard.png';
import settingIcon from '../assets/icons/setting.png';
import volumeIcon from '../assets/icons/vollume.png';
import topBg from '../assets/icons/top.png';

function SettingsMenu({ onResetDemo }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (e.type === 'keydown' ? e.key === 'Escape' : !ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex items-center shrink-0">
      {/* Settings button - background removed, enlarged to match top bar buttons */}
      <button
        type="button"
        aria-label="Settings"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="mobile-land-icon-btn relative flex items-center justify-center h-8 sm:h-11 md:h-16 lg:h-18 w-auto shrink-0 transition hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
      >
        <img
          src={settingIcon}
          alt="Settings"
          className="h-full w-auto object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)] select-none"
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 animate-fade-in rounded-2xl border-2 border-[#593214] bg-[#1f1107]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-xl">
          <p className="text-sm font-bold text-[#ffe396]">Demo Mode</p>
          <p className="mt-1 text-xs leading-relaxed text-[#d8c2aa]">
            Virtual credits only. Mines and payouts are generated locally.
          </p>
          <button
            type="button"
            onClick={() => {
              onResetDemo();
              setOpen(false);
            }}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#593214] bg-[#2b170a] py-2 text-xs sm:text-sm font-bold text-white transition hover:border-[#ffc107] hover:text-[#ffc107] active:scale-95"
          >
            <RotateCcw className="size-4" /> Reset demo balance
          </button>
          {isMobileDevice() && (
            <button
              type="button"
              onClick={() => {
                toggleMobileFullscreen();
                setOpen(false);
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#593214] bg-[#2b170a] py-2 text-xs sm:text-sm font-bold text-[#ffdb58] transition hover:border-[#ffc107] active:scale-95"
            >
              <Maximize className="size-4" /> Toggle Fullscreen
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ balance, soundOn, onToggleSound, onAddFunds, onResetDemo, navHeight, logoHeight }) {
  const [activeTab, setActiveTab] = useState('lobby');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <>
      {/* Top Header: Floating prominently with ALL items matching one uniform large size */}
      <header className="mobile-land-header relative z-20 w-full bg-transparent pt-0.5 sm:pt-2 px-1.5 sm:px-4 md:px-6">
        <div
          className="mobile-land-nav-row mx-auto flex h-9 sm:h-12 md:h-[72px] lg:h-[78px] max-w-[1400px] items-center justify-between gap-1 sm:gap-2.5 md:gap-4"
          style={navHeight ? { height: `${navHeight}px` } : undefined}
        >
          {/* Left section: [1] Arrow Button (Enlarged) + [2] Leaderboard.png as Logo */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Back Button (Left Arrow Button.png) - Enlarged to match uniform height */}
            <div className="relative flex items-center shrink-0">
              <button
                type="button"
                aria-label="Back"
                onClick={() => window.history.length > 1 && window.history.back()}
                className="mobile-land-icon-btn relative flex items-center justify-center h-8 sm:h-11 md:h-16 lg:h-18 w-auto shrink-0 transition hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
                style={logoHeight ? { height: `${logoHeight}px` } : undefined}
              >
                <img
                  src={leftArrowBtn}
                  alt="Back"
                  className="h-full w-auto object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)] select-none"
                />
              </button>
            </div>

            {/* Logo (leaderboard.png) - Uniform height */}
            <div className="relative flex items-center shrink-0">
              <img
                src={leaderboardLogo}
                alt="Logo"
                className="mobile-land-logo h-8 sm:h-11 md:h-16 lg:h-18 w-auto max-w-[120px] sm:max-w-[180px] md:max-w-[260px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] drop-shadow-[0_0_20px_rgba(255,193,7,0.35)] select-none transition-transform hover:scale-105"
                style={logoHeight ? { height: `${logoHeight}px` } : undefined}
              />
            </div>
          </div>

          {/* Right section: Lobby + Leader Board + Balances + Sound + Settings */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3.5 shrink-0">
            {/* Lobby Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveTab('lobby')}
                className="mobile-land-nav-btn relative overflow-hidden flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-2xl h-8 sm:h-11 md:h-16 lg:h-18 px-2 sm:px-3 md:px-5 lg:px-6 text-[10px] sm:text-xs md:text-sm lg:text-base font-black transition active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.6)]"
              >
                <img
                  src={topBg}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full object-fill select-none"
                />
                <span className="relative z-10 flex items-center gap-1 sm:gap-1.5 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  <Crown className="size-3.5 sm:size-4 md:size-5 lg:size-6 text-[#ffc107]" />
                  <span>Lobby</span>
                </span>
              </button>
            </div>

            {/* Leader Board Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLeaderboard(true)}
                className="mobile-land-nav-btn relative overflow-hidden flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-2xl h-8 sm:h-11 md:h-16 lg:h-18 px-2 sm:px-3 md:px-5 lg:px-6 text-[10px] sm:text-xs md:text-sm lg:text-base font-black transition active:scale-95 shadow-[0_4px_14px_rgba(0,0,0,0.6)]"
              >
                <img
                  src={topBg}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full object-fill select-none"
                />
                <span className="relative z-10 flex items-center gap-1 sm:gap-1.5 text-[#ffe396] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                  <Trophy className="size-3.5 sm:size-4 md:size-5 lg:size-6 text-[#ffc107]" />
                  <span>Leader Board</span>
                </span>
              </button>
            </div>

            {/* Balances Widget */}
            <div className="relative">
              <div className="mobile-land-balance-box relative overflow-hidden flex items-center gap-1.5 sm:gap-2.5 rounded-lg sm:rounded-2xl h-8 sm:h-11 md:h-16 lg:h-18 px-2 sm:px-3.5 md:px-5 shadow-[0_4px_14px_rgba(0,0,0,0.6)]">
                <img
                  src={topBg}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 size-full object-fill select-none"
                />
                <div className="relative z-10 flex items-center gap-1 sm:gap-2">
                  <Wallet className="size-3.5 sm:size-4 md:size-5 lg:size-6 text-[#ffc107]" aria-hidden="true" />
                  <span className="text-xs sm:text-sm text-[#e6d0ba] font-bold hidden xl:inline drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    Balance:
                  </span>
                  <span
                    className="text-xs sm:text-sm md:text-base lg:text-lg font-black tabular-nums tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
                    aria-live="polite"
                  >
                    {formatMoney(balance)}
                  </span>
                  <button
                    type="button"
                    aria-label="Add ₹500 demo balance"
                    onClick={onAddFunds}
                    className="mobile-land-balance-plus grid size-5 sm:size-6 md:size-8 lg:size-9 place-items-center rounded bg-gradient-to-b from-[#ffd666] via-[#faad14] to-[#f59e0b] text-[#241500] font-black shadow-[0_0_10px_rgba(250,173,20,0.7)] transition hover:brightness-110 active:scale-95 ml-0.5 sm:ml-1"
                  >
                    <Plus className="size-3 sm:size-3.5 md:size-4.5 stroke-[3]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Sound Toggle using vollume.png without background box */}
            <div className="relative flex items-center shrink-0">
              <button
                type="button"
                aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
                aria-pressed={soundOn}
                onClick={onToggleSound}
                className="mobile-land-icon-btn relative flex items-center justify-center h-8 sm:h-11 md:h-16 lg:h-18 w-auto shrink-0 transition hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-[#ffc107]"
              >
                <img
                  src={volumeIcon}
                  alt={soundOn ? 'Sound On' : 'Sound Muted'}
                  className={`h-full w-auto object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.85)] select-none transition-all ${
                    soundOn ? 'brightness-100' : 'brightness-90 opacity-80'
                  }`}
                />

                {/* Diagonal Mute Slash Line */}
                {!soundOn && (
                  <svg
                    viewBox="0 0 100 100"
                    className="pointer-events-none absolute inset-0 size-full z-10 drop-shadow-[0_2px_5px_rgba(0,0,0,0.95)]"
                    aria-hidden="true"
                  >
                    <line
                      x1="22"
                      y1="22"
                      x2="78"
                      y2="78"
                      stroke="#000000"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                    <line
                      x1="22"
                      y1="22"
                      x2="78"
                      y2="78"
                      stroke="#ff3333"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Settings Button */}
            <SettingsMenu onResetDemo={onResetDemo} />
          </div>
        </div>
      </header>

      {/* Leaderboard Popup Modal */}
      {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
    </>
  );
}
