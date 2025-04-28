import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { logoutUser } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { db } from "../config/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  QuerySnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import type { Quote } from "../models/ExploreQuotesModel";
import { fetchQuoteMeta, QuoteMeta } from "../store/slices/quoteMetaSlice";

type DashboardStackParamList = { MyQuotes: undefined };

export function useMyQuotesPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<StackNavigationProp<DashboardStackParamList, "MyQuotes">>();
  const uid = useSelector((s: RootState) => s.auth.user?.uid);
  const guest = useSelector((s: RootState) => s.auth.guest);

  const [myQuotes, setMyQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const metaEntities = useSelector((s: RootState) => s.quoteMeta.entities);

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
    const unsubscribe = onSnapshot(q, (snap: QuerySnapshot) => {
      const full = snap.docs.map(
        (d: QueryDocumentSnapshot) => d.data() as Quote
      );
      setMyQuotes(full);
      setIsLoading(false);
      full.forEach((quote: Quote) => {
        if (!metaEntities[quote.id]) {
          dispatch(fetchQuoteMeta(quote.id));
        }
      });
    });
    return () => unsubscribe();
  }, [uid, dispatch, metaEntities]);

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
