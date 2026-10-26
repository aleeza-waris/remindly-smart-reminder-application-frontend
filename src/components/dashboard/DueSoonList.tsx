import { Check, Clock3 } from 'lucide-react';
import type { DashboardReminder } from '../../types/dashboard';
import { DashboardPanel, DashboardPanelHeading } from './DashboardPanel';

type DueSoonListProps = {
  reminders: DashboardReminder[];
  timeZone: string;
  completingId: string | null;
  completionError: string | null;
  onComplete: (reminderId: string) => void;
};

const categoryLabel = (category: string) =>
  category.charAt(0).toUpperCase() + category.slice(1);

const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-slate-400',
  medium: 'bg-emerald-600 dark:bg-emerald-400',
  high: 'bg-amber-600 dark:bg-amber-400',
  urgent: 'bg-rose-600 dark:bg-rose-400',
};

export default function DueSoonList({
  reminders,
  timeZone,
  completingId,
  completionError,
  onComplete,
}: DueSoonListProps) {
  return (
    <DashboardPanel labelledBy="due-soon-heading">
      <div className="flex items-start justify-between gap-4">
        <DashboardPanelHeading
          description="Coming up in the next 7 days"
          id="due-soon-heading"
          title="Due soon"
        />
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-remindly-elevated-surface px-2 text-sm font-bold text-remindly-text-accent">
          {reminders.length}
        </span>
      </div>

      {completionError && (
        <p className="my-4 text-sm text-remindly-danger" role="alert">
          {completionError}
        </p>
      )}

      {reminders.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
          <span aria-hidden="true" className="grid size-11 place-items-center rounded-full bg-remindly-success-soft text-remindly-success">
            <Check size={21} />
          </span>
          <p className="mb-1 mt-3 font-semibold text-remindly-charcoal-brown">
            You’re all clear for the next week.
          </p>
          <span className="text-sm text-remindly-muted">
            New reminders due within seven days will show up here.
          </span>
        </div>
      ) : (
        <ul className="mt-4 grid list-none p-0">
          {reminders.map((reminder) => {
            const dueDate = new Date(reminder.dueDate);
            const dueLabel = new Intl.DateTimeFormat(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
              timeZone,
            }).format(dueDate);
            const isCompleting = completingId === reminder._id;

            return (
              <li className="flex min-w-0 items-center gap-3 border-t border-remindly-border py-4 max-sm:gap-2" key={reminder._id}>
                <div
                  aria-hidden="true"
                  className={`w-1 shrink-0 self-stretch rounded ${PRIORITY_STYLES[reminder.priority] ?? PRIORITY_STYLES.medium}`}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-remindly-charcoal-brown">
                    {reminder.title}
                  </h3>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-remindly-muted">
                    <Clock3 aria-hidden="true" size={14} />
                    <time dateTime={dueDate.toISOString()}>{dueLabel}</time>
                    <span className="rounded-full bg-remindly-warm-cream px-2 py-1">
                      {categoryLabel(reminder.category)}
                    </span>
                  </p>
                </div>
                <button
                  aria-label={`Mark ${reminder.title} complete`}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl bg-remindly-warm-cream px-3 text-sm font-semibold text-remindly-text-accent hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus disabled:cursor-wait disabled:opacity-60"
                  disabled={isCompleting}
                  onClick={() => onComplete(reminder._id)}
                  type="button"
                >
                  <Check aria-hidden="true" size={16} />
                  <span className="sr-only sm:not-sr-only">
                    {isCompleting ? 'Saving…' : 'Complete'}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </DashboardPanel>
  );
}
