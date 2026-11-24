import GameMode from './GameMode.jsx';
import BetAmount from './BetAmount.jsx';
import MinesSelector from './MinesSelector.jsx';
import AutoSettings from './AutoSettings.jsx';
import CashOutButton from './CashOutButton.jsx';
import GameDetails from './GameDetails.jsx';
import woodPanelLeft from '../assets/images/wood_panel_left.png';

export default function BettingPanel({ game }) {
  const playing = game.status === 'playing';
  const isAuto = game.mode === 'auto';
  const settingsLocked = playing || game.autoRunning;

  let actionLabel = 'Bet';
  let actionAmount = game.betAmount;
  let actionDisabled = false;
  let actionIsStop = false;
  let actionClick = game.startRound;

  if (isAuto) {
    if (game.autoRunning) {
      actionLabel = 'Stop Auto';
      actionAmount = undefined;
      actionIsStop = true;
      actionClick = game.stopAuto;
    } else {
      actionLabel = 'Start Auto';
      actionAmount = game.betAmount;
      actionDisabled = !game.canBet || playing;
      actionClick = game.startAuto;
    }
  } else if (playing) {
    if (game.openedCount > 0) {
      actionLabel = 'Cash Out';
      actionAmount = game.potentialWin;
      actionDisabled = !game.canCashOut;
      actionClick = game.cashOut;
    } else {
      actionLabel = 'Pick a Tile';
      actionAmount = game.betAmount;
      actionDisabled = true;
    }
  } else {
    actionLabel = 'Bet';
    actionAmount = game.betAmount;
    actionDisabled = !game.canBet;
    actionClick = game.startRound;
  }

  return (
    <aside
      aria-label="Betting controls"
      className="relative flex flex-col gap-3.5 sm:gap-4 rounded-[28px] p-6 sm:p-7 lg:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.8)] overflow-hidden"
      style={{
        backgroundImage: `url(${woodPanelLeft})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <GameMode mode={game.mode} disabled={settingsLocked} onChange={game.setMode} />

      <BetAmount
        value={game.betAmount}
        disabled={settingsLocked}
        onChange={game.setBet}
        onMin={game.setBetMin}
        onMax={game.setBetMax}
      />

      <MinesSelector
        value={game.minesCount}
        disabled={settingsLocked}
        onChange={game.setMinesCount}
      />

      {isAuto && (
        <AutoSettings
          rounds={game.autoRounds}
          picks={game.autoPicks}
          left={game.autoLeft}
          running={game.autoRunning}
          onRounds={game.setAutoRounds}
          onPicks={game.setAutoPicks}
        />
      )}

      {/* Main prominent Cash Out / Bet Action button */}
      <CashOutButton
        label={actionLabel}
        amount={actionAmount}
        disabled={actionDisabled}
        isStop={actionIsStop}
        onClick={actionClick}
      />

      <GameDetails
        gemsLeft={game.gemsLeft}
        mineRisk={game.mineRisk}
        opened={game.openedCount}
      />
    </aside>
  );
}
