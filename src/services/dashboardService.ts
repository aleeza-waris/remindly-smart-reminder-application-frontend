import apiClient from '../lib/axios';
import type { ApiResponse } from '../types/api';
import type {
  DashboardReminder,
  DashboardUser,
  ReminderListData,
  ReminderStats,
} from '../types/dashboard';

export const getDashboardUser = async () => {
  const response = await apiClient.get<ApiResponse<{ user: DashboardUser }>>('/auth/me');
  return response.data.data.user;
};

export const getDashboardStats = async () => {
  const response = await apiClient.get<ApiResponse<ReminderStats>>('/reminders/stats');
  return response.data.data;
};

export const getDueSoonReminders = async (from: Date, to: Date) => {
  const response = await apiClient.get<ApiResponse<ReminderListData>>('/reminders', {
    params: {
      status: 'pending',
      dueFrom: from.toISOString(),
      dueTo: to.toISOString(),
      page: 1,
      limit: 100,
    },
  });
  return response.data.data.reminders;
};

export const completeDashboardReminder = async (reminderId: string) => {
  const response = await apiClient.patch<ApiResponse<{ reminder: DashboardReminder }>>(
    `/reminders/${reminderId}/complete`,
    { completed: true }
  );
  return response.data.data.reminder;
};
