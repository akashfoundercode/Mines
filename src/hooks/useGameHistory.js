import { useCallback, useEffect, useState } from 'react';
import { formatMultiplier } from '../utils/gameLogic.js';
import { getGameHistory } from '../services/gameService.js';

function normalizeHistory(raw) {
  const list = Array.isArray(raw)
    ? raw
    : raw?.history || raw?.rounds || raw?.items || raw?.records || [];

  return list.map((item, idx) => {
    const bet = Number(item.betAmount ?? item.bet ?? 0);
    const payout = Number(item.payout ?? item.winAmount ?? item.win ?? 0);
    const status = String(
      item.status ?? item.outcome ?? (payout > 0 ? 'won' : 'lost'),
    ).toLowerCase();
    const isWin = status === 'won' || status === 'win';
    const rawMult = item.multiplier ?? (bet > 0 && payout > 0 ? payout / bet : 0);
    const multiplier =
      typeof rawMult === 'number'
        ? formatMultiplier(rawMult)
        : String(rawMult).startsWith('x')
          ? rawMult
          : `x${rawMult}`;

    return {
      id: item.roundId ?? item.id ?? item._id ?? idx + 1,
      bet,
      payout,
      profit: Number(item.profit ?? (isWin ? payout - bet : -bet)),
      mines: Number(item.minesCount ?? item.mines ?? 0),
      gems: Number(item.gems ?? item.openedCount ?? item.revealed?.length ?? 0),
      multiplier,
      isWin,
      status,
      createdAt: item.createdAt ?? item.updatedAt ?? item.timestamp ?? null,
    };
  });
}

export function useGameHistory({ limit = 20 } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getGameHistory({ limit }, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setItems(normalizeHistory(data));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted && err.name !== 'CanceledError') {
          setError(err.message || 'Unable to load game history');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [limit, reloadKey]);

  return { items, loading, error, refresh };
}
