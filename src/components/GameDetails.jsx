import { BarChart2, Bomb, LayoutGrid } from 'lucide-react';
import { GRID_SIZE } from '../utils/gameLogic.js';
import diamondImg from '../assets/images/diamond.png';

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="text-sm font-medium text-[#93a2bc]">{label}</span>
      </div>
      <span className="text-sm sm:text-base font-extrabold tabular-nums tracking-wide text-white">
        {value}
      </span>
    </div>
  );
}

export default function GameDetails({ gemsLeft, mineRisk, opened }) {
  return (
    <section
      aria-label="Game details"
      className="rounded-2xl border border-[#172a4c] bg-[#070e1c]/90 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
    >
      <h3 className="mb-1 flex items-center gap-2 text-sm sm:text-base font-bold text-white">
        <BarChart2 className="size-4 sm:size-5 text-[#ffc107]" aria-hidden="true" />
        <span>Game Details</span>
      </h3>
      <div className="divide-y divide-white/5">
        <Row
          icon={
            <img
              src={diamondImg}
              alt="Gems"
              className="size-4 sm:size-5 object-contain drop-shadow-[0_0_8px_rgba(0,210,255,0.8)]"
            />
          }
          label="Gems left"
          value={gemsLeft}
        />
        <Row
          icon={<Bomb className="size-4 sm:size-5 text-[#ff9800]" aria-hidden="true" />}
          label="Mine risk"
          value={`${mineRisk.toFixed(2)}%`}
        />
        <Row
          icon={<LayoutGrid className="size-4 sm:size-5 text-[#ffc107]" aria-hidden="true" />}
          label="Opened tiles"
          value={`${opened} / ${GRID_SIZE}`}
        />
      </div>
    </section>
  );
}
