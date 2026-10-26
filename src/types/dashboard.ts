import type { ReminderRecord } from './reminder';

export type ReminderStats = {
  total: number;
  upcoming: number;
  completed: number;
  overdue: number;
  completionRate: number;
  byCategory: Record<string, number>;
};

export type DashboardReminder = {
  _id: string;
  title: string;
  category: string;
  priority: string;
  dueDate: string;
  status: 'pending' | 'completed';
};

export type DashboardUser = {
  name: string;
  email: string;
  timezone: string;
  defaultAdvanceNotice?: number;
  emailAlertsEnabled?: boolean;
  soundAlertsEnabled?: boolean;
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
