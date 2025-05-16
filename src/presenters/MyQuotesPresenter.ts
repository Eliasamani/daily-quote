// src/presenters/MyQuotesPresenter.ts
import { useEffect, useState, useRef } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAppDispatch, useAppSelector } from "../store/store";
import { logoutUser } from "../store/slices/authSlice";
import { fetchQuoteMeta, QuoteMeta } from "../store/slices/quoteMetaSlice";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { Quote } from "../models/ExploreQuotesModel";

type DashboardStackParamList = { MyQuotes: undefined };

export function useMyQuotesPresenter() {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<StackNavigationProp<DashboardStackParamList, "MyQuotes">>();
  const uid = useAppSelector((s) => s.auth.user?.uid);
  const guest = useAppSelector((s) => s.auth.guest);

  const [myQuotes, setMyQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // track fetched metadata IDs to avoid refetch loops
  const fetchedMeta = useRef<Set<string>>(new Set());

  const metaEntities = useAppSelector((s) => s.quoteMeta.entities);

  // Auth/UI handlers
  const onLogout = () => dispatch(logoutUser());
  const onLogoPress = () => navigation.goBack();

  useEffect(() => {
    if (!uid) {
      setMyQuotes([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const colRef = collection(db, "users", uid, "createdQuotes");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => d.data() as Quote);
      setMyQuotes(list);
      setIsLoading(false);

      // fetch metadata exactly once per quote
      list.forEach((quote) => {
        if (!metaEntities[quote.id] && !fetchedMeta.current.has(quote.id)) {
          fetchedMeta.current.add(quote.id);
          dispatch(fetchQuoteMeta(quote.id));
        }
      });
    });

    return () => unsubscribe();
  }, [uid, dispatch]); // <— drop metaEntities here

  return {
    onLogout,
    onLogoPress,
    myQuotes,
    isLoading,
    metaEntities,
    uid,
    guest,
  };
}
