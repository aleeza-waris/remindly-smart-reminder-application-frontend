export type ThemePreference = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'remindly.theme';

export const getSystemThemePreference = (): ThemePreference =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const setThemePreference = (theme: ThemePreference) => {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  document.documentElement.dataset.theme = theme;
};

export const clearThemePreference = () => {
  window.localStorage.removeItem(THEME_STORAGE_KEY);
  document.documentElement.dataset.theme = getSystemThemePreference();
};
