import { BarChart2, Bomb, LayoutGrid } from 'lucide-react';
import { GRID_SIZE } from '../utils/gameLogic.js';
import diamondImg from '../assets/images/diamond.png';
import topBg from '../assets/icons/top.png';

function Row({ icon, label, value }) {
  return (
    <div
      className="mobile-land-details-row relative overflow-hidden flex items-center justify-between px-1.5 sm:px-2.5 md:px-3 rounded sm:rounded-xl border border-[#593214]/60 shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
    >
      {/* top.png background */}
      <img
        src={topBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-fill select-none opacity-90 brightness-105"
      />

      <div className="relative z-10 flex items-center gap-1 sm:gap-2">
        {icon}
        <span className="text-[9px] sm:text-xs md:text-sm font-bold text-[#e6d0ba] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {label}
        </span>
      </div>
      <span className="relative z-10 text-[10px] sm:text-xs md:text-base font-black tabular-nums tracking-wide text-[#ffdb58] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        {value}
      </span>
    </div>
  );
}

export default function GameDetails({ gemsLeft, mineRisk, opened }) {
  return (
    <section
      aria-label="Game details"
      className="mobile-land-details relative rounded-xl sm:rounded-2xl border border-[#593214] sm:border-2 bg-[#241307]/90 shadow-[inset_0_2px_8px_rgba(0,0,0,0.7)] shrink min-h-0 flex flex-col justify-between"
    >
      <div className="mobile-land-details-header relative overflow-hidden rounded-md sm:rounded-lg flex items-center">
        <img
          src={topBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-fill select-none brightness-110"
        />
        <BarChart2 className="relative z-10 size-2.5 sm:size-3.5 md:size-4 text-[#ffc107]" aria-hidden="true" />
        <span className="relative z-10 font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-wide">
          Game Details
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between min-h-0 gap-0.5 sm:gap-1">
        {/* Gems Left */}
        <Row
          icon={
            <img
              src={diamondImg}
              alt="Gems"
              className="size-2.5 sm:size-3.5 md:size-4 object-contain drop-shadow-[0_0_6px_rgba(0,210,255,0.8)]"
            />
          }
          label="Gems left"
          value={gemsLeft}
        />

        {/* Mine Risk */}
        <Row
          icon={<Bomb className="size-2.5 sm:size-3.5 md:size-4 text-[#ff9800]" aria-hidden="true" />}
          label="Mine risk"
          value={`${mineRisk.toFixed(2)}%`}
        />

        {/* Opened Tiles */}
        <Row
          icon={<LayoutGrid className="size-2.5 sm:size-3.5 md:size-4 text-[#ffc107]" aria-hidden="true" />}
          label="Opened tiles"
          value={`${opened} / ${GRID_SIZE}`}
        />
      </div>
    </section>
  );
}
