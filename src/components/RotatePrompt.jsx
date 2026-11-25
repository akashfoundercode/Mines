import { useEffect, useState } from 'react';
import { Smartphone, RotateCw, Maximize } from 'lucide-react';
import { requestMobileFullscreen } from '../utils/fullscreen.js';
import topBg from '../assets/icons/top.png';

export default function RotatePrompt() {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Mobile or tablet device (width < 1024) in portrait orientation
      const portrait =
        window.matchMedia('(orientation: portrait) and (max-width: 1024px)').matches ||
        (window.innerHeight > window.innerWidth && window.innerWidth < 1024);
      setIsPortrait(portrait);
    };

    checkOrientation();

    const media = window.matchMedia('(orientation: portrait) and (max-width: 1024px)');
    media.addEventListener?.('change', checkOrientation);
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    return () => {
      media.removeEventListener?.('change', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  if (!isPortrait) return null;

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-label="Rotate device to landscape"
      onClick={requestMobileFullscreen}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#040812]/95 backdrop-blur-2xl select-none animate-fade-in cursor-pointer"
    >
      {/* Background ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(255, 189, 69, 0.25) 0%, rgba(0, 210, 255, 0.15) 50%, transparent 80%)',
        }}
        aria-hidden="true"
      />

      {/* Center Prompt Card with carved plate look */}
      <div className="relative max-w-sm w-full rounded-3xl border-2 border-[#8e5223] bg-gradient-to-b from-[#2b170a] to-[#140b04] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(255,189,69,0.2)]">
        {/* top.png background banner plate */}
        <img
          src={topBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-fill rounded-3xl opacity-35"
        />

        {/* Animated Rotating Phone Device */}
        <div className="relative mx-auto mb-6 flex size-28 items-center justify-center">
          {/* Glowing pulse ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#ffc107]/40 animate-spin [animation-duration:10s]" />
          <div className="absolute inset-2 rounded-full bg-[#ffc107]/10 blur-md" />

          {/* Rotating smartphone icon */}
          <div className="relative animate-phone-rotate flex items-center justify-center">
            <Smartphone className="size-16 text-[#ffdb58] drop-shadow-[0_0_20px_rgba(255,219,88,0.85)]" />
          </div>

          {/* Circular Rotation Arrows */}
          <RotateCw className="pointer-events-none absolute -bottom-1 -right-1 size-7 text-[#00d2ff] animate-pulse drop-shadow-[0_0_10px_rgba(0,210,255,0.8)]" />
        </div>

        {/* Heading */}
        <h2 className="relative z-10 text-xl font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
          Rotate Your Device
        </h2>
        <p className="relative z-10 text-sm font-black text-[#ffdb58] mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          फोन को Landscape में घुमाएँ
        </p>

        {/* Explanation text */}
        <p className="relative z-10 mt-3 text-xs leading-relaxed text-[#d8c2aa] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          Ye game mobile me <strong>Landscape mode</strong> me hi chalega. Kripya behtar anubhav ke liye apne phone ko horizontal turn karein.
        </p>

        {/* Golden badge indicating landscape requirement */}
        <div className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-xl border border-[#ffe066] bg-gradient-to-r from-[#ffe066]/20 via-[#ffc107]/30 to-[#ffe066]/20 px-4 py-2 text-xs font-black text-[#ffdb58] shadow-[0_0_15px_rgba(255,193,7,0.35)]">
          <span className="size-2 rounded-full bg-[#00ff88] animate-ping" />
          <span>Landscape Mode Required</span>
        </div>
      </div>
    </aside>
  );
}
