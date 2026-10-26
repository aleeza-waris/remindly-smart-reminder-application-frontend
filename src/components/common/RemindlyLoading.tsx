import Image from 'next/image';

const shimmerClass =
  'animate-dashboard-loading rounded-full bg-linear-to-r from-remindly-elevated-surface via-remindly-category-violet/30 to-remindly-elevated-surface bg-size-[220%_100%] motion-reduce:animate-none';

export default function RemindlyLoading({ message }: { message: string }) {
  return (
    <main
      aria-busy="true"
      className="grid min-h-dvh place-items-center bg-remindly-page px-6 py-10 text-remindly-muted"
    >
      <section aria-labelledby="loading-heading" className="flex w-full max-w-2xl flex-col items-center text-center">
        <Image
          alt=""
          className="h-16 w-24 object-contain dark:hidden"
          height={432}
          src="/assets/remindly.logo.v2.png"
          width={578}
        />
        <Image
          alt=""
          className="hidden h-16 w-24 object-contain dark:block"
          height={432}
          src="/assets/remindly.logo.dark.png"
          width={578}
        />
        <div aria-hidden="true" className="relative mt-5 grid size-40 place-items-center">
          <span
            className="absolute inset-5 animate-pulse rounded-full bg-purple-300/40 blur-2xl motion-reduce:animate-none dark:bg-purple-500/25"
          />
          <svg
            className="relative w-32 animate-remindly-bell-float drop-shadow-xl"
            fill="none"
            viewBox="0 0 160 160"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="remindly-loading-bell" x1="42" x2="119" y1="40" y2="116" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--remindly-text-accent-secondary)" />
                <stop offset=".55" stopColor="var(--remindly-text-accent)" />
                <stop offset="1" stopColor="var(--remindly-burgundy)" />
              </linearGradient>
              <linearGradient id="remindly-loading-highlight" x1="52" x2="84" y1="40" y2="95" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--remindly-warm-cream)" stopOpacity=".9" />
                <stop offset="1" stopColor="var(--remindly-warm-cream)" stopOpacity=".12" />
              </linearGradient>
            </defs>
            <path
              d="M80 25c-21 0-35 17-35 39v22c0 13-7 22-15 31-3 4 0 9 5 9h90c5 0 8-5 5-9-8-9-15-18-15-31V64c0-22-14-39-35-39Z"
              fill="url(#remindly-loading-bell)"
              stroke="var(--remindly-burgundy)"
              strokeWidth="3"
            />
            <path
              d="M58 49c-4 6-6 13-6 22v19c0 10-3 18-9 26"
              stroke="url(#remindly-loading-highlight)"
              strokeLinecap="round"
              strokeWidth="7"
            />
            <path d="M68 25a12 12 0 0 1 24 0" stroke="var(--remindly-text-accent-secondary)" strokeWidth="8" />
            <path d="M70 126a10 10 0 0 0 20 0" fill="var(--remindly-text-accent)" />
            <path d="M49 112h62" stroke="var(--remindly-dusty-blush)" strokeOpacity=".6" strokeWidth="3" />
          </svg>
          <svg className="absolute right-3 top-5 size-7 animate-pulse text-remindly-category-violet motion-reduce:animate-none" viewBox="0 0 24 24">
            <path d="M12 1.5 14.4 9.6 22.5 12l-8.1 2.4L12 22.5l-2.4-8.1L1.5 12l8.1-2.4L12 1.5Z" fill="currentColor" />
          </svg>
          <svg className="absolute left-2 top-12 size-4 animate-pulse text-remindly-category-violet motion-reduce:animate-none" viewBox="0 0 24 24">
            <path d="M12 1.5 14.4 9.6 22.5 12l-8.1 2.4L12 22.5l-2.4-8.1L1.5 12l8.1-2.4L12 1.5Z" fill="currentColor" />
          </svg>
        </div>
        <h1 className="mt-5 text-xl font-semibold text-remindly-charcoal-brown" id="loading-heading">
          Tuning your schedule...
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-remindly-muted">
          Hang tight, your reminders are almost ready! ✨
        </p>
        <div aria-hidden="true" className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              className="grid gap-3 rounded-2xl border border-remindly-border bg-remindly-surface p-4 shadow-sm"
              key={item}
            >
              <span className={`h-3 w-2/3 ${shimmerClass}`} />
              <span className={`h-3 w-full ${shimmerClass}`} />
              <span className={`h-3 w-1/2 ${shimmerClass}`} />
            </div>
          ))}
        </div>
        <p className="sr-only" role="status">
          {message}
        </p>
      </section>
    </main>
  );
}
