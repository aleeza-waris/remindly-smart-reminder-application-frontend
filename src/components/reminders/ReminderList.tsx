import { CalendarClock, Check, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { ConfigProvider, Table, type TableColumnsType } from 'antd';
import type { ReminderRecord } from '../../types/reminder';

const categoryLabel = (category: string) => category[0].toUpperCase() + category.slice(1);
const priorityLabel = (priority: string) => priority[0].toUpperCase() + priority.slice(1);

const formatDueDate = (value: string, timeZone: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(new Date(value));

const priorityStyles: Record<ReminderRecord['priority'], string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-100',
  medium: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  high: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  urgent: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200',
};
const tableTheme = {
  token: {
    borderRadius: 12,
    colorBgContainer: 'var(--remindly-surface)',
    colorBgElevated: 'var(--remindly-elevated-surface)',
    colorBorder: 'var(--remindly-border)',
    colorBorderSecondary: 'var(--remindly-border)',
    colorFillAlter: 'var(--remindly-elevated-surface)',
    colorFillQuaternary: 'var(--remindly-elevated-surface)',
    colorPrimary: 'var(--remindly-burgundy)',
    colorPrimaryBgHover: 'var(--remindly-elevated-surface)',
    colorBgTextHover: 'var(--remindly-elevated-surface)',
    colorText: 'var(--remindly-text)',
    colorTextSecondary: 'var(--remindly-muted)',
    fontFamily: 'inherit',
  },
  components: {
    Table: {
      rowHoverBg: 'var(--remindly-elevated-surface)',
      rowSelectedBg: 'var(--remindly-elevated-surface)',
      headerBg: 'var(--remindly-surface)',
      headerColor: 'var(--remindly-text)',
      colorPrimary: 'var(--remindly-burgundy)',
      colorBgContainer: 'var(--remindly-surface)',
      colorBgElevated: 'var(--remindly-elevated-surface)',
      colorBorder: 'var(--remindly-border)',
      colorSplit: 'var(--remindly-border)',
      colorText: 'var(--remindly-text)',
      colorTextSecondary: 'var(--remindly-muted)',
    },
  },
};

function StatusBadge({ reminder }: { reminder: ReminderRecord }) {
  const isOverdue = reminder.status === 'pending' && new Date(reminder.dueDate) < new Date();
  const label = reminder.status === 'completed' ? 'Completed' : isOverdue ? 'Overdue' : 'Upcoming';
  const style =
    reminder.status === 'completed'
      ? 'bg-remindly-success-soft text-remindly-success'
      : isOverdue
        ? 'bg-remindly-danger-soft text-remindly-danger'
        : 'bg-remindly-elevated-surface text-remindly-muted';

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}>{label}</span>;
}

function ReminderActions({
  completingId,
  reminder,
  onComplete,
  onDelete,
  onEdit,
}: {
  completingId: string | null;
  reminder: ReminderRecord;
  onComplete: (reminder: ReminderRecord, completed: boolean) => void;
  onDelete: (reminder: ReminderRecord) => void;
  onEdit: (reminder: ReminderRecord) => void;
}) {
  const actionClass =
    'grid size-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-remindly-border text-remindly-muted hover:bg-remindly-elevated-surface hover:text-remindly-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus disabled:cursor-wait disabled:opacity-50';

  return (
    <div className="flex items-center gap-2">
      <button
        aria-label={reminder.status === 'completed' ? `Reopen ${reminder.title}` : `Complete ${reminder.title}`}
        className={actionClass}
        disabled={completingId === reminder._id}
        onClick={() => onComplete(reminder, reminder.status !== 'completed')}
        type="button"
      >
        {reminder.status === 'completed' ? (
          <RotateCcw aria-hidden="true" size={17} />
        ) : (
          <Check aria-hidden="true" size={18} />
        )}
      </button>
      <button
        aria-label={`Edit ${reminder.title}`}
        className={actionClass}
        disabled={completingId === reminder._id}
        onClick={() => onEdit(reminder)}
        type="button"
      >
        <Pencil aria-hidden="true" size={17} />
      </button>
      <button
        aria-label={`Delete ${reminder.title}`}
        className={actionClass}
        disabled={completingId === reminder._id}
        onClick={() => onDelete(reminder)}
        type="button"
      >
        <Trash2 aria-hidden="true" size={17} />
      </button>
    </div>
  );
}

