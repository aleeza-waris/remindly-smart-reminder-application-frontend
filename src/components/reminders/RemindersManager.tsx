'use client';

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AlertTriangle, LayoutGrid, List, Plus, RefreshCw, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getDashboardUser } from '../../services/dashboardService';
import { isValidTimeZone } from '../../lib/timeZone';
import {
  createReminder,
  deleteReminder,
  listReminders,
  setReminderCompleted,
  updateReminder,
} from '../../services/reminderService';
import {
  REMINDER_CATEGORIES,
  REMINDER_PRIORITIES,
  type ReminderFilters,
  type ReminderInput,
  type ReminderCategory,
  type ReminderRecord,
} from '../../types/reminder';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';
import compareRemindersByCreatedAt from '../../utils/compareRemindersByCreatedAt.js';
import DeleteReminderDialog from './DeleteReminderDialog';
import ReminderFormDialog from './ReminderFormDialog';
import ReminderList from './ReminderList';

type StatusFilter = 'all' | 'upcoming' | 'completed' | 'overdue';
type SortOrder = 'created-descending' | 'due-ascending' | 'due-descending' | 'title' | 'priority';

const PAGE_SIZE = 12;
const REMINDER_VIEW_STORAGE_KEY = 'remindly.reminders.view';
const statusFilters: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All reminders' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
  { id: 'overdue', label: 'Overdue' },
];
const priorityRank = { low: 0, medium: 1, high: 2, urgent: 3 };
const primaryButtonClass =
  'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-remindly-burgundy px-4 font-semibold text-remindly-action-text hover:bg-remindly-wine-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus';
const filterLabelClass = 'grid gap-1 text-xs font-semibold text-remindly-muted';
const filterSelectClass =
  'min-h-11 cursor-pointer rounded-xl border border-remindly-border bg-remindly-surface px-3 text-sm font-normal text-remindly-text focus:border-remindly-wine-rose focus:outline-none focus:ring-2 focus:ring-remindly-focus/40';
const paginationButtonClass =
  'min-h-11 cursor-pointer rounded-xl border border-remindly-border px-3 font-semibold text-remindly-text hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus disabled:opacity-50 disabled:cursor-not-allowed';

