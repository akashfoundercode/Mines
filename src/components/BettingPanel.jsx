import GameMode from './GameMode.jsx';
import BetAmount from './BetAmount.jsx';
import MinesSelector from './MinesSelector.jsx';
import AutoSettings from './AutoSettings.jsx';
import CashOutButton from './CashOutButton.jsx';
import GameDetails from './GameDetails.jsx';

export default function BettingPanel({
  game,
  gap,
  radius,
  innerWidth,
  gameModeH,
  betInputH,
  quickChipsH,
  minesBarH,
  cashoutH,
  detailsP,
  detailsRowH,
  detailsRowGap,
}) {
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
      className="mobile-land-panel relative flex flex-col justify-between h-full w-full min-h-0 overflow-hidden"
      style={{
        gap: gap !== undefined ? `${gap}px` : undefined,
        borderRadius: radius !== undefined ? `${radius}px` : undefined,
        width: innerWidth !== undefined ? `${innerWidth}%` : '100%',
        margin: '0 auto',
      }}
    >
      <GameMode
        mode={game.mode}
        disabled={settingsLocked}
        onChange={game.setMode}
        radius={radius}
        height={gameModeH}
      />

      <BetAmount
        value={game.betAmount}
        disabled={settingsLocked}
        onChange={game.setBet}
        onMin={game.setBetMin}
        onMax={game.setBetMax}
        inputH={betInputH}
        chipsH={quickChipsH}
      />

      <MinesSelector
        value={game.minesCount}
        disabled={settingsLocked}
        onChange={game.setMinesCount}
        barH={minesBarH}
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
        height={cashoutH}
      />

      <GameDetails
        gemsLeft={game.gemsLeft}
        mineRisk={game.mineRisk}
        opened={game.openedCount}
        radius={radius}
        padding={detailsP}
        rowH={detailsRowH}
        rowGap={detailsRowGap}
      />
    </aside>
  );
}
