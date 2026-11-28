import api from './axiosInstance.js';
import { API_ENDPOINTS } from '../constants/apiEndpoints.js';

export const getWalletBalance = () => {
  return api.get(API_ENDPOINTS.WALLET.BALANCE);
};

export const addWalletFunds = (amount) => {
  return api.post(API_ENDPOINTS.WALLET.ADD_FUNDS, { amount });
};
