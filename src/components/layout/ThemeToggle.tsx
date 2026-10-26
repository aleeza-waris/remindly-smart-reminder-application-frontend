
'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { setThemePreference, type ThemePreference } from '../../lib/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemePreference | null>(null);

  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
    );
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setThemePreference(nextTheme);
    setTheme(nextTheme);
  };

  const label =
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      aria-label={label}
      aria-pressed={theme === 'dark'}
      className="cursor-pointer inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-remindly-border bg-remindly-surface text-remindly-text transition-colors hover:border-remindly-wine-rose hover:text-remindly-text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
      onClick={toggleTheme}
      title={label}
      type="button"
    >
      {theme === 'dark' ? (
        <Sun aria-hidden="true" size={19} />
      ) : (
        <Moon aria-hidden="true" size={19} />
      )}
    </button>
  );
}
