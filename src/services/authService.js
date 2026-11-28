import api from './axiosInstance.js';
import { API_ENDPOINTS } from '../constants/apiEndpoints.js';
import { setAuthToken } from './axiosInstance.js';

export async function loginUser(payload) {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  const token = response?.data?.token ?? response?.token ?? response?.login_token ?? response?.accessToken ?? response?.authToken;
  if (token) setAuthToken(token);
  return response;
}
