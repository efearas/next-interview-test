import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import searchResultsReducer from '../features/searchResults/searchResultsSlice';


export const store = configureStore({
  reducer: {    
    searchResults: searchResultsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
