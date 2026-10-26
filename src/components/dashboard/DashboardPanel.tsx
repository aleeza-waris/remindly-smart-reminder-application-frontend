import type { ReactNode } from 'react';

export function DashboardPanel({
  children,
  labelledBy,
}: {
  children: ReactNode;
  labelledBy: string;
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      className="min-w-0 rounded-2xl border border-remindly-border bg-remindly-surface p-5 shadow-sm sm:p-6"
    >
      {children}
    </section>
  );
}

export function DashboardPanelHeading({
  description,
  id,
  title,
}: {
  description: string;
  id: string;
  title: string;
}) {
  return (
    <header className="space-y-1">
      <h2 className="text-base font-semibold tracking-tight text-remindly-charcoal-brown" id={id}>
        {title}
      </h2>
      <p className="text-sm text-remindly-muted">{description}</p>
    </header>
  );
}
