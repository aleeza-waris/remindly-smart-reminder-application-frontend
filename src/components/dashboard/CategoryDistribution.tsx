import type { ReminderStats } from '../../types/dashboard';
import { DashboardPanel, DashboardPanelHeading } from './DashboardPanel';

const CATEGORY_LABELS: Record<string, string> = {
  work: 'Work',
  personal: 'Personal',
  health: 'Health',
  study: 'Study',
  finance: 'Finance',
  urgent: 'Urgent',
  other: 'Other',
};

const CATEGORY_TONES = [
  {
    chart: 'stroke-[var(--remindly-chart-burgundy)]',
    dot: 'bg-[var(--remindly-chart-burgundy)]',
  },
  {
    chart: 'stroke-[var(--remindly-chart-rose)]',
    dot: 'bg-[var(--remindly-chart-rose)]',
  },
  { chart: 'stroke-remindly-category-blush', dot: 'bg-remindly-category-blush' },
  { chart: 'stroke-remindly-category-green', dot: 'bg-remindly-category-green' },
  { chart: 'stroke-remindly-category-amber', dot: 'bg-remindly-category-amber' },
  { chart: 'stroke-remindly-category-slate', dot: 'bg-remindly-category-slate' },
  { chart: 'stroke-remindly-category-violet', dot: 'bg-remindly-category-violet' },
];
const RADIUS = 43;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type CategoryDistributionProps = {
  byCategory: ReminderStats['byCategory'];
};

export default function CategoryDistribution({ byCategory }: CategoryDistributionProps) {
  const categories = Object.entries(byCategory)
    .filter(([, count]) => count > 0)
    .sort(([left], [right]) => left.localeCompare(right));
  const total = categories.reduce((sum, [, count]) => sum + count, 0);
  let offset = 0;

  return (
    <DashboardPanel labelledBy="category-heading">
      <DashboardPanelHeading
        description="How your reminders are grouped"
        id="category-heading"
        title="Your categories"
      />
      {total === 0 ? (
        <p className="grid min-h-52 place-items-center text-center text-sm text-remindly-muted">
          Categories will appear here when you add reminders.
        </p>
      ) : (
        <div className="grid min-h-52 grid-cols-2 items-center gap-5 px-1 pt-2 max-md:gap-3 max-[380px]:grid-cols-[6.875rem_minmax(0,1fr)]">
          <svg
            aria-label={`Reminder distribution across ${categories.length} categories`}
            className="w-full max-w-44 justify-self-center overflow-visible"
            role="img"
            viewBox="0 0 110 110"
          >
            <circle
              className="fill-none stroke-[var(--remindly-border)] stroke-[14]"
              cx="55"
              cy="55"
              r={RADIUS}
            />
            {categories.map(([category, count], index) => {
              const segment = (count / total) * CIRCUMFERENCE;
              const segmentOffset = offset;
              offset += segment;
              return (
                <circle
                  className={`fill-none stroke-[14] [transform:rotate(-90deg)] [transform-origin:center] ${CATEGORY_TONES[index % CATEGORY_TONES.length].chart}`}
                  cx="55"
                  cy="55"
                  key={category}
                  r={RADIUS}
                  strokeDasharray={`${segment} ${CIRCUMFERENCE - segment}`}
                  strokeDashoffset={-segmentOffset}
                />
              );
            })}
            <text
              className="fill-[var(--remindly-charcoal-brown)] text-xl font-bold"
              textAnchor="middle"
              x="55"
              y="53"
            >
              {total}
            </text>
            <text
              className="fill-[var(--remindly-muted)] text-[9px]"
              textAnchor="middle"
              x="55"
              y="68"
            >
              reminders
            </text>
          </svg>
          <ul className="grid list-none gap-3 p-0 max-[380px]:gap-2">
            {categories.map(([category, count], index) => (
              <li
                className="grid grid-cols-[9px_minmax(0,1fr)_auto] items-center gap-2 text-sm text-remindly-muted"
                key={category}
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${CATEGORY_TONES[index % CATEGORY_TONES.length].dot}`}
                />
                <span>{CATEGORY_LABELS[category] ?? category}</span>
                <strong className="font-semibold text-remindly-charcoal-brown">
                  {count}
                </strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardPanel>
  );
}
