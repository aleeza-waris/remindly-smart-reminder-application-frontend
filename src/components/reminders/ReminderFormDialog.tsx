'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  reminderSchema,
  type ReminderFormInput,
  type ReminderFormValues,
} from '../../schemas/reminderSchema';
import {
  ADVANCE_NOTICE_OPTIONS,
  REMINDER_CATEGORIES,
  REMINDER_PRIORITIES,
  type ReminderInput,
  type ReminderRecord,
} from '../../types/reminder';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';
import {
  timeZoneDateTimeInputToISOString,
  toTimeZoneDateTimeInput,
} from '../../lib/timeZone';

const fieldClass =
  'min-h-11 w-full rounded-xl border border-remindly-border bg-remindly-surface px-3 text-remindly-text placeholder:text-remindly-placeholder focus:border-remindly-wine-rose focus:outline-none focus:ring-2 focus:ring-remindly-focus/40';
const labelClass = 'grid gap-2 text-sm font-medium text-remindly-charcoal-brown';

export default function ReminderFormDialog({
  onClose,
  onSave,
  reminder,
  timeZone,
}: {
  onClose: () => void;
  onSave: (input: ReminderInput) => Promise<void>;
  reminder: ReminderRecord | null;
  timeZone: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [saveError, setSaveError] = useState('');
  const {
    formState: { errors, isSubmitting },
    clearErrors,
    handleSubmit,
    register,
    setError,
    watch,
  } = useForm<ReminderFormInput, undefined, ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: reminder?.title ?? '',
      description: reminder?.description ?? '',
      category: reminder?.category ?? 'personal',
      priority: reminder?.priority ?? 'medium',
      dueDate: toTimeZoneDateTimeInput(reminder?.dueDate, timeZone),
      advanceNoticeMinutes: reminder?.advanceNoticeMinutes ?? 0,
    },
  });
  const titleValue = watch('title') ?? '';
  const descriptionValue = watch('description') ?? '';
  const dueDateField = register('dueDate');
  const minimumDueDate = toTimeZoneDateTimeInput(
    new Date(Math.ceil(Date.now() / 60_000) * 60_000).toISOString(),
    timeZone
  );

  useEffect(() => {
    dialogRef.current?.showModal();
    return () => {
      if (dialogRef.current?.open) dialogRef.current.close();
    };
  }, []);

  const submit = handleSubmit(async (values) => {
    setSaveError('');
    try {
      const dueDateWasUnchanged =
        reminder !== null &&
        values.dueDate === toTimeZoneDateTimeInput(reminder.dueDate, timeZone);
      const dueDate = dueDateWasUnchanged
        ? reminder.dueDate
        : timeZoneDateTimeInputToISOString(values.dueDate, timeZone);
      if (!dueDateWasUnchanged && Date.parse(dueDate) <= Date.now()) {
        setError('dueDate', {
          type: 'validate',
          message: 'Due date and time must be in the future.',
        });
        return;
      }
      clearErrors('dueDate');
      await onSave({
        ...values,
        dueDate,
      });
    } catch (error) {
      setSaveError(
        error instanceof RangeError ? error.message : getApiErrorMessage(error)
      );
    }
  });

  return (
    <dialog
      aria-labelledby="reminder-dialog-title"
      className="fixed inset-0 z-50 m-0 grid h-dvh max-h-none w-full max-w-none place-items-end overflow-hidden border-0 bg-transparent p-0 backdrop:bg-slate-950/50 sm:place-items-center sm:p-6"
      onCancel={(event) => {
        event.preventDefault();
        if (!isSubmitting) onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
      ref={dialogRef}
    >
      <section
        className="max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl border border-remindly-border bg-remindly-surface p-5 shadow-xl sm:rounded-3xl sm:p-7"
      >
        <header className="mb-6">
          <h2 className="text-xl font-semibold text-remindly-charcoal-brown" id="reminder-dialog-title">
            {reminder ? 'Edit reminder' : 'Create reminder'}
          </h2>
          <p className="mt-1 text-sm text-remindly-muted">
            Choose what to remember and when it is due.
          </p>
        </header>

        <form className="grid gap-4" noValidate onSubmit={submit}>
          <label className={labelClass}>
            Title
            <input
              aria-describedby={errors.title ? 'reminder-title-error reminder-title-count' : 'reminder-title-count'}
              aria-invalid={Boolean(errors.title)}
              autoFocus
              className={fieldClass}
              maxLength={120}
              {...register('title')}
            />
            {errors.title && (
              <span className="text-sm text-remindly-danger" id="reminder-title-error">
                {errors.title.message}
              </span>
            )}
            <span className="text-xs font-normal text-remindly-muted" id="reminder-title-count">
              {titleValue.length}/120 characters
            </span>
          </label>

          <label className={labelClass}>
            Description <span className="font-normal text-remindly-muted">(optional)</span>
            <textarea
              aria-describedby={errors.description ? 'reminder-description-error reminder-description-count' : 'reminder-description-count'}
              aria-invalid={Boolean(errors.description)}
              className={`${fieldClass} min-h-24 resize-y py-2`}
              maxLength={2000}
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <span className="text-sm text-remindly-danger" id="reminder-description-error">
                {errors.description.message}
              </span>
            )}
            <span className="text-xs font-normal text-remindly-muted" id="reminder-description-count">
              {descriptionValue.length}/2,000 characters
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>
              Category
              <select className={`${fieldClass} cursor-pointer`} {...register('category')}>
                {REMINDER_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category[0].toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Priority
              <select className={`${fieldClass} cursor-pointer`} {...register('priority')}>
                {REMINDER_PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority[0].toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={labelClass}>
            Due date and time
            <input
              aria-describedby={errors.dueDate ? 'reminder-due-error' : 'reminder-due-help'}
              aria-invalid={Boolean(errors.dueDate)}
              className={fieldClass}
              min={minimumDueDate}
              type="datetime-local"
              {...dueDateField}
              onChange={(event) => {
                clearErrors('dueDate');
                void dueDateField.onChange(event);
              }}
            />
            <span className="text-xs font-normal text-remindly-muted" id="reminder-due-help">
              Times use your saved timezone ({timeZone}).
            </span>
            {errors.dueDate && (
              <span className="text-sm text-remindly-danger" id="reminder-due-error">
                {errors.dueDate.message}
              </span>
            )}
          </label>

          <label className={labelClass}>
            Email alert
            <select
              className={`${fieldClass} cursor-pointer`}
              {...register('advanceNoticeMinutes', { valueAsNumber: true })}
            >
              {ADVANCE_NOTICE_OPTIONS.map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes === 0
                    ? 'At due time'
                    : minutes === 1440
                      ? '1 day before'
                      : `${minutes} minutes before`}
                </option>
              ))}
            </select>
          </label>

          {saveError && (
            <p className="rounded-xl bg-remindly-danger-soft p-3 text-sm text-remindly-danger" role="alert">
              {saveError}
            </p>
          )}
          <div className="mt-2 flex flex-col-reverse gap-3 border-t border-remindly-border pt-4 sm:flex-row sm:justify-end">
            <button
              className="min-h-11 cursor-pointer rounded-xl border border-remindly-border px-4 font-semibold text-remindly-text hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus disabled:cursor-not-allowed"
              disabled={isSubmitting}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="min-h-11 cursor-pointer rounded-xl bg-remindly-burgundy px-5 font-semibold text-remindly-action-text hover:bg-remindly-wine-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus disabled:cursor-wait disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Saving…' : reminder ? 'Save changes' : 'Create reminder'}
            </button>
          </div>
        </form>
      </section>
    </dialog>
  );
}
