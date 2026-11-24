import { BarChart2, Bomb, LayoutGrid } from 'lucide-react';
import { GRID_SIZE } from '../utils/gameLogic.js';
import diamondImg from '../assets/images/diamond.png';
import topBg from '../assets/icons/top.png';

function Row({ icon, label, value }) {
  return (
    <div className="relative overflow-hidden flex items-center justify-between py-1 sm:py-1.5 px-2.5 sm:px-3 rounded-lg sm:rounded-xl my-1 border border-[#593214]/60 shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
      {/* top.png background */}
      <img
        src={topBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-fill select-none opacity-90 brightness-105"
      />

      <div className="relative z-10 flex items-center gap-1.5 sm:gap-2">
        {icon}
        <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#e6d0ba] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {label}
        </span>
      </div>
      <span className="relative z-10 text-xs sm:text-sm md:text-base font-black tabular-nums tracking-wide text-[#ffdb58] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        {value}
      </span>
    </div>
  );
}

export default function GameDetails({ gemsLeft, mineRisk, opened }) {
  return (
    <section
      aria-label="Game details"
      className="relative rounded-xl sm:rounded-2xl border-2 border-[#593214] bg-[#241307]/90 p-2 sm:p-2.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.7)]"
    >
      <div className="relative overflow-hidden rounded-lg px-2.5 py-1 mb-1.5 flex items-center gap-1.5">
        <img
          src={topBg}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full object-fill select-none brightness-110"
        />
        <BarChart2 className="relative z-10 size-3.5 sm:size-4 text-[#ffc107]" aria-hidden="true" />
        <span className="relative z-10 text-xs sm:text-sm md:text-base font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tracking-wide">
          Game Details
        </span>
      </div>

      <div className="space-y-1">
        {/* Gems Left */}
        <Row
          icon={
            <img
              src={diamondImg}
              alt="Gems"
              className="size-3.5 sm:size-4 object-contain drop-shadow-[0_0_6px_rgba(0,210,255,0.8)]"
            />
          }
          label="Gems left"
          value={gemsLeft}
        />

        {/* Mine Risk */}
        <Row
          icon={<Bomb className="size-3.5 sm:size-4 text-[#ff9800]" aria-hidden="true" />}
          label="Mine risk"
          value={`${mineRisk.toFixed(2)}%`}
        />

        {/* Opened Tiles */}
        <Row
          icon={<LayoutGrid className="size-3.5 sm:size-4 text-[#ffc107]" aria-hidden="true" />}
          label="Opened tiles"
          value={`${opened} / ${GRID_SIZE}`}
        />
      </div>
    </section>
  );
}
