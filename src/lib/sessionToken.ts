const SESSION_TOKEN_KEY = 'remindly.sessionToken';

export const getSessionToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(SESSION_TOKEN_KEY);
};

export const setSessionToken = (token: string) => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem(SESSION_TOKEN_KEY, token);
  }
};

export const clearSessionToken = () => {
  if (typeof window !== 'undefined') {
    window.sessionStorage.removeItem(SESSION_TOKEN_KEY);
  }
};
