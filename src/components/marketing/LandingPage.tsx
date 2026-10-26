
import {
  ArrowDown,
  ArrowRight,
  BellRing,
  CalendarClock,
  ChartNoAxesCombined,
  Check,
  CheckCircle2,
  Clock3,
  Mail,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import LandingHeader from './LandingHeader';

const features = [
  {
    icon: CalendarClock,
    title: 'Plan one-time reminders',
    description:
      'Choose a due date, category, priority, and when you would like an advance notice.',
  },
  {
    icon: CheckCircle2,
    title: 'Know what needs attention',
    description:
      'Organize upcoming, completed, and overdue reminders, then complete tasks from your workspace.',
  },
  {
    icon: Mail,
    title: 'Email alerts, thoughtfully timed',
    description:
      'Schedule alerts for the due time or supported intervals in advance through the Gmail API sender.',
    note: 'Email delivery depends on the sender configuration.',
  },
  {
    icon: ChartNoAxesCombined,
    title: 'See your progress',
    description:
      'A completion ring and category breakdown give you a simple view of how your reminders are going.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Capture what matters',
    description: 'Add a one-time reminder with its due date, category, and priority.',
  },
  {
    number: '02',
    title: 'Choose your timing',
    description: 'Set an optional email alert for the due time or a supported interval in advance.',
  },
  {
    number: '03',
    title: 'Stay on top of your day',
    description: 'Review what is coming up, complete reminders, and follow your progress.',
  },
];

const containerClass = 'mx-auto w-full max-w-6xl px-4 sm:px-6';
const primaryButtonClass =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-remindly-burgundy px-5 font-semibold text-remindly-action-text no-underline transition-colors hover:bg-remindly-wine-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus';

function BrandLogo({ compact = false }: { compact?: boolean }) {
  const imageSize = compact ? 'h-12 w-16' : 'h-14 w-18';
  return (
    <Link
      aria-label="Remindly home"
      className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
      href="/"
    >
      <Image
        alt=""
        className={`${imageSize} object-contain dark:hidden`}
        height={432}
        src="/assets/remindly.logo.v2.png"
        width={578}
      />
      <Image
        alt=""
        className={`hidden ${imageSize} object-contain dark:block`}
        height={432}
        src="/assets/remindly.logo.dark.png"
        width={578}
      />
    </Link>
  );
}

function AppPreview() {
  return (
    <div
      aria-label="Illustrative preview of the Remindly dashboard"
      className="remindly-preview-float animate-remindly-preview-float relative mx-auto w-full max-w-xl rounded-3xl border border-remindly-border bg-remindly-surface p-4 shadow-xl sm:p-6"
      role="img"
    >
      <div className="flex items-center justify-between border-b border-remindly-border pb-4 text-sm text-remindly-muted">
        <span className="flex items-center gap-2 font-medium text-remindly-text">
          <BellRing aria-hidden="true" className="text-remindly-text-accent" size={18} />
          Remindly overview
        </span>
        <span aria-hidden="true" className="flex gap-1.5">
          <i className="size-2 rounded-full bg-remindly-border" />
          <i className="size-2 rounded-full bg-remindly-border" />
          <i className="size-2 rounded-full bg-remindly-border" />
        </span>
      </div>
      <div className="py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-remindly-text-accent-secondary">
          Your space
        </p>
        <p className="mt-1 text-lg font-semibold text-remindly-charcoal-brown">
          A calmer view of your week
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3" aria-hidden="true">
          {['Upcoming', 'Completed', 'Overdue'].map((label) => (
            <div
              className="rounded-xl border border-remindly-border bg-remindly-elevated-surface p-3"
              key={label}
            >
              <span className="block h-2 w-12 rounded bg-remindly-border" />
              <span className="mt-3 block h-5 w-8 rounded bg-remindly-border/70" />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1.5fr_1fr]">
          <div className="rounded-xl border border-remindly-border p-4">
            <p className="text-sm font-semibold text-remindly-charcoal-brown">Coming up</p>
            {[0, 1, 2].map((item) => (
              <div className="flex h-10 items-center gap-3 border-b border-remindly-border last:border-0" key={item}>
                <span
                  className={`h-5 w-1 rounded ${
                    [
                      'bg-remindly-chart-rose',
                      'bg-amber-600 dark:bg-amber-400',
                      'bg-emerald-600 dark:bg-emerald-400',
                    ][item]
                  }`}
                />
                <span className="grid flex-1 gap-1.5">
                  <span className="h-1.5 w-3/4 rounded bg-remindly-border" />
                  <span className="h-1.5 w-1/2 rounded bg-remindly-border/70" />
                </span>
                <span className="grid size-5 place-items-center rounded border border-remindly-border text-remindly-text-accent">
                  {item === 2 && <Check aria-hidden="true" size={12} />}
                </span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-remindly-border p-4">
            <p className="text-sm font-semibold text-remindly-charcoal-brown">Progress</p>
            <div className="mx-auto mt-4 grid size-20 place-items-center rounded-full border-8 border-remindly-border">
              <span className="size-12 rounded-full bg-remindly-surface" />
            </div>
            <p className="mt-3 text-center text-xs text-remindly-muted">Your reminders, at a glance</p>
          </div>
        </div>
      </div>
      <p className="border-t border-remindly-border pt-3 text-right text-xs text-remindly-muted">
        A simple place to see what is next.
      </p>
      <div className="absolute -bottom-5 right-2 flex min-h-11 items-center gap-2 rounded-xl border border-remindly-border bg-remindly-surface px-3 text-xs font-semibold text-remindly-charcoal-brown shadow-lg sm:-right-4">
        <Clock3 aria-hidden="true" className="text-remindly-text-accent-secondary" size={16} />
        Make space for what matters
      </div>
    </div>
  );
}

export default function LandingPage({ logoutFailed = false }: { logoutFailed?: boolean }) {
  return (
    <main className="min-h-screen overflow-hidden">
      <LandingHeader
  containerClass={containerClass}
  primaryButtonClass={primaryButtonClass}
/>

      {logoutFailed && (
        <p className={`${containerClass} mt-4 rounded-xl border border-remindly-border bg-remindly-elevated-surface py-3 text-sm leading-relaxed text-remindly-muted`} role="status">
          You have been signed out on this device, but Remindly could not confirm that your server session was revoked.
        </p>
      )}

      <section aria-labelledby="landing-hero-title" className="bg-remindly-page py-16 sm:py-20 lg:py-24">
        <div className={`${containerClass} grid items-center gap-12 lg:grid-cols-2`}>
          <div className="text-center lg:text-left">
            <p
              className="remindly-hero-enter animate-remindly-hero-enter mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-remindly-text-accent-secondary"
              style={{ animationDelay: '0ms' }}
            >
              <BellRing aria-hidden="true" size={16} />
              A little more room in your day
            </p>
            <h1
              className="remindly-hero-enter animate-remindly-hero-enter text-4xl font-bold leading-tight tracking-tight text-remindly-charcoal-brown sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '100ms' }}
            >
              Make time for what matters.
            </h1>
            <p
              className="remindly-hero-enter animate-remindly-hero-enter mx-auto mt-5 max-w-xl text-base leading-relaxed text-remindly-muted lg:mx-0"
              style={{ animationDelay: '200ms' }}
            >
              Keep important moments in view with thoughtful reminders, timely email alerts,
              and a clearer picture of what you have accomplished.
            </p>
            <div
              className="remindly-hero-enter animate-remindly-hero-enter mt-7 flex flex-wrap justify-center gap-3 lg:justify-start"
              style={{ animationDelay: '300ms' }}
            >
              <Link className={primaryButtonClass} href="/auth?mode=register">
                Get Started <ArrowRight aria-hidden="true" size={17} />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-remindly-border bg-remindly-surface px-5 font-semibold text-remindly-charcoal-brown hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
                href="/auth?mode=login"
              >
                Sign In
              </Link>
            </div>
            <a
              className="remindly-hero-enter animate-remindly-hero-enter mt-7 inline-flex items-center gap-2 rounded text-sm font-medium text-remindly-muted hover:text-remindly-text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
              href="#features"
              style={{ animationDelay: '400ms' }}
            >
              Discover Remindly <ArrowDown aria-hidden="true" size={15} />
            </a>
          </div>
          <AppPreview />
        </div>
      </section>

      <section aria-labelledby="landing-features-title" className="border-t border-remindly-border bg-remindly-surface py-16 sm:py-20" id="features">
        <div className={containerClass}>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-remindly-text-accent-secondary">
              Thoughtful by design
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-remindly-charcoal-brown sm:text-4xl">
              A clearer way to keep things in mind.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-remindly-muted">
              The essentials to help you plan ahead, notice your progress, and stay focused on the next important thing.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {features.map(({ icon: Icon, title, description, note }) => (
              <article className="flex min-h-56 flex-col rounded-2xl border border-remindly-border bg-remindly-elevated-surface p-5" key={title}>
                <span className="grid size-11 place-items-center rounded-xl bg-remindly-surface text-remindly-text-accent-secondary" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h3 className="mb-2 mt-4 text-base font-semibold tracking-tight text-remindly-charcoal-brown">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-remindly-muted">{description}</p>
                {note && <span className="mt-auto pt-4 text-xs font-medium text-remindly-text-accent-secondary">{note}</span>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="landing-steps-title" className="bg-remindly-page py-16 sm:py-20" id="how-it-works">
        <div className={containerClass}>
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-remindly-text-accent-secondary">
              A gentler routine
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-remindly-charcoal-brown sm:text-4xl">
              Three small steps. More peace of mind.
            </h2>
            <p className="mt-4 leading-relaxed text-remindly-muted">
              Keep planning simple, from the first note to a satisfying checkmark.
            </p>
          </div>
          <ol className="grid list-none gap-6 p-0 md:grid-cols-3">
            {steps.map(({ number, title, description }) => (
              <li className="border-t border-remindly-border pt-5" key={number}>
                <span className="text-xs font-bold tracking-widest text-remindly-text-accent-secondary">
                  {number}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-remindly-charcoal-brown">{title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-remindly-muted">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="landing-cta-title" className="bg-remindly-page px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto flex min-h-64 max-w-6xl flex-col items-center justify-center rounded-3xl border border-remindly-border bg-remindly-surface px-6 py-10 text-center shadow-sm">
          <span className="mb-4 grid size-11 place-items-center rounded-2xl bg-remindly-elevated-surface text-remindly-text-accent-secondary" aria-hidden="true">
            <BellRing size={21} />
          </span>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-remindly-charcoal-brown">
            Make a little more room for what matters.
          </h2>
          <p className="mb-5 mt-3 text-sm text-remindly-muted">
            Start with one reminder. Build a routine that works for you.
          </p>
          <Link className={primaryButtonClass} href="/auth?mode=register">
            Get Started <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-remindly-border bg-remindly-surface">
        <div className={`${containerClass} py-7`}>
          <div className="flex flex-col gap-5 border-b border-remindly-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-sm">
              <BrandLogo compact />
              <p className="mt-1 text-sm leading-relaxed text-remindly-muted">
                Thoughtful reminders to help you focus on what matters today.
              </p>
            </div>
            <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
              <a className="text-sm font-medium text-remindly-muted hover:text-remindly-text-accent" href="#features">Features</a>
              <a className="text-sm font-medium text-remindly-muted hover:text-remindly-text-accent" href="#how-it-works">How It Works</a>
              <Link className="text-sm font-medium text-remindly-muted hover:text-remindly-text-accent" href="/auth?mode=login">Sign In</Link>
              <Link className="text-sm font-medium text-remindly-muted hover:text-remindly-text-accent" href="/auth?mode=register">Get Started</Link>
            </nav>
          </div>
          <p className="pt-4 text-xs text-remindly-muted">
            © {new Date().getFullYear()} Remindly
          </p>
        </div>
      </footer>
    </main>
  );
}
