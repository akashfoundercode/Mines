import { useState, useEffect } from 'react';
import Background from './components/Background.jsx';
import Navbar from './components/Navbar.jsx';
import BettingPanel from './components/BettingPanel.jsx';
import GameBoard from './components/GameBoard.jsx';
import RotatePrompt from './components/RotatePrompt.jsx';
import GameLoader from './components/GameLoader.jsx';
import { useMinesGame } from './hooks/useMinesGame.js';
import { isMobileDevice, isFullscreenActive, requestMobileFullscreen } from './utils/fullscreen.js';
import twinWoodPanels from './assets/images/Twin Carved Wood UI Panels.png';

export default function App() {
  const game = useMinesGame();
  const [loading, setLoading] = useState(true);

  // STRICTLY MOBILE ONLY: ensure mobile touch interactions maintain fullscreen
  useEffect(() => {
    if (!isMobileDevice()) return;

    const handleMobileTouch = () => {
      if (!isFullscreenActive()) {
        requestMobileFullscreen();
      }
    };

    window.addEventListener('touchstart', handleMobileTouch, { passive: true });
    window.addEventListener('click', handleMobileTouch, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleMobileTouch);
      window.removeEventListener('click', handleMobileTouch);
    };
  }, []);

  return (
    <div className="relative h-screen h-dvh w-screen overflow-hidden bg-[#060b17] font-sans text-white select-none flex flex-col">
      <Background />

      {/* Tagda Preloader: Preloads all assets with progress bar & animations */}
      {loading && <GameLoader onLoaded={() => setLoading(false)} />}

      {/* Mobile Landscape Enforcer Screen */}
      <RotatePrompt />
      <div className="relative z-10 flex h-full w-full flex-col overflow-hidden">
        <Navbar
          balance={game.balance}
          soundOn={game.soundOn}
          onToggleSound={game.toggleSound}
          onAddFunds={game.addFunds}
          onResetDemo={game.resetDemo}
          navHeight={87}
          logoHeight={66}
        />

        {/* Main Stage: Fully responsive with ZERO SCROLLBARS */}
        <main className="mobile-land-main flex-1 flex items-center justify-center p-0.5 sm:p-2 overflow-hidden min-h-0 w-full">
          <div
            className="relative shrink-0 aspect-[1774/887] drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] select-none"
            style={{
              width: 'min(98vw, calc((100dvh - var(--nav-height, 87px)) * 2))',
              height: 'min(49vw, calc(100dvh - var(--nav-height, 87px)))',
              containerType: 'size',
              transform: 'scale(0.95)',
            }}
          >
            {/* The EXACT single 1 image containing both carved wood panels */}
            <img
              src={twinWoodPanels}
              alt="Twin Carved Wood UI Panels"
              className="pointer-events-none absolute inset-0 size-full object-fill select-none"
            />

            {/* Left Panel UI Overlay (Calibrated & Fully Responsive) */}
            <div
              className="absolute flex flex-col justify-between p-0.5 sm:p-1 md:p-1.5 overflow-hidden"
              style={{
                top: '6.7%',
                bottom: '5.1%',
                left: '7.3%',
                width: '28.5%',
                borderRadius: '9px',
                transform: 'scale(0.98)',
                transformOrigin: 'top left',
              }}
            >
              <BettingPanel game={game} />
            </div>

            {/* Right Panel UI Overlay (Calibrated & Fully Responsive) */}
            <div
              className="absolute flex flex-col justify-between p-0.5 sm:p-1 md:p-1.5 overflow-hidden"
              style={{
                top: '7.7%',
                bottom: '5.7%',
                left: '42%',
                width: '51.8%',
                borderRadius: '16px',
              }}
            >
              <GameBoard game={game} radius={16} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
