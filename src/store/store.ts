// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";

import authReducer from "./slices/authSlice";
import quoteMetaReducer from "./slices/quoteMetaSlice";
import savedQuotesReducer from "./slices/savedQuotesSlice";
import createdQuotesReducer from "./slices/createdQuotesSlice";
import persistenceListener from "./persistenceMiddleware";
import exploreQuotesSlice from './slices/exploreQuotesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quoteMeta: quoteMetaReducer,
    savedQuotes: savedQuotesReducer,
    createdQuotes: createdQuotesReducer,
    exploreQuotes: exploreQuotesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).prepend(
      persistenceListener.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