export default function ReminderList({
  completingId,
  isTable,
  onComplete,
  onDelete,
  onEdit,
  reminders,
  timeZone,
}: {
  completingId: string | null;
  isTable: boolean;
  onComplete: (reminder: ReminderRecord, completed: boolean) => void;
  onDelete: (reminder: ReminderRecord) => void;
  onEdit: (reminder: ReminderRecord) => void;
  reminders: ReminderRecord[];
  timeZone: string;
}) {
  const columns: TableColumnsType<ReminderRecord> = [
    {
      title: 'Reminder',
      dataIndex: 'title',
      key: 'title',
      width: 260,
      render: (_title, reminder) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-remindly-charcoal-brown">{reminder.title}</p>
          {reminder.description && (
            <p className="mt-1 truncate text-xs text-remindly-muted">{reminder.description}</p>
          )}
        </div>
      ),
    },
    {
      title: 'Due',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 190,
      render: (dueDate: string) => (
        <time className="whitespace-nowrap text-remindly-muted" dateTime={dueDate}>
          {formatDueDate(dueDate, timeZone)}
        </time>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 130,
      render: (value: ReminderRecord['category']) => (
        <span className="text-remindly-muted">{categoryLabel(value)}</span>
      ),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 120,
      render: (value: ReminderRecord['priority']) => (
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[value]}`}>
          {priorityLabel(value)}
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (_value, reminder) => <StatusBadge reminder={reminder} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 176,
      align: 'right',
      render: (_value, reminder) => (
        <div className="flex justify-end">
          <ReminderActions
            completingId={completingId}
            onComplete={onComplete}
            onDelete={onDelete}
            onEdit={onEdit}
            reminder={reminder}
          />
        </div>
      ),
    },
  ];

  if (!isTable) {
    return (
      <ul className="grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 xl:grid-cols-3">
        {reminders.map((reminder) => (
          <li
            className="flex min-w-0 flex-col rounded-2xl border border-remindly-border bg-remindly-surface p-5 shadow-sm"
            key={reminder._id}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="min-w-0 break-words text-base font-semibold text-remindly-charcoal-brown">
                {reminder.title}
              </h2>
              <StatusBadge reminder={reminder} />
            </div>
            {reminder.description && (
              <p className="mt-2 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-remindly-muted">
                {reminder.description}
              </p>
            )}
            <p className="mt-4 flex items-center gap-2 text-sm text-remindly-muted">
              <CalendarClock aria-hidden="true" size={16} />
              <time dateTime={reminder.dueDate}>
                {formatDueDate(reminder.dueDate, timeZone)}
              </time>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-remindly-elevated-surface px-2.5 py-1 text-xs text-remindly-muted">
                {categoryLabel(reminder.category)}
              </span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[reminder.priority]}`}>
                {priorityLabel(reminder.priority)}
              </span>
            </div>
            <div className="mt-auto flex justify-end pt-4">
              <ReminderActions
                completingId={completingId}
                onComplete={onComplete}
                onDelete={onDelete}
                onEdit={onEdit}
                reminder={reminder}
              />
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      aria-label="Reminder table. Scroll horizontally to view all columns."
      className="overflow-x-auto rounded-2xl border border-remindly-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
      role="region"
      tabIndex={0}
    >
      <ConfigProvider theme={tableTheme}>
        <Table<ReminderRecord>
          columns={columns}
          className="remindly-table"
          dataSource={reminders}
          pagination={false}
          rowKey="_id"
          scroll={{ x: 996 }}
          size="small"
        />
      </ConfigProvider>
    </div>
  );
}