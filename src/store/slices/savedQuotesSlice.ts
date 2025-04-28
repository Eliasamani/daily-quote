// src/store/slices/savedQuotesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../../config/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import type { Quote } from "../../models/ExploreQuotesModel";

// Thunk to save full quote data under users/{uid}/savedQuotes/{quote.id}
export const saveQuoteWithData = createAsyncThunk<void, Quote>(
  "savedQuotes/saveQuoteWithData",
  async (quote) => {
    const uid = auth.currentUser!.uid;
    const ref = doc(db, "users", uid, "savedQuotes", quote.id);
    await setDoc(ref, quote);
  }
);

// Thunk to remove it
export const unsaveQuoteWithData = createAsyncThunk<void, string>(
  "savedQuotes/unsaveQuoteWithData",
  async (quoteId) => {
    const uid = auth.currentUser!.uid;
    const ref = doc(db, "users", uid, "savedQuotes", quoteId);
    await deleteDoc(ref);
  }
);

const slice = createSlice({
  name: "savedQuotes",
  initialState: {},
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(saveQuoteWithData.fulfilled, () => {
        // no local state—we read in real time from Firestore
      })
      .addCase(unsaveQuoteWithData.fulfilled, () => {
        // nothing here either
      }),
});

export default slice.reducer;
