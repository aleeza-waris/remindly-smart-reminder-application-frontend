'use client';

import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '../layout/ThemeToggle';

type LandingHeaderProps = {
  containerClass: string;
  primaryButtonClass: string;
};

function HeaderBrandLogo() {
  return (
    <Link
      aria-label="Remindly home"
      className="inline-flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
      href="/"
    >
      <Image
        alt=""
        className="h-10 w-auto max-w-[150px] object-contain sm:h-12 sm:max-w-[180px] lg:h-14 lg:max-w-[200px] dark:hidden"
        height={432}
        src="/assets/remindly.logo.v2.png"
        width={578}
        priority
      />
      <Image
        alt=""
        className="hidden h-10 w-auto max-w-[150px] object-contain sm:h-12 sm:max-w-[180px] lg:h-14 lg:max-w-[200px] dark:block"
        height={432}
        src="/assets/remindly.logo.dark.png"
        width={578}
        priority
      />
    </Link>
  );
}

export default function LandingHeader({
  containerClass,
  primaryButtonClass,
}: LandingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const navigationLinkClass =
    'rounded-lg px-3 py-3 text-sm font-medium text-remindly-muted transition-colors hover:bg-remindly-elevated-surface hover:text-remindly-text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus';

  return (
    <header className="border-b border-remindly-border bg-remindly-surface">
      <div
        className={`${containerClass} flex min-h-16 items-center justify-between gap-3 py-2 sm:min-h-20`}
      >
        <HeaderBrandLogo />

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          <a
            className="text-sm font-medium text-remindly-muted transition-colors hover:text-remindly-text-accent"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium text-remindly-muted transition-colors hover:text-remindly-text-accent"
            href="#how-it-works"
          >
            How It Works
          </a>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 sm:gap-4 lg:flex">
          <ThemeToggle />

          <Link
            className="rounded-lg px-3 py-2 text-sm font-medium text-remindly-muted transition-colors hover:text-remindly-text-accent"
            href="/auth?mode=login"
          >
            Sign In
          </Link>

          <Link
            className={`${primaryButtonClass} min-h-10 px-3 text-sm sm:px-4`}
            href="/auth?mode=register"
          >
            Get Started
            <ArrowRight aria-hidden="true" size={15} />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          aria-label={
            menuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-landing-navigation"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-remindly-border text-remindly-charcoal-brown transition-colors hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus lg:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? (
            <X aria-hidden="true" size={20} />
          ) : (
            <Menu aria-hidden="true" size={20} />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-landing-navigation"
          className="border-t border-remindly-border bg-remindly-surface lg:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className={`${containerClass} flex flex-col gap-1 py-3`}
          >
            <a
              className={navigationLinkClass}
              href="#features"
              onClick={closeMenu}
            >
              Features
            </a>

            <a
              className={navigationLinkClass}
              href="#how-it-works"
              onClick={closeMenu}
            >
              How It Works
            </a>

            <div className="my-2 flex items-center justify-between border-t border-remindly-border px-3 pt-4">
              <span className="text-sm font-medium text-remindly-muted">
                Appearance
              </span>
              <ThemeToggle />
            </div>

            <Link
              className={navigationLinkClass}
              href="/auth?mode=login"
              onClick={closeMenu}
            >
              Sign In
            </Link>

            <Link
              className={`${primaryButtonClass} mt-2 min-h-11 w-full text-sm`}
              href="/auth?mode=register"
              onClick={closeMenu}
            >
              Get Started
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}