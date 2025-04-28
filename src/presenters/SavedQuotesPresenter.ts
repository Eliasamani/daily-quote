// src/presenters/SavedQuotesPresenter.ts
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { logoutUser } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { db } from "../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import type { Quote } from "../models/ExploreQuotesModel";
import {
  fetchQuoteMeta,
  toggleSave,
  QuoteMeta,
} from "../store/slices/quoteMetaSlice";
import { unsaveQuoteWithData } from "../store/slices/savedQuotesSlice";

type DashboardStackParamList = {
  SavedQuotes: undefined;
};

export function useSavedQuotesPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardStackParamList, "SavedQuotes">
    >();
  const uid = useSelector((s: RootState) => s.auth.user?.uid);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Global metadata from Redux
  const metaEntities = useSelector((s: RootState) => s.quoteMeta.entities);

  // Header buttons
  const onLogout = () => dispatch(logoutUser());
  const onLogoPress = () => navigation.goBack();

  // 1) Listen for full-quote snapshots under users/{uid}/savedQuotes
  useEffect(() => {
    if (!uid) {
      setQuotes([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const savedColl = collection(db, "users", uid, "savedQuotes");
    const unsub = onSnapshot(savedColl, (snap) => {
      const full = snap.docs.map((d) => d.data() as Quote);
      setQuotes(full);
      setIsLoading(false);

      // 2) For each saved quote, make sure its metadata is loaded
      full.forEach((q) => {
        if (!metaEntities[q.id]) {
          dispatch(fetchQuoteMeta(q.id));
        }
      });
    });
    return () => unsub();
  }, [uid, dispatch, metaEntities]);

  // Unsave handler
  const onUnsave = (quoteId: string) => {
    dispatch(toggleSave(quoteId));
    dispatch(unsaveQuoteWithData(quoteId));
  };

  return {
    onLogout,
    onLogoPress,
    quotes,
    isLoading,
    onUnsave,
    metaEntities,
    uid,
  };
}
