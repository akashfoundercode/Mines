import { memo } from 'react';
import ExplosionFx, { Cracks } from './ExplosionFx.jsx';
import bombBgImg from '../assets/images/bomb_bg.png';
import bombImg from '../assets/images/BOMB.png';
import diamondImg from '../assets/images/diamond.png';

/**
 * state: 'hidden' | 'gem' | 'exploded' | 'ghostGem' | 'ghostMine'
 */
const BASE =
  'relative aspect-square w-full rounded-xl sm:rounded-2xl border outline-none transition-[transform,box-shadow,border-color,background-color] duration-200 focus-visible:ring-2 focus-visible:ring-[#ffc107] select-none';

const SKIN = {
  hidden:
    'overflow-hidden border-2 border-[#8e5223] bg-gradient-to-br from-[#7d4a22] via-[#5e3415] to-[#3a1d09] shadow-[inset_0_1px_2px_rgba(255,215,140,0.45),0_4px_8px_rgba(0,0,0,0.7)]',
  gem: 'overflow-hidden border-2 border-[#00d2ff] bg-gradient-to-b from-[#093a74] to-[#052144] shadow-[0_0_24px_rgba(0,210,255,0.8),inset_0_0_18px_rgba(0,210,255,0.45)]',
  exploded:
    'z-20 overflow-visible border-transparent bg-transparent shadow-[0_0_40px_rgba(255,77,79,0.8)]',
  ghostGem:
    'overflow-hidden border-2 border-[#543015] bg-gradient-to-br from-[#4a2b13] to-[#251307] shadow-[0_3px_6px_rgba(0,0,0,0.6)]',
  ghostMine:
    'z-10 overflow-visible border-transparent bg-transparent shadow-[0_3px_0_#050a14]',
};

const HOVER =
  'cursor-pointer hover:-translate-y-0.5 hover:border-[#ffbd45] hover:shadow-[0_0_16px_rgba(255,189,69,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] active:translate-y-1 active:scale-[0.97] active:shadow-[0_1px_0_#050a14]';

function GameTile({ index, state, interactive, onSelect }) {
  const isHidden = state === 'hidden';
  const clickable = isHidden && interactive;
  const ghostDelay = { animationDelay: `${(index % 5) * 45 + Math.floor(index / 5) * 25}ms` };

  let content = null;
  if (isHidden) {
    content = (
      <>
        {/* Diagonal wood plank grain overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 9px, rgba(0,0,0,0.2) 9px, rgba(0,0,0,0.2) 12px)',
          }}
          aria-hidden="true"
        />

        {/* 4 Corner Screws / Rivets */}
        <span className="pointer-events-none absolute top-1.5 left-1.5 size-1.5 rounded-full bg-[#dbe0ec] shadow-[inset_0_1px_1px_#fff,0_1px_2px_#000]" />
        <span className="pointer-events-none absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#dbe0ec] shadow-[inset_0_1px_1px_#fff,0_1px_2px_#000]" />
        <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-1.5 rounded-full bg-[#dbe0ec] shadow-[inset_0_1px_1px_#fff,0_1px_2px_#000]" />
        <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-1.5 rounded-full bg-[#dbe0ec] shadow-[inset_0_1px_1px_#fff,0_1px_2px_#000]" />

        {/* Carved 3D Golden Question Mark (?) matching reference */}
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-black text-[#ffe396] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_0_8px_rgba(255,200,80,0.35)]">
          ?
        </span>
      </>
    );
  } else if (state === 'gem') {
    content = (
      <>
        {/* Cyan light reflection puddle under the gem */}
        <span
          className="absolute bottom-2 left-1/2 h-2.5 w-3/4 -translate-x-1/2 rounded-full bg-[#00d2ff]/60 blur-sm"
          aria-hidden="true"
        />
        {/* Gem burst pulse */}
        <span
          className="absolute left-1/2 top-1/2 size-3/4 -translate-x-1/2 -translate-y-1/2 animate-gem-burst rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(200,250,255,0.95) 0%, rgba(0,210,255,0.5) 40%, transparent 70%)',
          }}
        />
        {/* Real 3D Faceted Sparkling Diamond PNG */}
        <img
          src={diamondImg}
          alt="Diamond"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[68%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 animate-gem-pop object-contain drop-shadow-[0_0_18px_rgba(0,210,255,0.95)] drop-shadow-[0_0_35px_rgba(0,180,255,0.5)]"
        />
      </>
    );
  } else if (state === 'exploded') {
    content = (
      <div className="relative size-full animate-tile-vibrate overflow-visible">
        {/* 1. Bomb Explosion Background (bomb_bg.png) behind the bomb */}
        <img
          src={bombBgImg}
          alt="Explosion Blast Background"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[108%] w-[108%] max-w-none animate-bomb-bg-flash object-contain drop-shadow-[0_0_30px_rgba(255,100,20,0.9)]"
        />

        {/* 2. Glass Cracks */}
        <Cracks />

        {/* 3. Nuclear flash, shockwave rings, smoke clouds, and flying debris */}
        <ExplosionFx />

        {/* 4. Foreground: Bomb erupts out of the background explosion towards the screen */}
        <img
          src={bombImg}
          alt="Bomb Detonated"
          className="pointer-events-none absolute left-1/2 top-1/2 z-25 h-[88%] w-auto max-w-none animate-bomb-launch object-contain drop-shadow-[0_0_25px_rgba(255,60,20,0.85)]"
        />

        {/* 5. Fiery breathing heat aura */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 size-[140%] animate-fire-pulse rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,100,0,0.55) 0%, rgba(255,40,0,0.2) 45%, transparent 70%)',
          }}
        />
      </div>
    );
  } else if (state === 'ghostGem') {
    content = (
      <img
        src={diamondImg}
        alt="Diamond"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[52%] w-auto -translate-x-1/2 -translate-y-1/2 animate-tile-reveal object-contain opacity-45 saturate-60"
        style={ghostDelay}
      />
    );
  } else if (state === 'ghostMine') {
    content = (
      <div className="relative size-full overflow-visible">
        <img
          src={bombBgImg}
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[102%] w-[102%] max-w-none -translate-x-1/2 -translate-y-1/2 animate-tile-reveal object-contain opacity-55 saturate-80"
          style={ghostDelay}
        />
        <img
          src={bombImg}
          alt="Bomb"
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[80%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 animate-tile-reveal object-contain opacity-75 drop-shadow-[0_0_12px_rgba(255,80,20,0.6)]"
          style={ghostDelay}
        />
      </div>
    );
  }

  const label = {
    hidden: `Tile ${index + 1}`,
    gem: `Tile ${index + 1}: diamond`,
    exploded: `Tile ${index + 1}: bomb exploded`,
    ghostGem: `Tile ${index + 1}: diamond (not opened)`,
    ghostMine: `Tile ${index + 1}: bomb`,
  }[state];

  return (
    <button
      type="button"
      aria-label={label}
      disabled={!clickable}
      onClick={() => onSelect(index)}
      className={`${BASE} ${SKIN[state]} ${clickable ? HOVER : 'cursor-default'}`}
    >
      {content}
    </button>
  );
}

export default memo(GameTile);
