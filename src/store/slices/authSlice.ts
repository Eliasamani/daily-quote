// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: { uid: string; email: string | null } | null;
  guest: boolean;
}

const initialState: AuthState = {
  user: null,
  guest: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{ uid: string; email: string | null } | null>
    ) => {
      if (action.payload) {
        state.user = action.payload;
        state.guest = false;
      } else {
        state.user = null;
        state.guest = true;
      }
    },

    setGuest: (state, action: PayloadAction<boolean>) => {
      state.guest = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.guest = false;
    },
  },
});

export const { setUser, setGuest, logoutUser } = authSlice.actions;
export default authSlice.reducer;
