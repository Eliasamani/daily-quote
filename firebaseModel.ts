import { auth, db } from "./src/config/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  runTransaction,
  getDoc,
  onSnapshot,
  collection,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import type { AppDispatch } from "./src/store/store";
import { setMeta } from "./src/store/slices/quoteMetaSlice";

interface CreatedQuote {
  id: string;
  content: string;
  author: string;
  createdAt?: unknown;
}

interface Quote {
  id: string;
  [key: string]: any;
}

export async function persistNewQuote(q: CreatedQuote) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");
  await setDoc(doc(db, "quotes", q.id), {
    ...q,
    createdAt: serverTimestamp(),
    createdBy: user.uid,
  });
  await setDoc(doc(db, "users", user.uid, "createdQuotes", q.id), {
    ...q,
    createdAt: serverTimestamp(),
  });
}

export async function saveQuoteToFirestore(uid: string, quote: Quote) {
  await setDoc(doc(db, "users", uid, "savedQuotes", quote.id), quote);
}

export async function deleteSavedQuoteFromFirestore(
  uid: string,
  quoteId: string
) {
  await deleteDoc(doc(db, "users", uid, "savedQuotes", quoteId));
}

export async function toggleLikeInFirestore(quoteId: string, userId: string) {
  const ref = doc(db, "quoteMeta", quoteId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const meta = (snap.exists() ? snap.data() : { likedBy: [] }) as any;
    const likes = meta.likedBy ?? [];
    const newLikes = likes.includes(userId)
      ? likes.filter((u: string) => u !== userId)
      : [userId, ...likes];
    tx.set(
      ref,
      { ...meta, likedBy: newLikes, likeCount: newLikes.length },
      { merge: true }
    );
  });
}

export async function toggleSaveInFirestore(quoteId: string, userId: string) {
  const ref = doc(db, "quoteMeta", quoteId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const meta = (snap.exists() ? snap.data() : { savedBy: [] }) as any;
    const savedBy = meta.savedBy ?? [];
    const newSaved = savedBy.includes(userId)
      ? savedBy.filter((u: string) => u !== userId)
      : [userId, ...savedBy];
    tx.set(ref, { ...meta, savedBy: newSaved }, { merge: true });
  });
}

export async function addCommentInFirestore(
  quoteId: string,
  text: string,
  userId: string
) {
  if (!userId) throw new Error("No userId");
  await setDoc(doc(collection(db, "quoteMeta", quoteId, "comments")), {
    userId,
    text,
    createdAt: serverTimestamp(),
  });
  await setDoc(
    doc(db, "quoteMeta", quoteId),
    { commentCount: increment(1) },
    { merge: true }
  );
}

export function fetchQuoteMetaFromFirestore(
  quoteId: string,
  dispatch: AppDispatch
): () => void {
  const ref = doc(db, "quoteMeta", quoteId);

  getDoc(ref).then((snap) => {
    const data = snap.exists()
      ? (snap.data() as any)
      : { likeCount: 0, likedBy: [], commentCount: 0, savedBy: [] };
    dispatch(setMeta({ id: quoteId, ...data }));
  });

  const unsub = onSnapshot(ref, (snap) => {
    const data = snap.exists()
      ? (snap.data() as any)
      : { likeCount: 0, likedBy: [], commentCount: 0, savedBy: [] };
    dispatch(setMeta({ id: quoteId, ...data }));
  });

  return unsub;
}
