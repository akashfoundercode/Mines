import MultiplierBar from './MultiplierBar.jsx';
import GameTile from './GameTile.jsx';
import GameOverModal from './GameOverModal.jsx';
import WinModal from './WinModal.jsx';
import UiBadge from './UiBadge.jsx';
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
      className={`relative flex flex-col justify-between h-full w-full gap-1 sm:gap-1.5 ${
        status === 'lost' ? 'animate-board-shake' : ''
      }`}
    >
      {/* Red blast flash across the board on explosion */}
      {status === 'lost' && (
        <div
          className="pointer-events-none absolute inset-0 z-30 animate-fade-in rounded-2xl"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(255, 60, 20, 0.35) 0%, rgba(255, 0, 40, 0.15) 60%, transparent 100%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Top Multiplier Ladder (Bigger line) */}
      <MultiplierBar items={multiplierWindow} />

      {/* 5x5 Tiles Grid Container: Fully responsive without cutting or side gaps */}
      <div className="mobile-land-grid-wrapper relative w-full flex-1 min-h-0 px-0.5 sm:px-2 md:px-3 py-0.5 sm:py-1">
        <div
          className="mobile-land-grid w-full h-full grid grid-cols-5 grid-rows-5 gap-1 sm:gap-1.5 md:gap-2 items-stretch"
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
      </div>

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
