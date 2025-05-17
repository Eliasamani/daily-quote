import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../config/firebase";

interface AuthState {
  user: { uid: string; email: string | null } | null;
  guest: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  guest: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  { uid: string; email: string | null },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { uid: cred.user.uid, email: cred.user.email };
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

export const registerUser = createAsyncThunk<
  { uid: string; email: string | null },
  { email: string; password: string },
  { rejectValue: string }
>("auth/registerUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return { uid: cred.user.uid, email: cred.user.email };
  } catch (e: any) {
    return rejectWithValue(e.message);
  }
});

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
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.guest = false;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Unknown error";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload;
        state.guest = false;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload ?? "Unknown error";
      });
  },
});

export const { setUser, setGuest, logoutUser } = authSlice.actions;
export default authSlice.reducer;
