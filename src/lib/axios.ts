import axios from 'axios';
import { frontendConfig } from '../config/env';
import { getSessionToken } from './sessionToken';
import { getBrowserTimeZone } from './timeZone';

const apiClient = axios.create({
  baseURL: frontendConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getSessionToken();
  config.headers.set('X-Timezone', getBrowserTimeZone());

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export default apiClient;
