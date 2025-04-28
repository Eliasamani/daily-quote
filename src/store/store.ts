// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import quoteMetaReducer from "./slices/quoteMetaSlice";
import savedQuotesReducer from "./slices/savedQuotesSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quoteMeta: quoteMetaReducer,
    savedQuotes: savedQuotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
