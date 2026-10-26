'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeDashboardReminder,
  getDashboardStats,
  getDashboardUser,
  getDueSoonReminders,
} from '../services/dashboardService';

const DUE_SOON_WINDOW_DAYS = 7;

export const useDashboard = () => {
  const queryClient = useQueryClient();
  const userQuery = useQuery({
    queryKey: ['dashboard', 'user'],
    queryFn: getDashboardUser,
  });
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });
  const remindersQuery = useQuery({
    queryKey: ['dashboard', 'due-soon'],
    queryFn: () => {
      const now = new Date();
      const dueWindowEnd = new Date(now);
      dueWindowEnd.setDate(dueWindowEnd.getDate() + DUE_SOON_WINDOW_DAYS);
      return getDueSoonReminders(now, dueWindowEnd);
    },
  });
  const completionMutation = useMutation({
    mutationFn: completeDashboardReminder,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard', 'due-soon'] }),
      ]);
    },
  });

  return { userQuery, statsQuery, remindersQuery, completionMutation };
};
