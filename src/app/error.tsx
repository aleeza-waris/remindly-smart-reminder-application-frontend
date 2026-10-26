'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-remindly-page px-5 py-10 text-remindly-text">
      <section aria-labelledby="error-heading" className="w-full max-w-xl rounded-3xl border border-remindly-border bg-remindly-surface p-6 text-center shadow-lg sm:p-10">
        <div aria-hidden="true" className="relative mx-auto mb-5 h-48 w-64 max-w-full">
          <span className="absolute left-8 top-4 animate-pulse text-2xl font-semibold text-remindly-category-violet motion-reduce:animate-none">z</span>
          <span className="absolute left-14 top-0 animate-pulse text-lg font-semibold text-remindly-category-violet motion-reduce:animate-none">Z</span>
          <svg className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 256 192" xmlns="http://www.w3.org/2000/svg">
            <path d="M37 143c-15 0-27-11-27-25 0-13 11-24 25-25 4-23 25-40 49-40 20 0 37 11 45 27 5-3 11-4 17-4 19 0 35 13 38 30 17 0 31 12 31 27 0 14-12 25-28 25H37Z" fill="#E8C9C6" opacity=".7" />
            <path d="M33 151c-11 0-20-8-20-18s9-18 20-18c7-19 25-32 46-32 19 0 35 10 43 26 6-4 13-7 21-7 16 0 30 10 34 24h13c13 0 23 9 23 20s-10 20-23 20H33Z" fill="var(--remindly-surface)" stroke="var(--remindly-border)" strokeWidth="3" />
            <path d="M128 53c-20 0-33 16-33 36v18c0 11-6 19-14 28h94c-8-9-14-17-14-28V89c0-20-13-36-33-36Z" fill="var(--remindly-text-accent-secondary)" stroke="var(--remindly-burgundy)" strokeWidth="4" />
            <path d="M111 68c-4 6-6 13-6 22v17c0 8-3 15-8 22" stroke="var(--remindly-warm-cream)" strokeLinecap="round" strokeOpacity=".8" strokeWidth="6" />
            <path d="M116 53a12 12 0 0 1 24 0" stroke="var(--remindly-text-accent-secondary)" strokeWidth="7" />
            <path d="M117 136a11 11 0 0 0 22 0" fill="var(--remindly-text-accent)" />
            <path d="M115 97c4-5 8-5 12 0M131 97c4-5 8-5 12 0" stroke="var(--remindly-warm-cream)" strokeLinecap="round" strokeWidth="3" />
            <path d="M126 107c4 4 8 4 12 0" stroke="var(--remindly-warm-cream)" strokeLinecap="round" strokeWidth="3" />
            <path d="m207 35 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7ZM57 24l1.5 5.5L64 31l-5.5 1.5L57 38l-1.5-5.5L50 31l5.5-1.5L57 24Z" fill="var(--remindly-category-violet)" />
          </svg>
          <span aria-hidden="true" className="absolute right-5 top-8 animate-pulse text-remindly-category-violet motion-reduce:animate-none">✦</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-remindly-charcoal-brown" id="error-heading">
          Oops! Even the most punctual bell takes an accidental snooze.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-remindly-muted">
          Something went wrong while loading this page. Please try again.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-remindly-burgundy px-5 font-semibold text-remindly-action-text transition-colors hover:bg-remindly-wine-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
            onClick={reset}
            type="button"
          >
            Wake Up &amp; Try Again
          </button>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-remindly-border px-5 font-semibold text-remindly-text transition-colors hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
            href="/dashboard"
          >
            Back to Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
