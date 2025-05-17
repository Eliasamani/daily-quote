import { createListenerMiddleware } from "@reduxjs/toolkit";
import {
  fetchSavedQuotes,
  setSavedQuotes,
  saveQuote,
  unsaveQuote,
} from "./slices/savedQuotesSlice";
import {
  fetchCreatedQuotes,
  setCreatedQuotes,
  addQuote,
} from "./slices/createdQuotesSlice";
import {
  fetchQuoteMeta,
  setMeta,
  toggleLike,
  toggleSave,
  addComment,
} from "./slices/quoteMetaSlice";

import {
  persistNewQuote,
  saveQuoteToFirestore,
  deleteSavedQuoteFromFirestore,
  toggleLikeInFirestore,
  toggleSaveInFirestore,
  addCommentInFirestore,
} from "../../firebaseModel";

import { db } from "../config/firebase";
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";

const listener = createListenerMiddleware();

listener.startListening({
  actionCreator: fetchSavedQuotes,
  effect: async (action, { dispatch, cancelActiveListeners }) => {
    const uid = action.payload as string;
    const q = query(collection(db, "users", uid, "savedQuotes"));
    const unsub = onSnapshot(q, (snap) => {
      const quotes = snap.docs.map((d) => d.data());
      dispatch(setSavedQuotes(quotes));
    });
    cancelActiveListeners();
    return unsub;
  },
});

listener.startListening({
  actionCreator: fetchCreatedQuotes,
  effect: async (action, { dispatch, cancelActiveListeners }) => {
    const uid = action.payload as string;
    const q = query(collection(db, "users", uid, "createdQuotes"));
    const unsub = onSnapshot(q, (snap) => {
      const quotes = snap.docs.map((d) => d.data());
      dispatch(setCreatedQuotes(quotes));
    });
    cancelActiveListeners();
    return unsub;
  },
});

listener.startListening({
  actionCreator: addQuote,
  effect: async (action) => {
    await persistNewQuote(action.payload);
  },
});

listener.startListening({
  actionCreator: saveQuote,
  effect: async (action, { getState }) => {
    const uid = getState().auth.user?.uid;
    if (uid) await saveQuoteToFirestore(uid, action.payload);
  },
});
listener.startListening({
  actionCreator: unsaveQuote,
  effect: async (action, { getState }) => {
    const uid = getState().auth.user?.uid;
    if (uid) {
      await deleteSavedQuoteFromFirestore(uid, action.payload as string);
    }
  },
});

listener.startListening({
  actionCreator: toggleLike,
  effect: async (action) => {
    const { id, userId } = action.payload;
    await toggleLikeInFirestore(id, userId);
  },
});

listener.startListening({
  actionCreator: toggleSave,
  effect: async (action) => {
    const { id, userId } = action.payload;
    await toggleSaveInFirestore(id, userId);
  },
});

listener.startListening({
  actionCreator: addComment,
  effect: async (action) => {
    const { quoteId, text, userId } = action.payload;
    await addCommentInFirestore(quoteId, text, userId);
  },
});

listener.startListening({
  actionCreator: fetchQuoteMeta,
  effect: async (action, { dispatch, cancelActiveListeners }) => {
    const quoteId = action.payload as string;
    const ref = doc(db, "quoteMeta", quoteId);

    const snap = await getDoc(ref);
    const raw = snap.exists() ? (snap.data() as any) : {};
    dispatch(
      setMeta({
        id: quoteId,
        likeCount: raw.likeCount ?? 0,
        likedBy: raw.likedBy ?? [],
        commentCount: raw.commentCount ?? 0,
        savedBy: raw.savedBy ?? [],
      })
    );

    const unsub = onSnapshot(ref, (s) => {
      const r2 = s.exists() ? (s.data() as any) : {};
      dispatch(
        setMeta({
          id: quoteId,
          likeCount: r2.likeCount ?? 0,
          likedBy: r2.likedBy ?? [],
          commentCount: r2.commentCount ?? 0,
          savedBy: r2.savedBy ?? [],
        })
      );
    });

    cancelActiveListeners();
    return unsub;
  },
});

export default listener;
