import { DashboardPanel, DashboardPanelHeading } from './DashboardPanel';

type CompletionProgressProps = {
  completionRate: number;
  completed: number;
  total: number;
};

const RADIUS = 48;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function CompletionProgress({
  completionRate,
  completed,
  total,
}: CompletionProgressProps) {
  const progress = Math.min(100, Math.max(0, completionRate));
  const dashOffset = CIRCUMFERENCE * (1 - progress / 100);

  return (
    <DashboardPanel labelledBy="completion-heading">
      <DashboardPanelHeading
        description="Your reminders, at a glance"
        id="completion-heading"
        title="Completion progress"
      />
      <div className="flex min-h-52 flex-col items-center justify-center pt-2">
        <svg
          aria-label={`${progress}% of reminders completed`}
          className="size-36 overflow-visible"
          role="img"
          viewBox="0 0 120 120"
        >
          <circle
            className="fill-none stroke-[var(--remindly-border)] stroke-[10]"
            cx="60"
            cy="60"
            r={RADIUS}
          />
          <circle
            className="fill-none stroke-[var(--remindly-chart-burgundy)] stroke-[10] [stroke-linecap:round] [transform:rotate(-90deg)] [transform-origin:center]"
            cx="60"
            cy="60"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
          <text className="fill-[var(--remindly-charcoal-brown)] text-2xl font-bold" textAnchor="middle" x="60" y="58">
            {progress}%
          </text>
          <text className="fill-[var(--remindly-muted)] text-[9px]" textAnchor="middle" x="60" y="76">
            complete
          </text>
        </svg>
        <p className="mt-1 text-sm text-remindly-muted">
          <strong className="text-remindly-charcoal-brown">{completed.toLocaleString()}</strong> of {total.toLocaleString()} reminders
          completed
        </p>
      </div>
    </DashboardPanel>
  );
}
