import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AuthUser from '../../models/AuthUser';

interface AuthState {
  user: AuthUser | null;
  showRegister: boolean;
}

const initialState: AuthState = {
  user: null,
  showRegister: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    toggleRegister(state, action: PayloadAction<boolean>) {
      state.showRegister = action.payload;
    },
  },
});

export const { setUser, toggleRegister } = authSlice.actions;
export default authSlice.reducer;
