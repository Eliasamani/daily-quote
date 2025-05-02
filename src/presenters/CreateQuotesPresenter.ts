// src/presenters/CreateQuotesPresenter.ts
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { logoutUser } from "../store/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { auth, db } from "../config/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { Alert } from "react-native";

type DashboardStackParamList = {
  CreateQuotes: undefined;
};

export function useCreateQuotesPresenter() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation =
    useNavigation<
      StackNavigationProp<DashboardStackParamList, "CreateQuotes">
    >();
  // Grab the guest flag from Redux
  const guest = useSelector((s: RootState) => s.auth.guest);

  const onLogout = () => dispatch(logoutUser());
  const onLogoPress = () => navigation.navigate("Create"); 

  const submitQuote = async (
    content: string,
    author: string,
    genre: string[]
  ) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert("User not authenticated");
      return;
    }

    try {
      // 1) write to top-level /quotes
      const quotesRef = collection(db, "quotes");
      const newRef = doc(quotesRef);
      await setDoc(newRef, {
        content,
        author,
        genre,
        createdBy: userId,
        createdAt: serverTimestamp(),
      });

      // 2) snapshot under users/{uid}/createdQuotes/{id}
      const userRef = doc(db, "users", userId, "createdQuotes", newRef.id);
      await setDoc(userRef, {
        id: newRef.id,
        content,
        author,
        genre,
        createdBy: userId,
        createdAt: serverTimestamp(),
      });
      Alert.alert("Your quote has been submited");

      navigation.navigate("Create");
    
    } catch (err) {
      console.error("Error submitting quote:", err);
      Alert.alert("Failed to submit quote");
    }
  };

  return { onLogout, onLogoPress, submitQuote, guest };
}
