import api from './axiosInstance.js';
import { API_ENDPOINTS } from '../constants/apiEndpoints.js';

export const getActiveRound = () => {
  return api.get(API_ENDPOINTS.GAME.ACTIVE);
};

export const startRoundApi = ({ betAmount, minesCount }) => {
  return api.post(API_ENDPOINTS.GAME.START, { betAmount, minesCount });
};

export const revealTileApi = ({ roundId, tileIndex }) => {
  return api.post(API_ENDPOINTS.GAME.REVEAL, { roundId, tileIndex });
};

export const cashOutApi = ({ roundId }) => {
  return api.post(API_ENDPOINTS.GAME.CASHOUT, { roundId });
};

export const getLeaderboard = (config) => {
  return api.get(API_ENDPOINTS.LEADERBOARD, config);
};

export const getGameHistory = (params = {}, config = {}) => {
  return api.get(API_ENDPOINTS.GAME.HISTORY, { ...config, params });
};
