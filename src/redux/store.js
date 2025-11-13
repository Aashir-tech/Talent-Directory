import { configureStore } from '@reduxjs/toolkit';
import talentsReducer from './slices/talentsSlice';

export const store = configureStore({
  reducer: {
    talents: talentsReducer,
  },
});

export default store;