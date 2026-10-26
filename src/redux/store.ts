import { configureStore } from '@reduxjs/toolkit';

const emptyReducer = (state: Record<string, never> = {}) => state;

export const store = configureStore({
  reducer: emptyReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
