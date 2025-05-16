// src/presenters/SavedQuotesPresenter.ts
import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logoutUser } from "../store/slices/authSlice";
import {
  fetchQuoteMeta,
  toggleLike,
  toggleSave,
  QuoteMeta,
} from "../store/slices/quoteMetaSlice";
import { unsaveQuote } from "../store/slices/savedQuotesSlice";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { Quote } from "../models/ExploreQuotesModel";

type DashboardStackParamList = { SavedQuotes: undefined };

export function useSavedQuotesPresenter() {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardStackParamList, "SavedQuotes">
    >();
  const uid = useAppSelector((state) => state.auth.user?.uid);
  const guest = useAppSelector((state) => state.auth.guest);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [commentVisible, setCommentVisible] = useState(false);

  const metaEntities = useAppSelector((state) => state.quoteMeta.entities);

  // Track which IDs we've already dispatched fetchQuoteMeta for
  const fetchedMeta = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!uid) {
      setQuotes([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const coll = collection(db, "users", uid, "savedQuotes");
    const unsub = onSnapshot(coll, (snap) => {
      const list = snap.docs.map((d) => d.data() as Quote);
      setQuotes(list);
      setIsLoading(false);

      // Kick off metadata fetch exactly once per quote
      list.forEach((q) => {
        if (!metaEntities[q.id] && !fetchedMeta.current.has(q.id)) {
          fetchedMeta.current.add(q.id);
          dispatch(fetchQuoteMeta(q.id));
        }
      });
    });

    return () => unsub();
  }, [uid, dispatch]);

  // UI handlers
  const onLogout = () => dispatch(logoutUser());
  const onLogoPress = () => navigation.goBack();
  const showComments = (id: string) => {
    setActiveQuoteId(id);
    setCommentVisible(true);
  };

  // Toggle like in metadata
  const onLike = (id: string) => {
    if (!uid) return;
    dispatch(toggleLike({ id, userId: uid }));
  };

  // Unsave from both metadata and Firestore
  const onUnsave = (id: string) => {
    if (!uid) return;
    dispatch(toggleSave({ id, userId: uid }));
    dispatch(unsaveQuote(id));
  };

  return {
    guest,
    onLogout,
    onLogoPress,
    quotes,
    isLoading,
    activeQuoteId,
    commentVisible,
    setCommentVisible,
    metaEntities,
    uid,
    showComments,
    onLike,
    onUnsave,
  };
}
