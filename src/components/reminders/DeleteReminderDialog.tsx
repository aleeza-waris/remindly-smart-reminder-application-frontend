'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReminderRecord } from '../../types/reminder';
import { getApiErrorMessage } from '../../utils/getApiErrorMessage';

export default function DeleteReminderDialog({
  onClose,
  onDelete,
  reminder,
}: {
  onClose: () => void;
  onDelete: () => Promise<void>;
  reminder: ReminderRecord;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    dialogRef.current?.showModal();
    return () => {
      if (dialogRef.current?.open) dialogRef.current.close();
    };
  }, []);

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      await onDelete();
    } catch (error) {
      setDeleteError(getApiErrorMessage(error));
      setIsDeleting(false);
    }
  };

  return (
    <dialog
      aria-describedby="delete-reminder-description"
      aria-labelledby="delete-reminder-title"
      className="fixed inset-0 z-50 m-0 grid h-dvh max-h-none w-full max-w-none place-items-end overflow-hidden border-0 bg-transparent p-0 backdrop:bg-slate-950/50 sm:place-items-center sm:p-6"
      onCancel={(event) => {
        event.preventDefault();
        if (!isDeleting) onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isDeleting) onClose();
      }}
      ref={dialogRef}
      role="alertdialog"
    >
      <section
        className="w-full rounded-t-3xl border border-remindly-border bg-remindly-surface p-6 shadow-xl sm:max-w-md sm:rounded-3xl"
      >
        <h2 className="text-lg font-semibold text-remindly-charcoal-brown" id="delete-reminder-title">
          Delete this reminder?
        </h2>
        <p className="mt-2 break-words text-sm leading-relaxed text-remindly-muted" id="delete-reminder-description">
          “{reminder.title}” will be permanently removed.
        </p>
        {deleteError && (
          <p className="mt-4 rounded-xl bg-remindly-danger-soft p-3 text-sm text-remindly-danger" role="alert">
            {deleteError}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            className="min-h-11 cursor-pointer rounded-xl border border-remindly-border px-4 font-semibold text-remindly-text hover:bg-remindly-elevated-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus disabled:cursor-not-allowed"
            disabled={isDeleting}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="min-h-11 cursor-pointer rounded-xl bg-remindly-danger px-4 font-semibold text-remindly-page hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-remindly-focus disabled:cursor-wait disabled:opacity-60"
            disabled={isDeleting}
            onClick={() => void confirmDelete()}
            type="button"
          >
            {isDeleting ? 'Deleting…' : 'Delete reminder'}
          </button>
        </div>
      </section>
    </dialog>
  );
}