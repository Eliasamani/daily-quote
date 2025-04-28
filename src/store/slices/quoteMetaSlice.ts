// src/store/slices/quoteMetaSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

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

export const fetchQuoteMeta = createAsyncThunk<QuoteMeta, string>(
  "quoteMeta/fetch",
  async (quoteId) => {
    const doc = await firestore().collection("quoteMeta").doc(quoteId).get();
    if (!doc.exists) {
      return {
        id: quoteId,
        likeCount: 0,
        likedBy: [],
        commentCount: 0,
        savedBy: [],
      };
    }
    return doc.data() as QuoteMeta;
  }
);

export const toggleLike = createAsyncThunk<void, string>(
  "quoteMeta/toggleLike",
  async (quoteId) => {
    const uid = auth().currentUser!.uid;
    const ref = firestore().collection("quoteMeta").doc(quoteId);

    await firestore().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const meta: QuoteMeta = snap.exists
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

export const addComment = createAsyncThunk<
  void,
  { quoteId: string; text: string }
>("quoteMeta/addComment", async ({ quoteId, text }) => {
  const uid = auth().currentUser!.uid;
  const commentsRef = firestore()
    .collection("quoteMeta")
    .doc(quoteId)
    .collection("comments");
  await commentsRef.add({
    userId: uid,
    text,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
  // increment parent commentCount
  await firestore()
    .collection("quoteMeta")
    .doc(quoteId)
    .set({ commentCount: firestore.FieldValue.increment(1) }, { merge: true });
});

export const toggleSave = createAsyncThunk<void, string>(
  "quoteMeta/toggleSave",
  async (quoteId) => {
    const uid = auth().currentUser!.uid;
    const ref = firestore().collection("quoteMeta").doc(quoteId);

    await firestore().runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const meta: QuoteMeta = snap.exists
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

      tx.set(
        ref,
        {
          ...meta,
          savedBy: newSavedBy,
        },
        { merge: true }
      );
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
        const uid = auth().currentUser!.uid;
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
        const uid = auth().currentUser!.uid;
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
