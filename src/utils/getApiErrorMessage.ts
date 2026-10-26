import axios from 'axios';

type ApiErrorResponse = {
  message?: unknown;
};

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string') {
      return message;
    }
  }

  return 'Unable to connect to Remindly. Check your connection and try again.';
};
