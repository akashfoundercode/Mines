import MultiplierBar from './MultiplierBar.jsx';
import GameTile from './GameTile.jsx';
import GameOverModal from './GameOverModal.jsx';
import WinModal from './WinModal.jsx';
import { GRID_SIZE } from '../utils/gameLogic.js';

const TILES = Array.from({ length: GRID_SIZE }, (_, i) => i);

function getTileState({ index, status, mines, revealed, explodedTile }) {
  if (status === 'idle') return 'hidden';
  const isRevealed = revealed.includes(index);
  if (status === 'playing') return isRevealed ? 'gem' : 'hidden';
  // round finished: reveal the whole board
  if (index === explodedTile) return 'exploded';
  if (isRevealed) return 'gem';
  return mines.includes(index) ? 'ghostMine' : 'ghostGem';
}

export default function GameBoard({ game }) {
  const { status, mines, revealed, explodedTile, multiplierWindow, result, showResult } = game;

  return (
    <section
      aria-label="Mines board"
      className={`relative flex flex-col gap-4 rounded-3xl border border-[#172a4c] bg-gradient-to-b from-[#0b1428]/95 to-[#070e1c]/95 p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all ${
        status === 'lost' ? 'animate-board-shake' : ''
      }`}
    >
      {/* Red blast flash across the board on explosion */}
      {status === 'lost' && (
        <div
          className="pointer-events-none absolute inset-0 z-30 animate-fade-in rounded-[inherit]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(255, 60, 20, 0.35) 0%, rgba(255, 0, 40, 0.15) 60%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Top Multiplier Ladder */}
      <MultiplierBar items={multiplierWindow} />

      {/* 5x5 Tiles Grid */}
      <div
        className="mx-auto w-full grid grid-cols-5 gap-2 sm:gap-3"
        role="group"
        aria-label="Mines grid"
      >
        {TILES.map((index) => (
          <GameTile
            key={index}
            index={index}
            state={getTileState({ index, status, mines, revealed, explodedTile })}
            interactive={status === 'playing'}
            onSelect={game.revealTile}
          />
        ))}
      </div>

      {/* Golden bottom light reflection bar */}
      <div className="pointer-events-none absolute inset-x-12 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffc107] to-transparent shadow-[0_0_14px_rgba(255,193,7,0.8)]" />

      {/* Game Over / Win Modals */}
      {showResult && result?.outcome === 'lost' && (
        <GameOverModal result={result} onNewGame={game.resetRound} onDismiss={game.dismissResult} />
      )}
      {showResult && result?.outcome === 'won' && (
        <WinModal result={result} onNewGame={game.resetRound} onDismiss={game.dismissResult} />
      )}
    </section>
  );
}
