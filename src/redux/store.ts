import { configureStore } from '@reduxjs/toolkit';
import storyReducer from '../slices/storySlice';
import authReducer from '../slices/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    story: storyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;