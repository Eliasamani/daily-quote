// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import authReducer from "./slices/authSlice";
import quoteMetaReducer from "./slices/quoteMetaSlice";
import savedQuotesReducer from "./slices/savedQuotesSlice";
import createdQuotesReducer from "./slices/createdQuotesSlice";
import { firebaseMiddleware } from "./middleware/firebaseMiddleware";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quoteMeta: quoteMetaReducer,
    savedQuotes: savedQuotesReducer,
    createdQuotes: createdQuotesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      firebaseMiddleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
