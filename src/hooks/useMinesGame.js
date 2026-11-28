import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GRID_SIZE,
  MAX_BET,
  MAX_MINES,
  MIN_BET,
  MIN_MINES,
  getMineRisk,
  getMultiplier,
  getMultiplierWindow,
  randomInt,
  roundMoney,
} from '../utils/gameLogic.js';
import {
  addWalletFunds,
  getWalletBalance,
} from '../services/walletService.js';
import {
  cashOutApi,
  getActiveRound,
  revealTileApi,
  startRoundApi,
} from '../services/gameService.js';
import { getAuthToken } from '../services/axiosInstance.js';
import { sounds } from '../utils/sound.js';

const START_BALANCE = 0;
const TOP_UP = 500;

/**
 * All game state and rules live here; components only render.
 * status: 'idle' | 'playing' | 'lost' | 'won'
 */
export function useMinesGame({ onUnauthorized, initialAccount } = {}) {
  const [balance, setBalance] = useState(() => Number(initialAccount?.wallet ?? initialAccount?.total_wallet ?? START_BALANCE));
  const [winningWallet, setWinningWallet] = useState(() => Number(initialAccount?.winning_wallet ?? initialAccount?.winningWallet ?? 0));
  const [bonusBalance, setBonusBalance] = useState(() => Number(initialAccount?.bonus ?? 0));
  const [walletProfile, setWalletProfile] = useState(() => initialAccount ? {
    id: initialAccount.id,
    username: initialAccount.username,
    mobile: initialAccount.mobile,
    email: initialAccount.email,
    u_id: initialAccount.u_id,
    userimage: initialAccount.userimage ?? null,
  } : null);
  const [betAmount, setBetAmount] = useState(10);
  const [minesCount, setMinesCountState] = useState(3);
  const [activeMinesCount, setActiveMinesCount] = useState(3);
  const [mode, setModeState] = useState('manual');
  const [soundOn, setSoundOn] = useState(true);

  const [status, setStatus] = useState('idle');
  const [mines, setMines] = useState([]); // revealed by server only after round ends
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

  const [isPending, setIsPending] = useState(false);
  const [apiError, setApiError] = useState(null);
  const pendingRef = useRef(false);

  const play = useCallback(
    (name) => {
      if (soundOn) sounds[name]?.();
    },
    [soundOn],
  );

  const clearApiError = useCallback(() => setApiError(null), []);

  // Auto-dismiss error toast after 4.5 seconds
  useEffect(() => {
    if (!apiError) return undefined;
    const t = setTimeout(() => setApiError(null), 4500);
    return () => clearTimeout(t);
  }, [apiError]);

  // Initial sync: load wallet balance & resume active round if any
  useEffect(() => {
    let cancelled = false;
    getAuthToken(); // persist ?token= from URL if present

    async function init() {
      const [walletRes, activeRes] = await Promise.allSettled([
        getWalletBalance(),
        getActiveRound(),
      ]);

      if (cancelled) return;

      if (walletRes.status === 'fulfilled' && walletRes.value) {
        const b = walletRes.value.balance ?? walletRes.value.walletBalance;
        if (Number.isFinite(Number(b))) {
          setBalance(roundMoney(Number(b)));
        }
        setWinningWallet(roundMoney(Number(walletRes.value.winningWallet ?? 0)));
        setBonusBalance(roundMoney(Number(walletRes.value.bonus ?? 0)));
        setWalletProfile(walletRes.value.profile ?? null);
      } else if (walletRes.status === 'rejected' && walletRes.reason?.status === 401) {
        onUnauthorized?.();
        return;
      }

      if (activeRes.status === 'fulfilled' && activeRes.value) {
        const round = activeRes.value.round ?? activeRes.value;
        if (round && round.status === 'playing' && round.roundId) {
          const rMines = Number(round.minesCount ?? round.mines ?? 3);
          const rBet = Number(round.betAmount ?? round.bet ?? 10);
          const rRevealed = Array.isArray(round.revealedTiles)
            ? round.revealedTiles
            : Array.isArray(round.revealed)
              ? round.revealed
              : [];
          setRoundId(round.roundId);
          setActiveBet(roundMoney(rBet));
          setBetAmount(roundMoney(rBet));
          setMinesCountState(rMines);
          setActiveMinesCount(rMines);
          setRevealed(rRevealed);
          setMines([]);
          setExplodedTile(null);
          setResult(null);
          setShowResult(false);
          setStatus('playing');
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [onUnauthorized]);

  // ---- derived values ------------------------------------------------------
  const roundMines = status === 'idle' ? minesCount : activeMinesCount;
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
  const canBet = !isPending && status !== 'playing' && betAmount >= MIN_BET && betAmount <= balance;
  const canCashOut = !isPending && status === 'playing' && openedCount > 0;

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

  const addFunds = useCallback(async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setIsPending(true);
    setApiError(null);
    try {
      const res = await addWalletFunds(TOP_UP);
      const nextBalance = res?.balance ?? res?.walletBalance;
      if (Number.isFinite(Number(nextBalance))) {
        setBalance(roundMoney(Number(nextBalance)));
      } else {
        setBalance((b) => roundMoney(b + TOP_UP));
      }
      if (res?.profile) setWalletProfile(res.profile);
    } catch (err) {
      setApiError(err.message || 'Failed to add funds');
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  }, []);

  const resetDemo = useCallback(async () => {
    setAutoRunning(false);
    resetRound();
    try {
      const res = await getWalletBalance();
      const b = res?.balance ?? res?.walletBalance;
      if (Number.isFinite(Number(b))) setBalance(roundMoney(Number(b)));
      setWinningWallet(roundMoney(Number(res?.winningWallet ?? 0)));
      setBonusBalance(roundMoney(Number(res?.bonus ?? 0)));
      setWalletProfile(res?.profile ?? null);
    } catch {
      // Ignore if offline
    }
  }, [resetRound, onUnauthorized]);

  // ---- round flow ----------------------------------------------------------
  const startRound = useCallback(async () => {
    if (pendingRef.current || status === 'playing') return false;
    if (betAmount < MIN_BET || betAmount > balance) return false;

    pendingRef.current = true;
    setIsPending(true);
    setApiError(null);

    try {
      const res = await startRoundApi({ betAmount, minesCount });
      const nextBalance = res?.balance ?? res?.walletBalance;
      const nextRoundId = res?.roundId ?? res?.id ?? Date.now();
      const serverMinesCount = Number(res?.minesCount ?? minesCount);

      if (Number.isFinite(Number(nextBalance))) {
        setBalance(roundMoney(Number(nextBalance)));
      } else {
        setBalance((b) => roundMoney(b - betAmount));
      }

      setActiveBet(betAmount);
      setActiveMinesCount(serverMinesCount);
      setMines([]); // hidden on server during active round
      setRevealed(
        Array.isArray(res?.revealedTiles)
          ? res.revealedTiles
          : Array.isArray(res?.revealed)
            ? res.revealed
            : [],
      );
      setExplodedTile(null);
      setResult(null);
      setShowResult(false);
      setRoundId(nextRoundId);
      setStatus('playing');
      play('click');
      return true;
    } catch (err) {
      setApiError(err.message || 'Could not start round');
      setAutoRunning(false);
      return false;
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  }, [status, betAmount, balance, minesCount, play]);

  const applyWinState = useCallback(
    (res, picksCount) => {
      const mult = Number(
        res?.multiplier ?? getMultiplier(picksCount, activeMinesCount),
      );
      const payout = roundMoney(
        Number(res?.payout ?? activeBet * mult),
      );
      const nextBalance = res?.balance ?? res?.walletBalance;

      if (Number.isFinite(Number(nextBalance))) {
        setBalance(roundMoney(Number(nextBalance)));
      } else {
        setBalance((b) => roundMoney(b + payout));
      }

      if (Array.isArray(res?.mines)) {
        setMines(res.mines);
      }
      if (Array.isArray(res?.revealedTiles)) {
        setRevealed(res.revealedTiles);
      }

      setResult({
        outcome: 'won',
        bet: activeBet,
        multiplier: mult,
        payout,
        profit: roundMoney(res?.profit ?? payout - activeBet),
        gems: res?.gems ?? picksCount,
        mines: res?.minesCount ?? activeMinesCount,
        roundId: res?.roundId ?? roundId,
      });
      setStatus('won');
      play('win');
    },
    [activeMinesCount, activeBet, roundId, play],
  );

  const cashOut = useCallback(async () => {
    if (pendingRef.current || status !== 'playing' || revealed.length === 0) return;

    pendingRef.current = true;
    setIsPending(true);
    setApiError(null);

    try {
      const res = await cashOutApi({ roundId });
      applyWinState(res, revealed.length);
    } catch (err) {
      setApiError(err.message || 'Cash out failed');
      setAutoRunning(false);
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  }, [status, revealed.length, roundId, applyWinState]);

  const revealTile = useCallback(
    async (index) => {
      if (pendingRef.current || status !== 'playing' || revealed.includes(index)) return;

      pendingRef.current = true;
      setIsPending(true);
      setApiError(null);

      try {
        const res = await revealTileApi({ roundId, tileIndex: index });
        const hitMine =
          res?.isMine === true ||
          res?.hitMine === true ||
          res?.outcome === 'lost' ||
          res?.status === 'lost';

        if (hitMine) {
          if (Array.isArray(res?.mines)) {
            setMines(res.mines);
          }
          const nextBalance = res?.balance ?? res?.walletBalance;
          if (Number.isFinite(Number(nextBalance))) {
            setBalance(roundMoney(Number(nextBalance)));
          }
          setExplodedTile(index);
          setResult({
            outcome: 'lost',
            bet: activeBet,
            multiplier: 0,
            payout: 0,
            profit: -activeBet,
            gems: res?.gems ?? Math.max(0, (res?.revealedTiles?.length ?? revealed.length + 1) - 1),
            mines: res?.minesCount ?? activeMinesCount,
            roundId: res?.roundId ?? roundId,
          });
          setStatus('lost');
          play('explode');
          return;
        }

        const next = Array.isArray(res?.revealedTiles)
          ? res.revealedTiles
          : Array.isArray(res?.revealed)
            ? res.revealed
            : [...revealed, index];
        setRevealed(next);
        play('reveal');

        const isWon =
          res?.status === 'won' ||
          res?.outcome === 'won' ||
          next.length >= GRID_SIZE - activeMinesCount;

        if (isWon) {
          applyWinState(res, next.length);
        }
      } catch (err) {
        setApiError(err.message || 'Failed to reveal tile');
        setAutoRunning(false);
      } finally {
        pendingRef.current = false;
        setIsPending(false);
      }
    },
    [status, revealed, roundId, activeBet, activeMinesCount, play, applyWinState],
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
    if (!autoRunning || status === 'playing' || isPending) return undefined;
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
  }, [autoRunning, status, isPending, autoLeft, betAmount, balance, startRound]);

  // Pick tiles during an auto round, then cash out.
  useEffect(() => {
    if (!autoRunning || status !== 'playing' || isPending) return undefined;
    const t = setTimeout(() => {
      if (revealed.length >= Math.min(autoPicks, GRID_SIZE - activeMinesCount)) {
        cashOut();
        return;
      }
      const pool = [];
      for (let i = 0; i < GRID_SIZE; i++) if (!revealed.includes(i)) pool.push(i);
      if (pool.length > 0) revealTile(pool[randomInt(pool.length)]);
    }, 450);
    return () => clearTimeout(t);
  }, [autoRunning, status, isPending, revealed, activeMinesCount, autoPicks, cashOut, revealTile]);

  return {
    // state
    balance,
    winningWallet,
    bonusBalance,
    walletProfile,
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
    isPending,
    apiError,
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
    clearApiError,
    startAuto,
    stopAuto,
  };
}
