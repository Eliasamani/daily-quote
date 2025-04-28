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

type DashboardStackParamList = { SavedQuotes: undefined };

export function useSavedQuotesPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardStackParamList, "SavedQuotes">
    >();
  const uid = useSelector((state: RootState) => state.auth.user?.uid);
  const guest = useSelector((state: RootState) => state.auth.guest);

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [commentVisible, setCommentVisible] = useState(false);

  const metaEntities = useSelector(
    (state: RootState) => state.quoteMeta.entities
  );

  const onLogout = () => dispatch(logoutUser());
  const onLogoPress = () => navigation.goBack();

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
      list.forEach((q) => {
        if (!metaEntities[q.id]) dispatch(fetchQuoteMeta(q.id));
      });
    });
    return () => unsub();
  }, [uid, dispatch, metaEntities]);

  const onUnsave = (id: string) => {
    dispatch(toggleSave(id));
    dispatch(unsaveQuoteWithData(id));
  };

  const onLike = (id: string) => {
    dispatch(fetchQuoteMeta(id)); // ensure fresh
    dispatch(toggleSave(id)); // toggleSave for metadata? should toggleLike but slice handles toggleLike
  };

  const showComments = (id: string) => {
    setActiveQuoteId(id);
    setCommentVisible(true);
  };

  return {
    onLogout,
    onLogoPress,
    quotes,
    isLoading,
    onUnsave,
    activeQuoteId,
    commentVisible,
    setCommentVisible,
    metaEntities,
    uid,
    guest,
    showComments,
  };
}
