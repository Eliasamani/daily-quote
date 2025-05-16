// src/store/middleware/firebaseMiddleware.ts
import { Middleware } from "redux";
import { auth, db } from "../../config/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  runTransaction,
  serverTimestamp,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { registerUser, loginUser } from "../slices/authSlice";
import { addQuote } from "../slices/createdQuotesSlice";
import {
  fetchQuoteMeta,
  setMeta,
  toggleLike,
  addComment,
  toggleSave,
} from "../slices/quoteMetaSlice";
import { saveQuote, unsaveQuote } from "../slices/savedQuotesSlice";

export const firebaseMiddleware: Middleware =
  (storeAPI) => (next) => async (action) => {
    const result = next(action);
    const state = storeAPI.getState();

    switch (action.type) {
      case registerUser.fulfilled.type: {
        const { uid, email, username } = action.payload as any;
        await setDoc(doc(db, "users", uid), {
          email,
          username,
          createdAt: serverTimestamp(),
        });
        break;
      }
      case addQuote.type: {
        const quote = action.payload;
        const uid = state.auth.user?.uid;
        if (!uid) break;
        await setDoc(doc(db, "quotes", quote.id), {
          content: quote.content,
          author: quote.author,
          createdBy: uid,
          createdAt: serverTimestamp(),
        });
        await setDoc(doc(db, "users", uid, "createdQuotes", quote.id), {
          id: quote.id,
          content: quote.content,
          author: quote.author,
          createdAt: serverTimestamp(),
        });
        break;
      }
      case fetchQuoteMeta.type: {
        const quoteId = action.payload as string;
        const ref = doc(db, "quoteMeta", quoteId);
        const snap = await getDoc(ref);
        const data = snap.exists()
          ? (snap.data() as any)
          : { likeCount: 0, likedBy: [], commentCount: 0, savedBy: [] };
        storeAPI.dispatch(
          setMeta({
            id: quoteId,
            likeCount: data.likeCount,
            likedBy: data.likedBy,
            commentCount: data.commentCount,
            savedBy: data.savedBy,
          })
        );
        break;
      }
      case toggleLike.type: {
        const { id, userId } = action.payload;
        const ref = doc(db, "quoteMeta", id);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          const meta = snap.exists() ? snap.data() : { likedBy: [] };
          const likedBy: string[] = (meta as any).likedBy || [];
          const newLiked = likedBy.includes(userId)
            ? likedBy.filter((u) => u !== userId)
            : [userId, ...likedBy];
          tx.set(
            ref,
            { ...meta, likedBy: newLiked, likeCount: newLiked.length },
            { merge: true }
          );
        });
        break;
      }
      case addComment.type: {
        const { quoteId, text, userId } = action.payload;
        if (!userId) break;
        const commentRef = doc(
          collection(db, "quoteMeta", quoteId, "comments")
        );
        await setDoc(commentRef, {
          userId,
          text,
          createdAt: serverTimestamp(),
        });
        const parentRef = doc(db, "quoteMeta", quoteId);
        await updateDoc(parentRef, { commentCount: increment(1) });
        break;
      }
      case toggleSave.type: {
        const { id, userId } = action.payload;
        const ref = doc(db, "quoteMeta", id);
        await runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          const meta = snap.exists() ? snap.data() : { savedBy: [] };
          const savedBy: string[] = (meta as any).savedBy || [];
          const newSaved = savedBy.includes(userId)
            ? savedBy.filter((u) => u !== userId)
            : [userId, ...savedBy];
          tx.set(ref, { ...meta, savedBy: newSaved }, { merge: true });
        });
        break;
      }
      case saveQuote.type: {
        const quote = action.payload;
        const uid = state.auth.user?.uid;
        if (!uid) break;
        await setDoc(doc(db, "users", uid, "savedQuotes", quote.id), quote);
        break;
      }
      case unsaveQuote.type: {
        const quoteId = action.payload;
        const uid = state.auth.user?.uid;
        if (!uid) break;
        await deleteDoc(doc(db, "users", uid, "savedQuotes", quoteId));
        break;
      }
      default:
        break;
    }

    return result;
  };
