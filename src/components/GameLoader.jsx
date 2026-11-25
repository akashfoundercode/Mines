import { useEffect, useState, useRef } from 'react';
import { Play, Maximize } from 'lucide-react';
import { isMobileDevice, requestMobileFullscreen } from '../utils/fullscreen.js';
import diamondImg from '../assets/images/diamond.png';
import bombImg from '../assets/images/BOMB.png';
import minesBg from '../assets/images/MINES.png';
import twinWoodPanels from '../assets/images/Twin Carved Wood UI Panels.png';
import bombBgImg from '../assets/images/bomb_bg.png';
import boxesImg from '../assets/icons/boxes.png';
import topBg from '../assets/icons/top.png';
import betBg from '../assets/icons/bet.png';
import leaderboardLogo from '../assets/icons/leaderboard.png';
import leftArrowBtn from '../assets/icons/Left Arrow Button.png';
import settingIcon from '../assets/icons/setting.png';
import volumeIcon from '../assets/icons/vollume.png';

const ASSETS = [
  minesBg,
  twinWoodPanels,
  diamondImg,
  bombImg,
  bombBgImg,
  boxesImg,
  topBg,
  betBg,
  leaderboardLogo,
  leftArrowBtn,
  settingIcon,
  volumeIcon,
];

const LOADING_STEPS = [
  'Entering the deep mine cave...',
  'Polishing sparkling diamonds...',
  'Carefully arming mystery bombs...',
  'Preparing carved wooden grid...',
  'Ready to strike gold!',
];

