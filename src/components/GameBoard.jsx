import MultiplierBar from './MultiplierBar.jsx';
import GameTile from './GameTile.jsx';
import GameOverModal from './GameOverModal.jsx';
import WinModal from './WinModal.jsx';
import { GRID_SIZE } from '../utils/gameLogic.js';
import woodPanelRight from '../assets/images/wood_panel_right.png';

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
      className={`relative flex flex-col gap-3.5 sm:gap-4 rounded-[28px] p-6 sm:p-7 lg:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.8)] overflow-hidden ${
        status === 'lost' ? 'animate-board-shake' : ''
      }`}
      style={{
        backgroundImage: `url(${woodPanelRight})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
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
        className="mx-auto w-full grid grid-cols-5 gap-2 sm:gap-2.5"
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
