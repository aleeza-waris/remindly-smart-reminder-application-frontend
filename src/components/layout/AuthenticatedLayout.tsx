
'use client';

import axios from 'axios';
import {
  LayoutDashboard,
  ListTodo,
  Menu,
  Settings,
  UserRound,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { clearSessionToken, getSessionToken } from '../../lib/sessionToken';
import { getCurrentUser, logout } from '../../services/authService';
import type { DashboardUser } from '../../types/dashboard';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';
import RemindlyLoading from '../common/RemindlyLoading';
import ThemeToggle from './ThemeToggle';

type GateState = 'checking' | 'authorized' | 'unavailable';

const appLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/reminders', label: 'Reminders', icon: ListTodo },
  { href: '/settings', label: 'Settings', icon: Settings },
];

function Brand() {
  return (
    <Link
      aria-label="Remindly home"
      className="inline-flex min-h-11 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
      href="/"
    >
      <Image
        alt=""
        className="h-16 w-24 object-contain dark:hidden"
        height={432}
        priority
        src="/assets/remindly.logo.v2.png"
        width={578}
      />
      <Image
        alt=""
        className="hidden h-16 w-24 object-contain dark:block"
        height={432}
        priority
        src="/assets/remindly.logo.dark.png"
        width={578}
      />
    </Link>
  );
}

function UserProfile({ user }: { user: DashboardUser | null }) {
  const initial = user?.name?.trim().charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 border-b border-remindly-border pb-4">
      <div
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-full bg-remindly-burgundy font-semibold text-remindly-action-text"
      >
        {initial || <UserRound size={20} />}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-remindly-text">
          {user?.name || 'Your profile'}
        </p>
        <p className="truncate text-xs text-remindly-muted">
          {user?.email || ''}
        </p>
      </div>
    </div>
  );
}

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [gateState, setGateState] = useState<GateState>('checking');
  const [gateError, setGateError] = useState('');
  const [currentUser, setCurrentUser] = useState<DashboardUser | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const verifySession = useCallback(async () => {
    setGateState('checking');
    setGateError('');

    if (!getSessionToken()) {
      const destination = `${window.location.pathname}${window.location.search}`;
      router.replace(`/auth?next=${encodeURIComponent(destination)}`);
      return;
    }

    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setGateState('authorized');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        clearSessionToken();
        setCurrentUser(null);

        const destination = `${window.location.pathname}${window.location.search}`;
        router.replace(`/auth?next=${encodeURIComponent(destination)}`);
        return;
      }

      setGateError(getApiErrorMessage(error));
      setGateState('unavailable');
    }
  }, [router]);

  useEffect(() => {
    void verifySession();
  }, [pathname, verifySession]);

  useEffect(() => {
    if (!isNavigationOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNavigationOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isNavigationOpen]);

  const signOut = async () => {
    setIsLoggingOut(true);
    let revocationFailed = false;

    try {
      await logout();
    } catch {
      revocationFailed = true;
    } finally {
      clearSessionToken();
      setCurrentUser(null);
      queryClient.clear();
      router.replace(revocationFailed ? '/?logout=failed' : '/');
    }
  };

  if (gateState !== 'authorized') {
    if (gateState === 'checking') {
      return <RemindlyLoading message="Verifying your session" />;
    }

    return (
      <div className="grid min-h-dvh place-items-center p-6 text-center text-remindly-muted">
        <section
          aria-labelledby="auth-gate-error-title"
          className="w-full max-w-md rounded-2xl border border-remindly-border bg-remindly-surface p-7"
        >
          <h1
            className="mb-2 text-xl font-semibold text-remindly-text"
            id="auth-gate-error-title"
          >
            We couldn’t verify your session
          </h1>

          <p className="mb-5 leading-relaxed">{gateError}</p>

          <button
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-remindly-burgundy px-4 font-semibold text-remindly-action-text hover:bg-remindly-wine-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
            onClick={() => void verifySession()}
            type="button"
          >
            Try again
          </button>
        </section>
      </div>
    );
  }

  const navigation = (
    <>
      <nav aria-label="Application navigation" className="mt-8 grid gap-2">
        {appLinks.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus ${
                isActive
                  ? 'bg-remindly-elevated-surface text-remindly-text-accent'
                  : 'text-remindly-muted hover:bg-remindly-elevated-surface hover:text-remindly-text'
              }`}
              href={href}
              key={href}
              onClick={() => setIsNavigationOpen(false)}
            >
              <Icon aria-hidden="true" size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      


<div className="mt-auto grid gap-3 border-t border-remindly-border pt-4">
  <div className="flex items-center gap-2">
    <ThemeToggle />

    <button
      className="cursor-pointer inline-flex min-h-11 min-w-0 flex-1 items-center justify-center rounded-xl border border-remindly-border bg-remindly-surface px-3 text-sm font-semibold text-remindly-text transition-colors hover:border-remindly-wine-rose hover:text-remindly-text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus disabled:cursor-wait disabled:opacity-60"
      disabled={isLoggingOut}
      onClick={() => void signOut()}
      type="button"
    >
      {isLoggingOut ? 'Signing out…' : 'Log out'}
    </button>
  </div>

  <UserProfile user={currentUser} />
</div>



    </>
  );

  return (
    <div className="min-h-dvh md:pl-56 lg:pl-64">
      <a
        className="absolute left-2 top-2 z-50 -translate-y-20 rounded-lg bg-remindly-elevated-surface px-3 py-2 text-remindly-text-accent focus:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
        href="#main-content"
      >
        Skip to content
      </a>

      <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-remindly-border bg-remindly-surface p-4 md:flex lg:w-64 lg:p-5">
        <Brand />
        {navigation}
      </aside>

      <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-remindly-border bg-remindly-surface px-4 sm:px-6 md:hidden">
        <button
          aria-controls="mobile-navigation"
          aria-expanded={isNavigationOpen}
          aria-label={
            isNavigationOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          className="grid size-11 place-items-center rounded-xl text-remindly-text hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
          onClick={() => setIsNavigationOpen((open) => !open)}
          type="button"
        >
          {isNavigationOpen ? (
            <X aria-hidden="true" />
          ) : (
            <Menu aria-hidden="true" />
          )}
        </button>

        <Brand />
        <span aria-hidden="true" className="size-11" />
      </header>

      {isNavigationOpen && (
        <button
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsNavigationOpen(false)}
          type="button"
        />
      )}

      <aside
        aria-hidden={!isNavigationOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[calc(100vw-3rem)] flex-col border-r border-remindly-border bg-remindly-surface p-5 transition-transform md:hidden ${
          isNavigationOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        id="mobile-navigation"
        inert={!isNavigationOpen}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button
            aria-label="Close navigation menu"
            className="grid size-11 place-items-center rounded-xl text-remindly-text hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
            onClick={() => setIsNavigationOpen(false)}
            type="button"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>
        {navigation}
      </aside>

      <main className="w-full" id="main-content">
        {children}
      </main>
    </div>
  );
}
