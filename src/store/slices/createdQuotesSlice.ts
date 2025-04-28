// src/store/slices/createdQuotesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../../config/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import type { Quote } from "../../models/ExploreQuotesModel";

/**
 * Create a new quote:
 * - writes to top-level /quotes
 * - also snapshots it under users/{uid}/createdQuotes/{id}
 */
export const createQuote = createAsyncThunk<
  void,
  { content: string; author: string }
>("createdQuotes/createQuote", async ({ content, author }) => {
  const uid = auth.currentUser!.uid;

  // 1) write to /quotes with auto-id
  const quotesRef = collection(db, "quotes");
  const newRef = doc(quotesRef);
  await setDoc(newRef, {
    content,
    author,
    createdBy: uid,
    createdAt: serverTimestamp(),
  });

  // 2) snapshot under users/{uid}/createdQuotes/{newRef.id}
  const userRef = doc(db, "users", uid, "createdQuotes", newRef.id);
  await setDoc(userRef, {
    id: newRef.id,
    content,
    author,
    createdAt: serverTimestamp(),
  });
});

const createdQuotesSlice = createSlice({
  name: "createdQuotes",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createQuote.fulfilled, () => {
      // we rely on the real-time listener in the presenter
    });
  },
});

export default createdQuotesSlice.reducer;
