import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import quoteMetaReducer from "./slices/quoteMetaSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quoteMeta: quoteMetaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
