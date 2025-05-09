// src/store/slices/quoteMetaSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth, db } from "../../config/firebase";
import { setDoc } from "firebase/firestore";
import {
  doc,
  getDoc,
  runTransaction,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";

export interface QuoteMeta {
  id: string;
  likeCount: number;
  likedBy: string[];
  commentCount: number;
  savedBy: string[];
}

interface QuoteMetaState {
  entities: Record<string, QuoteMeta>;
  loadingIds: string[];
  error?: string;
}

const initialState: QuoteMetaState = {
  entities: {},
  loadingIds: [],
};

// Fetch metadata for a given quote
export const fetchQuoteMeta = createAsyncThunk<QuoteMeta, string>(
  "quoteMeta/fetch",
  async (quoteId) => {
    const ref = doc(db, "quoteMeta", quoteId);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return {
        id: quoteId,
        likeCount: 0,
        likedBy: [],
        commentCount: 0,
        savedBy: [],
      };
    }
    return snap.data() as QuoteMeta;
  }
);

// Toggle a like on/off
export const toggleLike = createAsyncThunk<void, string>(
  "quoteMeta/toggleLike",
  async (quoteId) => {
    const uid = auth.currentUser!.uid;
    const ref = doc(db, "quoteMeta", quoteId);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const meta: QuoteMeta = snap.exists()
        ? (snap.data() as QuoteMeta)
        : {
            id: quoteId,
            likeCount: 0,
            likedBy: [],
            commentCount: 0,
            savedBy: [],
          };

      const already = meta.likedBy.includes(uid);
      const newLikedBy = already
        ? meta.likedBy.filter((u) => u !== uid)
        : [uid, ...meta.likedBy];

      tx.set(ref, {
        ...meta,
        likedBy: newLikedBy,
        likeCount: newLikedBy.length,
      });
    });
  }
);

export const addComment = createAsyncThunk(
  "quoteMeta/addComment",
  async ({ quoteId, text }: { quoteId: string; text: string }, thunkAPI) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Not authenticated");

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      const userData = userDoc.data();
      const username = userDoc.exists() ? userData?.username : "Unknown";

      if (!text || typeof username !== "string") {
        throw new Error("Missing required comment fields");
      }

      const commentRef = doc(collection(db, "quoteMeta", quoteId, "comments"));
      await setDoc(commentRef, {
        userId: user.uid,
        username,
        text,
        createdAt: serverTimestamp(),
      });

      // ✅ Restore the commentCount increment
      const parentRef = doc(db, "quoteMeta", quoteId);
      await updateDoc(parentRef, { commentCount: increment(1) });

    } catch (err: any) {
      console.error("Failed to save comment:", err.message);
    }
  }
);

// Toggle saving a quote on/off
export const toggleSave = createAsyncThunk<void, string>(
  "quoteMeta/toggleSave",
  async (quoteId) => {
    const uid = auth.currentUser!.uid;
    const ref = doc(db, "quoteMeta", quoteId);

    await runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const meta: QuoteMeta = snap.exists()
        ? (snap.data() as QuoteMeta)
        : {
            id: quoteId,
            likeCount: 0,
            likedBy: [],
            commentCount: 0,
            savedBy: [],
          };

      const already = meta.savedBy.includes(uid);
      const newSavedBy = already
        ? meta.savedBy.filter((u) => u !== uid)
        : [uid, ...meta.savedBy];

      tx.set(ref, { ...meta, savedBy: newSavedBy });
    });
  }
);

const slice = createSlice({
  name: "quoteMeta",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuoteMeta.fulfilled, (state, { payload }) => {
        state.entities[payload.id] = payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const id = action.meta.arg;
        const uid = auth.currentUser!.uid;
        const m = state.entities[id];
        if (m) {
          if (m.likedBy.includes(uid)) {
            m.likedBy = m.likedBy.filter((u) => u !== uid);
          } else {
            m.likedBy.unshift(uid);
          }
          m.likeCount = m.likedBy.length;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const quoteId = (action.meta.arg as any).quoteId;
        const m = state.entities[quoteId];
        if (m) m.commentCount++;
      })
      .addCase(toggleSave.fulfilled, (state, action) => {
        const id = action.meta.arg;
        const uid = auth.currentUser!.uid;
        const m = state.entities[id];
        if (m) {
          if (m.savedBy.includes(uid)) {
            m.savedBy = m.savedBy.filter((u) => u !== uid);
          } else {
            m.savedBy.unshift(uid);
          }
        }
      });
  },
});

export default slice.reducer;