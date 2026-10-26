import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-remindly-page px-5 py-10 text-remindly-text">
      <section aria-labelledby="not-found-heading" className="w-full max-w-xl rounded-3xl border border-remindly-border bg-remindly-surface p-6 text-center shadow-lg sm:p-10">
        <Image
          alt="Remindly"
          className="mx-auto h-14 w-20 object-contain dark:hidden"
          height={432}
          src="/assets/remindly.logo.v2.png"
          width={578}
        />
        <Image
          alt="Remindly"
          className="mx-auto hidden h-14 w-20 object-contain dark:block"
          height={432}
          src="/assets/remindly.logo.dark.png"
          width={578}
        />
        <div aria-hidden="true" className="relative mx-auto mt-2 h-48 w-64 max-w-full">
          <svg className="h-full w-full" fill="none" viewBox="0 0 256 192" xmlns="http://www.w3.org/2000/svg">
            <path d="m31 42 2 7 7 2-7 2-2 7-2-7-7-2 7-2 2-7ZM211 28l1.5 5.5L218 35l-5.5 1.5L211 42l-1.5-5.5L204 35l5.5-1.5L211 28ZM220 102l1 4 4 1-4 1-1 4-1-4-4-1 4-1 1-4Z" fill="var(--remindly-category-violet)" />
            <path d="M48 54h31m-15-15v31m121-5h29m-14-14v29m-92 59h45m-22-22v45" stroke="var(--remindly-category-violet)" strokeDasharray="2 7" strokeLinecap="round" strokeWidth="2" />
            <path d="M96 73c-17 0-28 14-28 32v14c0 10-5 17-12 25h80c-7-8-12-15-12-25v-14c0-18-11-32-28-32Z" fill="var(--remindly-text-accent-secondary)" stroke="var(--remindly-burgundy)" strokeWidth="4" />
            <path d="M82 87c-3 5-4 11-4 18v13c0 8-2 14-7 20" stroke="var(--remindly-warm-cream)" strokeLinecap="round" strokeOpacity=".8" strokeWidth="6" />
            <path d="M84 73a12 12 0 0 1 24 0" stroke="var(--remindly-text-accent-secondary)" strokeWidth="7" />
            <path d="M86 144a10 10 0 0 0 20 0" fill="var(--remindly-text-accent)" />
            <path d="m55 79 7-21 35-12 35 12 7 21H55Z" fill="var(--remindly-text)" stroke="var(--remindly-muted)" strokeLinejoin="round" strokeWidth="3" />
            <path d="M53 79h89" stroke="var(--remindly-text-accent-secondary)" strokeLinecap="round" strokeWidth="8" />
            <circle cx="158" cy="117" r="20" fill="var(--remindly-warm-cream)" fillOpacity=".55" stroke="var(--remindly-text-accent-secondary)" strokeWidth="5" />
            <path d="m173 132 16 16" stroke="var(--remindly-burgundy)" strokeLinecap="round" strokeWidth="8" />
            <circle cx="158" cy="117" r="12" stroke="var(--remindly-warm-cream)" strokeOpacity=".75" strokeWidth="2" />
          </svg>
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-remindly-charcoal-brown" id="not-found-heading">
          404 — Lost in Time!
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-remindly-muted">
          Looks like this page hasn’t been scheduled in this dimension.
        </p>
        <Link
          className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-remindly-burgundy px-5 font-semibold text-remindly-action-text transition-colors hover:bg-remindly-wine-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
          href="/dashboard"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Back to Safety (Dashboard)
        </Link>
      </section>
    </main>
  );
}
