import apiClient from '../lib/axios';
import type { ApiResponse } from '../types/api';
import type { DashboardUser } from '../types/dashboard';



export const revokeOtherSessions = async () => {
  const response = await apiClient.delete<ApiResponse<{ revokedCount: number }>>(
    '/auth/sessions'
  );
  return response.data.data.revokedCount;
};

export type UpdateUserSettingsInput = {
  name?: string;
  timezone?: string;
  defaultAdvanceNotice?: number;
  emailAlertsEnabled?: boolean;
};

export const updateUserSettings = async (
  input: UpdateUserSettingsInput
): Promise<DashboardUser> => {
  const response = await apiClient.patch<
    ApiResponse<{ user: DashboardUser }>
  >('/auth/me', input);

  return response.data.data.user;
}