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
import loaderBg from '../assets/icons/loaderbg.png';

const ASSETS = [
  loaderBg,
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

// Helper to calculate SVG arc path for circular segments
function describeArc(cx, cy, r, startAngleDeg, endAngleDeg) {
  const startRad = (startAngleDeg * Math.PI) / 180;
  const endRad = (endAngleDeg * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? 0 : 1;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// EXACT CALIBRATED COORDINATES:
const RING_CX = 828;
const RING_CY = 399;
const RING_R = 182;
const RING_SPAN = 270;
const RING_START = 135;
const TOTAL_RING_SEGMENTS = 20;
const STROKE_WIDTH = 18;

const BAR_X = 567;
const BAR_Y = 737;
const BAR_W = 523;
const BAR_H = 39;
const BAR_RX = BAR_H / 2;

// Precompute calibrated ring segments with clean visible separation gap between thick segments
const SEG_STEP = RING_SPAN / TOTAL_RING_SEGMENTS;
const SEG_LEN = 5.8; // Calibrated arc length for 18px stroke to create a distinct clean gap
const SEG_GAP = (SEG_STEP - SEG_LEN) / 2;

const RING_SEGMENTS = Array.from({ length: TOTAL_RING_SEGMENTS }, (_, i) => {
  const s = RING_START + i * SEG_STEP + SEG_GAP;
  const e = s + SEG_LEN;
  return {
    index: i,
    path: describeArc(RING_CX, RING_CY, RING_R, s, e),
  };
});

export default function GameLoader({ onLoaded }) {
  const [progress, setProgress] = useState(0);
  const [stepText, setStepText] = useState(LOADING_STEPS[0]);
  const [fadingOut, setFadingOut] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isMobile = isMobileDevice();
  const transitionedRef = useRef(false);

  // Clear any temporary calibration data from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('mines_loader_calib_config');
    } catch {
      // ignore
    }
  }, []);

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
            }, 400);
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

  // How many segments should be lit up right now
  const litSegmentsCount = Math.floor((progress / 100) * TOTAL_RING_SEGMENTS);

  // Dynamic fill width matching progress
  const currentFillWidth = Math.max(BAR_RX * 2, (progress / 100) * BAR_W);

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
      className={`fixed inset-0 z-[200] flex items-center justify-center select-none overflow-hidden bg-[#040812] transition-opacity duration-500 cursor-pointer ${
        fadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* 1. Background Image: Clean Artwork */}
      <img
        src={loaderBg}
        alt="Loading Mines..."
        className="pointer-events-none absolute inset-0 size-full object-cover object-center select-none"
      />

      {/* 2. Interactive SVG Overlay aligned 1:1 with loaderbg.png (1671 x 941) */}
      <svg
        viewBox="0 0 1671 941"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 size-full z-10"
        aria-hidden="true"
      >
        <defs>
          {/* Gradient for Active Ring Segments */}
          <linearGradient id="ringGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff8b5" />
            <stop offset="35%" stopColor="#ffea3d" />
            <stop offset="75%" stopColor="#ffb300" />
            <stop offset="100%" stopColor="#ff8f00" />
          </linearGradient>

          {/* Gradient for Bottom Yellow Loading Bar */}
          <linearGradient id="barGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff8000" />
            <stop offset="25%" stopColor="#ffb300" />
            <stop offset="65%" stopColor="#ffee55" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Diagonal Striped Pattern for Loading Bar */}
          <pattern
            id="barStripes"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="16" height="32" fill="rgba(255,255,255,0.22)" />
            <rect x="16" width="16" height="32" fill="transparent" />
          </pattern>

          {/* Clip path for the bottom bar fill */}
          <clipPath id="barClip">
            <rect
              x={BAR_X}
              y={BAR_Y}
              width={currentFillWidth}
              height={BAR_H}
              rx={BAR_RX}
              ry={BAR_RX}
            />
          </clipPath>
        </defs>

        {/* ========================================================
            A. CIRCULAR RING LIGHT (Clean crisp light segments, zero shadow)
            ======================================================== */}
        <g id="circular-ring-light">
          {RING_SEGMENTS.map(({ index, path }) => {
            const isLit = index < litSegmentsCount;

            if (isLit) {
              return (
                <g key={index}>
                  {/* Crisp vibrant yellow-gold light segment */}
                  <path
                    d={path}
                    fill="none"
                    stroke="url(#ringGoldGrad)"
                    strokeWidth={STROKE_WIDTH}
                    strokeLinecap="round"
                  />
                  {/* Clean white-hot inner core */}
                  <path
                    d={path}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={Math.max(2, STROKE_WIDTH * 0.32)}
                    strokeLinecap="round"
                    opacity="0.9"
                  />
                </g>
              );
            }

            // Inactive (unlit) segments: zero shadow
            return (
              <path
                key={index}
                d={path}
                fill="none"
                stroke="rgba(255, 215, 100, 0.08)"
                strokeWidth={Math.max(2, STROKE_WIDTH * 0.8)}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* ========================================================
            B. BOTTOM LOADING BAR (Inside the calibrated wooden slot box)
            ======================================================== */}
        <g id="bottom-loading-bar">
          {/* Subtle dark track background inside the box slot */}
          <rect
            x={BAR_X}
            y={BAR_Y}
            width={BAR_W}
            height={BAR_H}
            rx={BAR_RX}
            ry={BAR_RX}
            fill="rgba(12, 6, 2, 0.82)"
            stroke="rgba(255, 193, 7, 0.35)"
            strokeWidth="1.5"
          />

          {/* Yellow Progress Fill with Glow */}
          <g clipPath="url(#barClip)">
            {/* Base glowing gradient fill */}
            <rect
              x={BAR_X}
              y={BAR_Y}
              width={BAR_W}
              height={BAR_H}
              fill="url(#barGoldGrad)"
            />

            {/* Candy-striped animated overlay */}
            <rect
              x={BAR_X}
              y={BAR_Y}
              width={BAR_W}
              height={BAR_H}
              fill="url(#barStripes)"
              opacity="0.85"
            />

            {/* Top glossy reflection line */}
            <rect
              x={BAR_X + 6}
              y={BAR_Y + 2}
              width={BAR_W - 12}
              height="6"
              rx="3"
              fill="rgba(255, 255, 255, 0.6)"
            />
          </g>

          {/* Leading edge bright glowing head */}
          {progress > 2 && progress < 100 && (
            <circle
              cx={BAR_X + currentFillWidth - 6}
              cy={BAR_Y + BAR_H / 2}
              r="12"
              fill="#ffffff"
              opacity="0.9"
            />
          )}

          {/* Percentage text INSIDE the bottom loader box */}
          <text
            x={BAR_X + BAR_W / 2}
            y={BAR_Y + BAR_H * 0.68}
            textAnchor="middle"
            fill="#150802"
            fontSize={Math.round(BAR_H * 0.48)}
            fontWeight="950"
            letterSpacing="1"
            filter="drop-shadow(0 1px 1px rgba(255,255,255,0.75))"
          >
            {progress}%
          </text>

          {/* Status Text positioned BELOW the loader bar */}
          <text
            x={BAR_X + BAR_W / 2}
            y={BAR_Y + BAR_H + 52}
            textAnchor="middle"
            fill="#ffdb58"
            fontSize="16"
            fontWeight="900"
            letterSpacing="1.2"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.95))"
          >
            {stepText}
          </text>
        </g>
      </svg>

      {/* 3. Mobile "TAP TO PLAY (FULLSCREEN)" Call To Action */}
      {isMobile && isReady && (
        <div className="absolute z-30 bottom-[4%] animate-bounce">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              completeAndEnter();
            }}
            className="relative inline-flex items-center gap-2 rounded-2xl border-2 border-[#ffd700] bg-gradient-to-r from-[#ffd700] via-[#ff9800] to-[#ffd700] px-6 py-2.5 text-sm sm:text-base font-black text-[#1a0f05] shadow-[0_0_30px_rgba(255,215,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.8)] transition active:scale-95"
          >
            <Play className="size-4 fill-current" />
            <span>TAP TO PLAY (FULLSCREEN)</span>
            <Maximize className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
