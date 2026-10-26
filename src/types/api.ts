export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};

export type AuthenticationData = {
  user: {
    name: string;
    email: string;
    avatar?: string | null;
  };
  token: string;
};
