'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlertTriangle, CalendarClock, CheckCircle2, ListTodo, RefreshCw } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';
import CategoryDistribution from './CategoryDistribution';
import CompletionProgress from './CompletionProgress';
import DashboardStatCard from './DashboardStatCard';
import DueSoonList from './DueSoonList';
import { DashboardPanel, DashboardPanelHeading } from './DashboardPanel';
import { isValidTimeZone } from '../../lib/timeZone';

const pageClass = 'mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10';
const skeletonClass =
  'animate-dashboard-loading rounded-2xl bg-linear-to-r from-remindly-border via-remindly-surface to-remindly-border bg-size-[220%_100%] motion-reduce:animate-none';

const getGreeting = (hour: number) => {
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function DashboardOverview() {
  const { userQuery, statsQuery, remindersQuery, completionMutation } = useDashboard();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    let intervalId: number;
    const firstTick = window.setTimeout(() => {
      setNow(new Date());
      intervalId = window.setInterval(() => setNow(new Date()), 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      window.clearTimeout(firstTick);
      window.clearInterval(intervalId);
    };
  }, []);

  const queries = [userQuery, statsQuery, remindersQuery];
  const isLoading = queries.some((query) => query.isPending);
  const error = userQuery.error ?? statsQuery.error;
  const user = userQuery.data;
  const stats = statsQuery.data;
  const reminders = remindersQuery.data ?? [];
  const rawTimeZone = user?.timezone || 'UTC';
  const isTimeZoneValid = isValidTimeZone(rawTimeZone);
  const timeZone = isTimeZoneValid ? rawTimeZone : 'UTC';
  const completionError = completionMutation.isError
    ? getApiErrorMessage(completionMutation.error)
    : null;
  const completingId = completionMutation.isPending ? completionMutation.variables : null;

  const retry = () => {
    for (const query of queries) {
      void query.refetch();
    }
  };

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="Loading dashboard" className={pageClass}>
        <div className={`${skeletonClass} mb-7 h-20 w-3/4 max-w-80`} />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div className={`${skeletonClass} h-40`} key={index} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className={`${skeletonClass} min-h-72`} />
          <div className={`${skeletonClass} min-h-72`} />
        </div>
      </div>
    );
  }

  if (error || !user || !stats) {
    return (
      <div className={pageClass}>
        <section aria-labelledby="dashboard-error-heading" className="flex min-h-[48vh] flex-col items-center justify-center px-4 py-8 text-center">
          <AlertTriangle aria-hidden="true" className="text-remindly-text-accent-secondary" size={28} />
          <h1 className="mb-1 mt-4 text-xl font-semibold text-remindly-charcoal-brown" id="dashboard-error-heading">
            We couldn’t load your dashboard
          </h1>
          <p className="max-w-lg text-sm leading-relaxed text-remindly-muted">
            {error ? getApiErrorMessage(error) : 'Your account information is unavailable.'}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-remindly-burgundy px-4 font-semibold text-remindly-action-text hover:bg-remindly-wine-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus" onClick={retry} type="button">
              <RefreshCw aria-hidden="true" size={16} />
              Try again
            </button>
            <Link className="inline-flex min-h-11 cursor-pointer items-center rounded-xl px-3 font-semibold text-remindly-text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus" href="/auth?mode=login">
              Sign in
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const dateTime = now
    ? new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone,
      }).format(now)
    : 'Loading your time…';
  const greetingHour = now && isTimeZoneValid
    ? Number(
        new Intl.DateTimeFormat('en', {
          hour: 'numeric',
          hourCycle: 'h23',
          timeZone,
        }).format(now)
      )
    : now
      ? now.getUTCHours()
      : null;
  const greeting = greetingHour === null ? 'Hello' : getGreeting(greetingHour);

  return (
    <div className={pageClass}>
      <header className="mb-6 flex items-end justify-between gap-5 sm:mb-8">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-remindly-text-accent-secondary">
            Your Remindly overview
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-remindly-charcoal-brown sm:text-4xl">
            {greeting}, {user.name.split(' ')[0]}
          </h1>
          <p className="mt-2 text-sm text-remindly-muted">{dateTime}</p>
          {!isTimeZoneValid && (
            <p className="mt-2 text-sm text-remindly-warning" role="status">
              Your saved timezone is invalid; showing UTC time.
            </p>
          )}
        </div>
      </header>

      <section aria-label="Reminder statistics" className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
        <DashboardStatCard
          detail="All your reminders"
          icon={ListTodo}
          label="Total reminders"
          tone="burgundy"
          value={stats.total}
        />
        <DashboardStatCard
          detail="Still ahead"
          icon={CalendarClock}
          label="Upcoming"
          tone="rose"
          value={stats.upcoming}
        />
        <DashboardStatCard
          detail="Nicely done"
          icon={CheckCircle2}
          label="Completed"
          tone="green"
          value={stats.completed}
        />
        <DashboardStatCard
          detail="Ready for your attention"
          icon={AlertTriangle}
          label="Overdue"
          tone="amber"
          value={stats.overdue}
        />
      </section>

      <section aria-label="Reminder insights" className="mt-4 grid gap-4 md:grid-cols-2">
        <CompletionProgress
          completed={stats.completed}
          completionRate={stats.completionRate}
          total={stats.total}
        />
        <CategoryDistribution byCategory={stats.byCategory} />
      </section>

      {remindersQuery.isError ? (
        <DashboardPanel labelledBy="due-soon-error-heading">
          <DashboardPanelHeading
            description="Coming up in the next 7 days"
            id="due-soon-error-heading"
            title="Due soon"
          />
          <p className="my-4 text-sm text-remindly-danger" role="alert">
            {getApiErrorMessage(remindersQuery.error)}
          </p>
          <button className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-remindly-border bg-remindly-surface px-3 text-sm font-semibold text-remindly-charcoal-brown hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus" onClick={() => void remindersQuery.refetch()} type="button">
            <RefreshCw aria-hidden="true" size={15} />
            Reload reminders
          </button>
        </DashboardPanel>
      ) : (
        <DueSoonList
          completionError={completionError}
          completingId={completingId}
          onComplete={(reminderId) => completionMutation.mutate(reminderId)}
          reminders={reminders}
          timeZone={timeZone}
        />
      )}
    </div>
  );
}