export default function GameLoader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState(LOADING_STEPS[0]);
  const [fadingOut, setFadingOut] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isMobile = isMobileDevice();
  const transitionedRef = useRef(false);

  const completeAndEnter = () => {
    if (transitionedRef.current) return;
    transitionedRef.current = true;

    if (isMobile) {
      requestMobileFullscreen();
    }

    setFadingOut(true);
    setTimeout(() => {
      onLoaded?.();
    }, 500);
  };

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = ASSETS.length;

    // Minimum visual display duration for smooth dramatic effect
    const startTime = Date.now();
    const minDuration = 1800; // 1.8s

    const updateProgress = () => {
      loadedCount++;
      const assetRatio = loadedCount / totalAssets;
      const elapsed = Date.now() - startTime;
      const timeRatio = Math.min(elapsed / minDuration, 1);

      // Smooth progress calculation
      const currentVal = Math.floor(Math.min(assetRatio, timeRatio) * 100);
      setProgress(currentVal);

      const stepIndex = Math.min(
        Math.floor((currentVal / 100) * LOADING_STEPS.length),
        LOADING_STEPS.length - 1
      );
      setStepText(LOADING_STEPS[stepIndex]);
    };

    // Preload all assets in memory
    ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = updateProgress;
    });

    // Smooth ticker interval ensuring progress advances steadily to 100%
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeRatio = Math.min(elapsed / minDuration, 1);
      const targetPercent = Math.floor(timeRatio * 100);

      setProgress((prev) => {
        const next = Math.max(prev, targetPercent);
        const stepIndex = Math.min(
          Math.floor((next / 100) * LOADING_STEPS.length),
          LOADING_STEPS.length - 1
        );
        setStepText(LOADING_STEPS[stepIndex]);

        if (next >= 100) {
          clearInterval(interval);
          setIsReady(true);

          if (!isMobile) {
            // Desktop: Auto-transition smoothly without requiring any gesture
            setTimeout(() => {
              completeAndEnter();
            }, 350);
          } else {
            // Mobile: Allow a 3.5s auto-fallback just in case, but user tap is prompted
            setTimeout(() => {
              completeAndEnter();
            }, 3500);
          }
        }
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        if (isMobile) {
          completeAndEnter();
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          completeAndEnter();
        }
      }}
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center select-none overflow-hidden bg-[#040812] transition-opacity duration-500 cursor-pointer ${
        fadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Background Cave Artwork with dark vignette */}
      <img
        src={minesBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-35 filter blur-[2px]"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(6, 11, 23, 0.7) 0%, rgba(2, 5, 12, 0.95) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Floating Animated Sparks / Embers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <span className="absolute top-[20%] left-[15%] size-1.5 rounded-full bg-[#00d2ff] blur-[1px] animate-ping [animation-duration:3s]" />
        <span className="absolute top-[65%] left-[80%] size-2 rounded-full bg-[#ffc107] blur-[1px] animate-ping [animation-duration:2.5s]" />
        <span className="absolute top-[35%] right-[20%] size-1.5 rounded-full bg-[#ff4d4f] blur-[1px] animate-ping [animation-duration:3.5s]" />
        <span className="absolute bottom-[25%] left-[30%] size-2 rounded-full bg-[#ffd700] blur-[1px] animate-ping [animation-duration:2.2s]" />
      </div>

      {/* Loader Center Showcase Card */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center">
        {/* Game Logo */}
        <div className="relative mb-5 sm:mb-6">
          <img
            src={leaderboardLogo}
            alt="Mines"
            className="h-16 sm:h-24 w-auto object-contain drop-shadow-[0_0_35px_rgba(255,193,7,0.6)] drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
          />
        </div>

        {/* Orbiting / Pulsating Diamond & Bomb Artifacts */}
        <div className="relative mb-6 sm:mb-8 flex size-24 sm:size-28 items-center justify-center">
          {/* Cyan/Gold glowing portal halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00d2ff]/30 via-[#ffc107]/25 to-[#ff4d4f]/30 blur-xl animate-pulse [animation-duration:2s]" />
          <div className="absolute inset-2 rounded-full border border-[#ffe066]/40 animate-spin [animation-duration:8s]" />

          {/* Glowing Diamond */}
          <img
            src={diamondImg}
            alt="Diamond"
            className="absolute left-1 top-2 size-12 sm:size-16 object-contain drop-shadow-[0_0_20px_rgba(0,210,255,0.95)] animate-bounce [animation-duration:2.2s]"
          />

          {/* Menacing Bomb */}
          <img
            src={bombImg}
            alt="Bomb"
            className="absolute right-0 bottom-2 size-11 sm:size-14 object-contain drop-shadow-[0_0_18px_rgba(255,60,20,0.95)] animate-pulse [animation-duration:1.8s]"
          />
        </div>

        {/* Progress Bar Container */}
        <div className="relative w-full rounded-2xl border-2 border-[#8e5223] bg-[#140b04]/90 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.9),inset_0_2px_8px_rgba(0,0,0,0.85)]">
          {/* Progress fill bar */}
          <div
            className="relative h-3.5 sm:h-5 rounded-xl overflow-hidden transition-all duration-150 ease-out"
            style={{
              width: `${progress}%`,
              background:
                'linear-gradient(90deg, #ff9800 0%, #ffc107 40%, #00d2ff 85%, #00f0ff 100%)',
              boxShadow: '0 0 20px rgba(0, 210, 255, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
            }}
          >
            {/* Animated shine line inside progress */}
            <span
              className="absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/70 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Numeric Progress Percentage & Step Status Text */}
        <div className="w-full mt-2.5 sm:mt-3 flex items-center justify-between text-xs sm:text-sm font-black text-[#e6d0ba]">
          <span className="text-[#ffe396] tracking-wide animate-pulse drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate max-w-[70%]">
            {stepText}
          </span>
          <span className="font-mono text-xs sm:text-base text-[#00d2ff] drop-shadow-[0_0_10px_rgba(0,210,255,0.8)]">
            {progress}%
          </span>
        </div>

        {/* Mobile-Only Interactive "TAP TO PLAY (FULLSCREEN)" Call To Action */}
        {isMobile && isReady && (
          <div className="mt-5 animate-bounce">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                completeAndEnter();
              }}
              className="relative inline-flex items-center gap-2 rounded-2xl border-2 border-[#ffd700] bg-gradient-to-r from-[#ffd700] via-[#ff9800] to-[#ffd700] px-6 py-2.5 text-sm sm:text-base font-black text-[#1a0f05] shadow-[0_0_25px_rgba(255,215,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.8)] transition active:scale-95"
            >
              <Play className="size-4 fill-current" />
              <span>TAP TO PLAY (FULLSCREEN)</span>
              <Maximize className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
