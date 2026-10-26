import type { LucideIcon } from 'lucide-react';

type DashboardStatCardProps = {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  tone: 'burgundy' | 'rose' | 'green' | 'amber';
};

const TONE_STYLES = {
  burgundy: 'bg-remindly-elevated-surface text-remindly-chart-burgundy',
  rose: 'bg-remindly-elevated-surface text-remindly-chart-rose',
  green: 'bg-remindly-success-soft text-remindly-success',
  amber: 'bg-remindly-warning-soft text-remindly-warning',
} satisfies Record<DashboardStatCardProps['tone'], string>;

export default function DashboardStatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: DashboardStatCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-remindly-border bg-remindly-surface p-4 shadow-sm sm:p-5">
      <div className={`grid size-10 place-items-center rounded-xl ${TONE_STYLES[tone]}`} aria-hidden="true">
        <Icon size={19} strokeWidth={1.9} />
      </div>
      <p className="mb-1 mt-4 text-sm font-medium text-remindly-muted">{label}</p>
      <p className="text-3xl font-bold tracking-tight text-remindly-charcoal-brown sm:text-4xl">
        {value.toLocaleString()}
      </p>
      <p className="mt-2 text-xs text-remindly-muted">{detail}</p>
    </article>
  );
}
