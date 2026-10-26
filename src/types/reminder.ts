export const REMINDER_CATEGORIES = [
  'work',
  'personal',
  'health',
  'study',
  'finance',
  'urgent',
  'other',
] as const;

export const REMINDER_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const;
export const ADVANCE_NOTICE_OPTIONS = [0, 5, 10, 15, 30, 60, 1440] as const;

export type ReminderCategory = (typeof REMINDER_CATEGORIES)[number];
export type ReminderPriority = (typeof REMINDER_PRIORITIES)[number];
export type ReminderStatus = 'pending' | 'completed';

export type ReminderRecord = {
  _id: string;
  title: string;
  description: string;
  category: ReminderCategory;
  priority: ReminderPriority;
  dueDate: string;
  advanceNoticeMinutes: number;
  status: ReminderStatus;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ReminderFilters = {
  status?: ReminderStatus;
  category?: ReminderCategory;
  priority?: ReminderPriority;
  search?: string;
  dueFrom?: string;
  dueTo?: string;
  page: number;
  limit: number;
};

export type ReminderInput = {
  title: string;
  description?: string;
  category: ReminderCategory;
  priority: ReminderPriority;
  dueDate: string;
  advanceNoticeMinutes: number;
};

export type ReminderListData = {
  reminders: ReminderRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
