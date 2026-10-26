import apiClient from '../lib/axios';
import type { ApiResponse } from '../types/api';
import type {
  ReminderFilters,
  ReminderInput,
  ReminderListData,
  ReminderRecord,
} from '../types/reminder';

export const listReminders = async (filters: ReminderFilters) => {
  const response = await apiClient.get<ApiResponse<ReminderListData>>('/reminders', {
    params: filters,
  });
  return response.data.data;
};

export const createReminder = async (input: ReminderInput) => {
  const response = await apiClient.post<ApiResponse<{ reminder: ReminderRecord }>>(
    '/reminders',
    input
  );
  return response.data.data.reminder;
};

export const updateReminder = async (reminderId: string, input: ReminderInput) => {
  const response = await apiClient.put<ApiResponse<{ reminder: ReminderRecord }>>(
    `/reminders/${reminderId}`,
    input
  );
  return response.data.data.reminder;
};

export const deleteReminder = async (reminderId: string) => {
  await apiClient.delete<ApiResponse<null>>(`/reminders/${reminderId}`);
};

export const setReminderCompleted = async (reminderId: string, completed: boolean) => {
  const response = await apiClient.patch<ApiResponse<{ reminder: ReminderRecord }>>(
    `/reminders/${reminderId}/complete`,
    { completed }
  );
  return response.data.data.reminder;
};
