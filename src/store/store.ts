// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import quoteMetaReducer from "./slices/quoteMetaSlice";
import savedQuotesReducer from "./slices/savedQuotesSlice";
import createdQuotesReducer from "./slices/createdQuotesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quoteMeta: quoteMetaReducer,
    savedQuotes: savedQuotesReducer,
    createdQuotes: createdQuotesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;