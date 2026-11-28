import { useEffect, useState } from 'react';
import { formatMultiplier } from '../utils/gameLogic.js';
import { getLeaderboard } from '../services/gameService.js';

const RANK_BADGES = ['🥇', '🥈', '🥉'];

function normalizeRows(raw) {
  const list = Array.isArray(raw)
    ? raw
    : raw?.leaderboard || raw?.players || raw?.items || raw?.data || [];
  return list.map((item, idx) => {
    const rank = item.rank ?? idx + 1;
    const rawScore = item.score ?? item.multiplier ?? 0;
    const score =
      typeof rawScore === 'number'
        ? formatMultiplier(rawScore)
        : String(rawScore).startsWith('x')
          ? rawScore
          : `x${rawScore}`;
    return {
      rank,
      name: item.name ?? item.username ?? item.playerName ?? `Player #${rank}`,
      score,
      win: Number(item.win ?? item.payout ?? item.profit ?? 0),
      mines: Number(item.mines ?? item.minesCount ?? 3),
      badge: item.badge ?? RANK_BADGES[rank - 1] ?? String(rank),
    };
  });
}

export function useLeaderboard() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getLeaderboard({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setPlayers(normalizeRows(data));
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted && err.name !== 'CanceledError') {
          setError(err.message || 'Unable to load leaderboard');
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return { players, loading, error };
}