export default function RemindersManager() {
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ['dashboard', 'user'],
    queryFn: getDashboardUser,
  });
  const rawTimeZone = userQuery.data?.timezone || 'UTC';
  const timeZone = isValidTimeZone(rawTimeZone) ? rawTimeZone : 'UTC';
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ReminderCategory | ''>('');
  const [priority, setPriority] = useState<ReminderFilters['priority'] | ''>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('created-descending');
  const [isTable, setIsTable] = useState(false);
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<ReminderRecord | null>(null);
  const [deletingReminder, setDeletingReminder] = useState<ReminderRecord | null>(null);

  useEffect(() => {
    try {
      setIsTable(window.localStorage.getItem(REMINDER_VIEW_STORAGE_KEY) === 'table');
    } catch {
      // Keep the card view as the default when browser storage is unavailable.
    }
  }, []);

  const selectView = (view: 'card' | 'table') => {
    setIsTable(view === 'table');
    try {
      window.localStorage.setItem(REMINDER_VIEW_STORAGE_KEY, view);
    } catch {
      // The selected view still works for this page when storage is unavailable.
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const filters = useMemo<ReminderFilters>(
    () => ({
      ...(category ? { category } : {}),
      ...(priority ? { priority } : {}),
      ...(search ? { search } : {}),
      page,
      limit: PAGE_SIZE,
    }),
    [category, page, priority, search]
  );

  const remindersQuery = useQuery({
    queryKey: ['reminders', filters, statusFilter],
    queryFn: () => {
      const now = new Date().toISOString();
      if (statusFilter === 'upcoming') {
        return listReminders({ ...filters, status: 'pending', dueFrom: now });
      }
      if (statusFilter === 'completed') {
        return listReminders({ ...filters, status: 'completed' });
      }
      if (statusFilter === 'overdue') {
        return listReminders({ ...filters, status: 'pending', dueTo: now });
      }
      return listReminders(filters);
    },
  });

  const invalidateReminderData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['reminders'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'due-soon'] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: createReminder,
    onSuccess: async () => {
      setPage(1);
      setSortOrder('created-descending');
      await invalidateReminderData();
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: ReminderInput }) => updateReminder(id, input),
    onSuccess: invalidateReminderData,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteReminder,
    onSuccess: invalidateReminderData,
  });
  const completionMutation = useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      setReminderCompleted(id, completed),
    onSuccess: invalidateReminderData,
  });

  const pageCount = remindersQuery.data?.pagination.pages ?? 0;
  useEffect(() => {
    if (pageCount > 0 && page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const reminders = useMemo(() => {
    const data = [...(remindersQuery.data?.reminders ?? [])];
    switch (sortOrder) {
      case 'created-descending':
        return data.sort(compareRemindersByCreatedAt);
      case 'due-descending':
        return data.sort(
          (left, right) =>
            right.dueDate.localeCompare(left.dueDate) || compareRemindersByCreatedAt(left, right),
        );
      case 'title':
        return data.sort(
          (left, right) =>
            left.title.localeCompare(right.title) || compareRemindersByCreatedAt(left, right),
        );
      case 'priority':
        return data.sort(
          (left, right) =>
            priorityRank[right.priority] - priorityRank[left.priority] ||
            compareRemindersByCreatedAt(left, right),
        );
      default:
        return data.sort(
          (left, right) =>
            left.dueDate.localeCompare(right.dueDate) || compareRemindersByCreatedAt(left, right),
        );
    }
  }, [remindersQuery.data?.reminders, sortOrder]);

  const hasActiveFilters =
    statusFilter !== 'all' || Boolean(search || category || priority);

  const saveReminder = async (input: ReminderInput) => {
    if (editingReminder) {
      await updateMutation.mutateAsync({ id: editingReminder._id, input });
    } else {
      await createMutation.mutateAsync(input);
    }
    setEditingReminder(null);
    setIsFormOpen(false);
  };

  const confirmDelete = async () => {
    if (!deletingReminder) return;
    await deleteMutation.mutateAsync(deletingReminder._id);
    setDeletingReminder(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingReminder(null);
  };

  const clearFilters = () => {
    setStatusFilter('all');
    setSearchInput('');
    setSearch('');
    setCategory('');
    setPriority('');
    setPage(1);
  };

  const isLoading = remindersQuery.isPending || userQuery.isPending;
  const hasError = remindersQuery.isError || userQuery.isError;
  const queryError = remindersQuery.error ?? userQuery.error;
  const data = remindersQuery.data;
  const visibleStart = data?.pagination.total ? (page - 1) * PAGE_SIZE + 1 : 0;
  const visibleEnd = Math.min(page * PAGE_SIZE, data?.pagination.total ?? 0);
  const completingId = completionMutation.isPending ? completionMutation.variables.id : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-remindly-text-accent-secondary">
            Your workspace
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-remindly-charcoal-brown sm:text-4xl">
            Reminders
          </h1>
          <p className="mt-2 text-sm text-remindly-muted">
            Keep the important things in view.
          </p>
        </div>
        <button
          className={primaryButtonClass}
          onClick={() => setIsFormOpen(true)}
          type="button"
        >
          <Plus aria-hidden="true" size={18} />
          New reminder
        </button>
      </header>

      <section aria-label="Reminder filters" className="mb-5 rounded-2xl border border-remindly-border bg-remindly-surface p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(14rem,2fr)_repeat(2,minmax(9rem,1fr))_minmax(10rem,1fr)]">
          <label className="block">
            <span className="sr-only">Search reminders</span>
            <span className="relative block">
              <span className="absolute inset-y-0 left-3 flex items-center text-remindly-muted">
                <Search aria-hidden="true" size={17} />
              </span>
              <input
                className="block min-h-11 w-full rounded-xl border border-remindly-border bg-remindly-surface pl-10 pr-3 text-sm text-remindly-text placeholder:text-remindly-placeholder focus:border-remindly-wine-rose focus:outline-none focus:ring-2 focus:ring-remindly-focus/40"
                onChange={(event) => {
                  setSearchInput(event.target.value);
                  setPage(1);
                }}
                maxLength={100}
                placeholder="Search reminders"
                type="search"
                value={searchInput}
              />
            </span>
            <span className="mt-1 block text-xs font-normal text-remindly-muted">
              Up to 100 characters.
            </span>
          </label>
          <label className={filterLabelClass}>
            <span>Category</span>
            <select
              className={filterSelectClass}
              onChange={(event) => {
                setCategory(
                  REMINDER_CATEGORIES.find((value) => value === event.target.value) ?? ''
                );
                setPage(1);
              }}
              value={category}
            >
              <option value="">All categories</option>
              {REMINDER_CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {value[0].toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className={filterLabelClass}>
            <span>Priority</span>
            <select
              className={filterSelectClass}
              onChange={(event) => {
                setPriority(
                  REMINDER_PRIORITIES.find((value) => value === event.target.value) ?? ''
                );
                setPage(1);
              }}
              value={priority}
            >
              <option value="">All priorities</option>
              {REMINDER_PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {value[0].toUpperCase() + value.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className={filterLabelClass}>
            <span>Sort this page</span>
            <select
              className={filterSelectClass}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              value={sortOrder}
            >
            <option value="created-descending">Created: newest first</option>
              <option value="due-ascending">Due date: soonest</option>
              <option value="due-descending">Due date: latest</option>
              <option value="title">Title: A to Z</option>
              <option value="priority">Priority: highest first</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-remindly-border pt-4 md:flex-row md:items-center md:justify-between">
          <div aria-label="Filter by reminder status" className="flex flex-wrap gap-2" role="group">
            {statusFilters.map(({ id, label }) => (
              <button
                aria-pressed={statusFilter === id}
                className={`min-h-11 cursor-pointer rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus ${
                  statusFilter === id
                    ? 'bg-remindly-burgundy text-remindly-action-text'
                    : 'text-remindly-muted hover:bg-remindly-elevated-surface hover:text-remindly-text'
                }`}
                key={id}
                onClick={() => {
                  setStatusFilter(id);
                  setPage(1);
                }}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-remindly-muted">View</span>
            <button
              aria-label="Card view"
              aria-pressed={!isTable}
              className="grid size-11 cursor-pointer place-items-center rounded-xl border border-remindly-border text-remindly-text hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus aria-pressed:border-remindly-burgundy aria-pressed:text-remindly-text-accent"
              onClick={() => selectView('card')}
              type="button"
            >
              <LayoutGrid aria-hidden="true" size={18} />
            </button>
            <button
              aria-label="Table view"
              aria-pressed={isTable}
              className="grid size-11 cursor-pointer place-items-center rounded-xl border border-remindly-border text-remindly-text hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus aria-pressed:border-remindly-burgundy aria-pressed:text-remindly-text-accent"
              onClick={() => selectView('table')}
              type="button"
            >
              <List aria-hidden="true" size={18} />
            </button>
            {hasActiveFilters && (
              <button
                className="min-h-11 cursor-pointer rounded-xl px-3 text-sm font-semibold text-remindly-text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
                onClick={clearFilters}
                type="button"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-remindly-muted">
          Newest reminders appear first. Other sorting choices reorder only this page.
        </p>
      </section>

      {completionMutation.isError && (
        <p className="mb-4 rounded-xl bg-remindly-danger-soft p-3 text-sm text-remindly-danger" role="alert">
          {getApiErrorMessage(completionMutation.error)}
        </p>
      )}

      {isLoading ? (
        <div aria-busy="true" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="h-48 animate-pulse rounded-2xl border border-remindly-border bg-remindly-surface"
              key={index}
            />
          ))}
          <p className="sr-only" role="status">Loading reminders…</p>
        </div>
      ) : hasError ? (
        <section className="rounded-2xl border border-remindly-border bg-remindly-surface p-8 text-center">
          <AlertTriangle aria-hidden="true" className="mx-auto text-remindly-danger" size={28} />
          <h2 className="mt-4 text-lg font-semibold text-remindly-charcoal-brown">
            We couldn’t load your reminders
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-remindly-muted">
            {getApiErrorMessage(queryError)}
          </p>
          <button
            className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-remindly-border px-4 font-semibold text-remindly-text hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
            onClick={() => {
              void remindersQuery.refetch();
              void userQuery.refetch();
            }}
            type="button"
          >
            <RefreshCw aria-hidden="true" size={16} />
            Try again
          </button>
        </section>
      ) : reminders.length === 0 ? (
        <section className="rounded-2xl border border-remindly-border bg-remindly-surface px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-remindly-charcoal-brown">
            {hasActiveFilters ? 'No reminders match these filters' : 'No reminders yet'}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-remindly-muted">
            {hasActiveFilters
              ? 'Try changing your search or filters to find what you are looking for.'
              : 'Create your first reminder to start keeping important things in view.'}
          </p>
          {hasActiveFilters ? (
            <button
              className="mt-4 min-h-11 cursor-pointer rounded-xl px-4 font-semibold text-remindly-text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus"
              onClick={clearFilters}
              type="button"
            >
              Clear filters
            </button>
          ) : (
            <button
              className={`${primaryButtonClass} mt-5`}
              onClick={() => setIsFormOpen(true)}
              type="button"
            >
              <Plus aria-hidden="true" size={18} />
              Create a reminder
            </button>
          )}
        </section>
      ) : (
        <section
          aria-busy={remindersQuery.isFetching}
          id="reminder-results"
          aria-label="Filtered reminders"
        >
          <ReminderList
            completingId={completingId}
            isTable={isTable}
            onComplete={(reminder, completed) =>
              completionMutation.mutate({ id: reminder._id, completed })
            }
            onDelete={setDeletingReminder}
            onEdit={(reminder) => {
              setEditingReminder(reminder);
              setIsFormOpen(true);
            }}
            reminders={reminders}
            timeZone={timeZone}
          />
          <div className="mt-5 flex flex-col gap-3 text-sm text-remindly-muted sm:flex-row sm:items-center sm:justify-between">
            <p aria-live="polite">
              Showing {visibleStart}–{visibleEnd} of {data?.pagination.total ?? 0}
            </p>
            <div className="flex items-center gap-2">
              <button
                className={paginationButtonClass}
                disabled={page <= 1 || remindersQuery.isFetching}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                type="button"
              >
                Previous
              </button>
              <span className="min-w-20 text-center">
                Page {page} of {Math.max(pageCount, 1)}
              </span>
              <button
                className={paginationButtonClass}
                disabled={pageCount === 0 || page >= pageCount || remindersQuery.isFetching}
                onClick={() => setPage((current) => current + 1)}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      )}

      {isFormOpen && (
        <ReminderFormDialog
          key={editingReminder?._id ?? 'new-reminder'}
          onClose={closeForm}
          onSave={saveReminder}
          reminder={editingReminder}
          timeZone={timeZone}
        />
      )}
      {deletingReminder && (
        <DeleteReminderDialog
          onClose={() => setDeletingReminder(null)}
          onDelete={confirmDelete}
          reminder={deletingReminder}
        />
      )}
      {completingId && (
        <p className="sr-only" role="status">Updating reminder…</p>
      )}
    </div>
  );
}
