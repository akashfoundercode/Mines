import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  GRID_SIZE,
  MAX_BET,
  MAX_MINES,
  MIN_BET,
  MIN_MINES,
  generateMines,
  getMineRisk,
  getMultiplier,
  getMultiplierWindow,
  randomInt,
  roundMoney,
} from '../utils/gameLogic.js';
import { sounds } from '../utils/sound.js';

const START_BALANCE = 1000;
const TOP_UP = 500;

/**
 * All game state and rules live here; components only render.
 * status: 'idle' | 'playing' | 'lost' | 'won'
 *
 * Demo only: balance and mine positions live in the browser. A real-money game
 * must generate mines and settle bets on a server.
 */
export function useMinesGame() {
  const [balance, setBalance] = useState(START_BALANCE);
  const [betAmount, setBetAmount] = useState(10);
  const [minesCount, setMinesCountState] = useState(3);
  const [mode, setModeState] = useState('manual');
  const [soundOn, setSoundOn] = useState(true);

  const [status, setStatus] = useState('idle');
  const [mines, setMines] = useState([]); // fixed for the whole round
  const [revealed, setRevealed] = useState([]);
  const [activeBet, setActiveBet] = useState(0);
  const [explodedTile, setExplodedTile] = useState(null);
  const [roundId, setRoundId] = useState(0);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const [autoRunning, setAutoRunning] = useState(false);
  const [autoRounds, setAutoRoundsState] = useState(5);
  const [autoPicks, setAutoPicksState] = useState(3);
  const [autoLeft, setAutoLeft] = useState(0);

  const play = useCallback(
    (name) => {
      if (soundOn) sounds[name]?.();
    },
    [soundOn],
  );

  // ---- derived values ------------------------------------------------------
  const roundMines = status === 'idle' ? minesCount : mines.length;
  const openedCount = revealed.length;
  const totalGems = GRID_SIZE - roundMines;
  const multiplier = getMultiplier(openedCount, roundMines);
  const bet = status === 'idle' ? betAmount : activeBet;
  const potentialWin = roundMoney(bet * multiplier);
  const gemsLeft = totalGems - openedCount;
  const mineRisk = getMineRisk(openedCount, roundMines);
  const multiplierWindow = useMemo(
    () => getMultiplierWindow(openedCount, roundMines),
    [openedCount, roundMines],
  );
  const canBet = status !== 'playing' && betAmount >= MIN_BET && betAmount <= balance;
  const canCashOut = status === 'playing' && openedCount > 0;

  // ---- settings ------------------------------------------------------------
  const resetRound = useCallback(() => {
    setStatus('idle');
    setMines([]);
    setRevealed([]);
    setExplodedTile(null);
    setResult(null);
    setShowResult(false);
  }, []);

  /** Returns the clamped value so inputs can sync to it. */
  const setBet = useCallback((value) => {
    const n = Number(value);
    const clamped = Number.isFinite(n)
      ? Math.min(Math.max(roundMoney(n), MIN_BET), MAX_BET)
      : MIN_BET;
    setBetAmount(clamped);
    return clamped;
  }, []);

  const setBetMin = useCallback(() => setBet(MIN_BET), [setBet]);
  const setBetMax = useCallback(
    () => setBet(Math.max(MIN_BET, Math.floor(balance * 100) / 100)),
    [balance, setBet],
  );

  const setMinesCount = useCallback(
    (value) => {
      if (status === 'playing') return;
      const n = Math.min(Math.max(Math.round(value), MIN_MINES), MAX_MINES);
      setMinesCountState(n);
      if (status === 'lost' || status === 'won') resetRound();
    },
    [status, resetRound],
  );

  const setMode = useCallback(
    (next) => {
      if (status === 'playing') return;
      setModeState(next);
      setAutoRunning(false);
    },
    [status],
  );

  const setAutoRounds = useCallback((v) => {
    setAutoRoundsState(Math.min(Math.max(Math.round(Number(v) || 1), 1), 100));
  }, []);
  const setAutoPicks = useCallback((v) => {
    setAutoPicksState(Math.min(Math.max(Math.round(Number(v) || 1), 1), GRID_SIZE - MIN_MINES));
  }, []);

  const toggleSound = useCallback(() => setSoundOn((s) => !s), []);
  const addFunds = useCallback(() => setBalance((b) => roundMoney(b + TOP_UP)), []);
  const resetDemo = useCallback(() => {
    setAutoRunning(false);
    setBalance(START_BALANCE);
    resetRound();
  }, [resetRound]);

  // ---- round flow ----------------------------------------------------------
  const startRound = useCallback(() => {
    if (status === 'playing') return false;
    if (betAmount < MIN_BET || betAmount > balance) return false;
    setBalance((b) => roundMoney(b - betAmount));
    setActiveBet(betAmount);
    setMines(generateMines(minesCount)); // placed once, stays fixed all round
    setRevealed([]);
    setExplodedTile(null);
    setResult(null);
    setShowResult(false);
    setRoundId((id) => id + 1);
    setStatus('playing');
    play('click');
    return true;
  }, [status, betAmount, balance, minesCount, play]);

  const settleWin = useCallback(
    (picks) => {
      const mult = getMultiplier(picks.length, mines.length);
      const payout = roundMoney(activeBet * mult);
      setBalance((b) => roundMoney(b + payout));
      setResult({
        outcome: 'won',
        bet: activeBet,
        multiplier: mult,
        payout,
        profit: roundMoney(payout - activeBet),
        gems: picks.length,
        mines: mines.length,
        roundId,
      });
      setStatus('won');
      play('win');
    },
    [mines.length, activeBet, roundId, play],
  );

  const cashOut = useCallback(() => {
    if (status !== 'playing' || revealed.length === 0) return;
    settleWin(revealed);
  }, [status, revealed, settleWin]);

  const revealTile = useCallback(
    (index) => {
      if (status !== 'playing' || revealed.includes(index)) return;
      if (mines.includes(index)) {
        setExplodedTile(index);
        setResult({
          outcome: 'lost',
          bet: activeBet,
          multiplier: 0,
          payout: 0,
          profit: -activeBet,
          gems: revealed.length,
          mines: mines.length,
          roundId,
        });
        setStatus('lost');
        play('explode');
        return;
      }
      const next = [...revealed, index];
      setRevealed(next);
      play('reveal');
      if (next.length === GRID_SIZE - mines.length) settleWin(next); // cleared the board
    },
    [status, revealed, mines, activeBet, roundId, play, settleWin],
  );

  // ---- result overlay (delayed so the explosion / reveal is visible first) --
  useEffect(() => {
    if (status !== 'lost' && status !== 'won') return undefined;
    if (autoRunning) return undefined;
    const t = setTimeout(() => setShowResult(true), status === 'lost' ? 1500 : 700);
    return () => clearTimeout(t);
  }, [status, autoRunning]);

  // ---- auto mode -----------------------------------------------------------
  const startAuto = useCallback(() => {
    if (!canBet || status === 'playing') return;
    setAutoLeft(autoRounds);
    setAutoRunning(true);
  }, [canBet, status, autoRounds]);

  const stopAuto = useCallback(() => setAutoRunning(false), []);

  // Start the next auto round.
  useEffect(() => {
    if (!autoRunning || status === 'playing') return undefined;
    const t = setTimeout(
      () => {
        if (autoLeft <= 0 || betAmount > balance) {
          setAutoRunning(false);
          return;
        }
        setAutoLeft((l) => l - 1);
        startRound();
      },
      status === 'idle' ? 150 : 900,
    );
    return () => clearTimeout(t);
  }, [autoRunning, status, autoLeft, betAmount, balance, startRound]);

  // Pick tiles during an auto round, then cash out.
  useEffect(() => {
    if (!autoRunning || status !== 'playing') return undefined;
    const t = setTimeout(() => {
      if (revealed.length >= Math.min(autoPicks, GRID_SIZE - mines.length)) {
        cashOut();
        return;
      }
      const pool = [];
      for (let i = 0; i < GRID_SIZE; i++) if (!revealed.includes(i)) pool.push(i);
      revealTile(pool[randomInt(pool.length)]);
    }, 450);
    return () => clearTimeout(t);
  }, [autoRunning, status, revealed, mines.length, autoPicks, cashOut, revealTile]);

  return {
    // state
    balance,
    betAmount,
    minesCount,
    mode,
    soundOn,
    status,
    mines,
    revealed,
    explodedTile,
    roundId,
    result,
    showResult,
    autoRunning,
    autoRounds,
    autoPicks,
    autoLeft,
    // derived
    multiplier,
    potentialWin,
    gemsLeft,
    mineRisk,
    openedCount,
    totalGems,
    multiplierWindow,
    canBet,
    canCashOut,
    // actions
    setBet,
    setBetMin,
    setBetMax,
    setMinesCount,
    setMode,
    setAutoRounds,
    setAutoPicks,
    toggleSound,
    addFunds,
    resetDemo,
    startRound,
    revealTile,
    cashOut,
    resetRound,
    dismissResult: () => setShowResult(false),
    startAuto,
    stopAuto,
  };
}
