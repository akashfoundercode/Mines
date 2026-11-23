import Background from './components/Background.jsx';
import Navbar from './components/Navbar.jsx';
import BettingPanel from './components/BettingPanel.jsx';
import GameBoard from './components/GameBoard.jsx';
import { useMinesGame } from './hooks/useMinesGame.js';

export default function App() {
  const game = useMinesGame();

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#060b17] font-sans text-white select-none">
      <Background />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar
          balance={game.balance}
          soundOn={game.soundOn}
          onToggleSound={game.toggleSound}
          onAddFunds={game.addFunds}
          onResetDemo={game.resetDemo}
        />
        <main className="mx-auto flex w-full max-w-[1180px] flex-1 items-center justify-center px-3 py-3 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 items-start gap-4 lg:grid-cols-[380px_1fr] lg:gap-6 xl:grid-cols-[390px_540px] xl:justify-center">
            <div className="order-2 lg:order-1">
              <BettingPanel game={game} />
            </div>
            <div className="order-1 lg:order-2">
              <GameBoard game={game} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
