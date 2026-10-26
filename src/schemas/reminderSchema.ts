import { z } from 'zod';
import { ADVANCE_NOTICE_OPTIONS, REMINDER_CATEGORIES, REMINDER_PRIORITIES } from '../types/reminder';

export const reminderSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Enter a reminder title.')
    .max(120, 'Reminder titles must be 120 characters or fewer.'),
  description: z.string().trim().max(2000, 'Descriptions must be 2,000 characters or fewer.'),
  category: z.enum(REMINDER_CATEGORIES),
  priority: z.enum(REMINDER_PRIORITIES),
  dueDate: z
    .string()
    .min(1, 'Choose a due date and time.')
    .refine((value) => !Number.isNaN(Date.parse(value)), 'Enter a valid due date and time.'),
  advanceNoticeMinutes: z.coerce
    .number()
    .int()
    .refine(
      (value) => ADVANCE_NOTICE_OPTIONS.includes(value as (typeof ADVANCE_NOTICE_OPTIONS)[number]),
      'Choose a supported advance notice.'
    ),
});

export type ReminderFormValues = z.infer<typeof reminderSchema>;
export type ReminderFormInput = z.input<typeof reminderSchema>;
